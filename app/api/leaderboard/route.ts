import { getSupabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await getSupabase()
      .from("debate_sessions")
      .select(
        "id, created_at, topic, character_id, player_final_hp, ai_final_hp, avg_logic, avg_evidence, avg_clarity, won, rounds_won, total_damage_dealt"
      )
      .order("avg_logic", { ascending: false })
      .limit(10);

    if (error) {
      console.error("leaderboard error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ leaderboard: data ?? [] });
  } catch (error) {
    console.error("leaderboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
