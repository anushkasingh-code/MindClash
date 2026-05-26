import { getSupabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

type SaveSessionBody = {
  topic: string;
  characterId: string;
  playerFinalHP: number;
  aiFinalHP: number;
  avgLogic: number;
  avgEvidence: number;
  avgClarity: number;
  won: boolean;
  roundsWon: number;
  totalDamageDealt: number;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SaveSessionBody;
    const {
      topic,
      characterId,
      playerFinalHP,
      aiFinalHP,
      avgLogic,
      avgEvidence,
      avgClarity,
      won,
      roundsWon,
      totalDamageDealt,
    } = body;

    if (!topic || !characterId) {
      return NextResponse.json(
        { error: "topic and characterId are required" },
        { status: 400 }
      );
    }

    const { error } = await getSupabase().from("debate_sessions").insert({
      topic,
      character_id: characterId,
      player_final_hp: playerFinalHP,
      ai_final_hp: aiFinalHP,
      avg_logic: avgLogic,
      avg_evidence: avgEvidence,
      avg_clarity: avgClarity,
      won,
      rounds_won: roundsWon,
      total_damage_dealt: totalDamageDealt,
    });

    if (error) {
      console.error("save-session error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("save-session error:", error);
    return NextResponse.json(
      { error: "Failed to save session" },
      { status: 500 }
    );
  }
}
