import { asSystemInstruction, getRefereeModel } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

type VerdictRequestBody = {
  characterId: string;
  topic: string;
  fullConversation: Array<{ role: string; parts: [{ text: string }] }>;
  finalMetrics: {
    avgLogic: number;
    avgEvidence: number;
    avgClarity: number;
    playerFinalHP: number;
    aiFinalHP: number;
    roundsWon: number;
  };
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as VerdictRequestBody;
    const { characterId, topic, fullConversation, finalMetrics } = body;

    const verdictPrompt = `You are The Referee delivering the final post-match verdict.

MATCH DATA:
- Topic: ${topic}
- Opponent: ${characterId}
- Player Final HP: ${finalMetrics.playerFinalHP}/100
- AI Final HP: ${finalMetrics.aiFinalHP}/100  
- Rounds Won by Player: ${finalMetrics.roundsWon}
- Average Logic Score: ${finalMetrics.avgLogic}/10
- Average Evidence Score: ${finalMetrics.avgEvidence}/10
- Average Clarity Score: ${finalMetrics.avgClarity}/10

FULL TRANSCRIPT:
${fullConversation.map((m) => `${m.role.toUpperCase()}: ${m.parts[0].text}`).join("\n\n")}

Write a 3-4 paragraph post-match verdict. Use these exact section labels on their own lines:
STRENGTH: [one paragraph — what the player genuinely did well, be specific]
WEAKNESS: [one paragraph — where they fundamentally failed, be specific and harsh]  
VERDICT: [final judgment — did this player demonstrate real critical thinking or 
just emotional reaction and motivated reasoning? Would they survive a real debate?]

Be specific to what they actually said. Do not be generic. Do not coddle.`;

    const refereeModel = getRefereeModel();
    const refereeChat = refereeModel.startChat({
      systemInstruction: asSystemInstruction(
        "You are The Referee in MindClash. Deliver blunt, specific post-match analysis."
      ),
    });
    const result = await refereeChat.sendMessage(verdictPrompt);

    return NextResponse.json({ critiqueText: result.response.text() });
  } catch {
    return NextResponse.json(
      { error: "Combat systems offline" },
      { status: 500 }
    );
  }
}
