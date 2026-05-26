import {
  asSystemInstruction,
  getDebateModel,
  getRefereeModel,
} from "@/lib/gemini";
import { getCharacter } from "@/lib/characters";
import { REFEREE_SYSTEM_PROMPT } from "@/lib/referee";
import { NextRequest, NextResponse } from "next/server";

type ConversationMessage = {
  role: "user" | "model";
  parts: [{ text: string }];
};

type DebateRequestBody = {
  characterId: string;
  topic: string;
  conversationHistory: ConversationMessage[];
  playerArgument: string;
  round: number;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as DebateRequestBody;
    const {
      characterId,
      topic,
      conversationHistory,
      playerArgument,
      round,
    } = body;

    const character = getCharacter(characterId);
    if (!character) {
      return NextResponse.json(
        { error: "Character not found" },
        { status: 400 }
      );
    }

    const debateModel = getDebateModel();
    const debateChat = debateModel.startChat({
      history: conversationHistory,
      systemInstruction: asSystemInstruction(
        character.debateSystemPrompt +
          `\n\nCurrent topic being debated: "${topic}"\nCurrent round: ${round}`
      ),
    });
    const debateResult = await debateChat.sendMessage(playerArgument);
    const aiResponseText = debateResult.response.text();

    const refereeModel = getRefereeModel();
    const refereeChat = refereeModel.startChat({
      systemInstruction: asSystemInstruction(REFEREE_SYSTEM_PROMPT),
    });
    const refereePrompt = `TOPIC: ${topic}
ROUND: ${round}
CHARACTER NOTES: ${character.refereeNotes}
PLAYER ARGUED: ${playerArgument}
AI RESPONDED: ${aiResponseText}
Score this exchange now. Return only JSON.`;

    const refereeResult = await refereeChat.sendMessage(refereePrompt);
    const refereeRaw = refereeResult.response.text();

    let refereeData: {
      logicScore: number;
      evidenceScore: number;
      clarityScore: number;
      playerHPDamage: number;
      aiHPDamage: number;
      reactionTag: string;
      refereeSummaryLine: string;
    };

    try {
      const cleaned = refereeRaw.replace(/```json|```/g, "").trim();
      refereeData = JSON.parse(cleaned);
    } catch {
      refereeData = {
        logicScore: 5,
        evidenceScore: 5,
        clarityScore: 5,
        playerHPDamage: 15,
        aiHPDamage: 5,
        reactionTag: "LOGICAL ATTACK",
        refereeSummaryLine:
          "The referee's systems are experiencing interference.",
      };
    }

    return NextResponse.json({
      aiResponseText,
      reactionTag: refereeData.reactionTag,
      metrics: {
        logicScore: refereeData.logicScore,
        evidenceScore: refereeData.evidenceScore,
        clarityScore: refereeData.clarityScore,
      },
      playerHPDamage: refereeData.playerHPDamage,
      aiHPDamage: refereeData.aiHPDamage,
      refereeSummaryLine: refereeData.refereeSummaryLine,
    });
  } catch (error) {
    console.error("Debate API error:", error);
    return NextResponse.json(
      { error: "Combat systems offline" },
      { status: 500 }
    );
  }
}
