"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getAllTopicsMixed,
  type DebateDifficulty,
} from "@/lib/topicEngine";

export interface TopicRevealProps {
  topic: string;
  difficulty: DebateDifficulty;
  onAccept: () => void;
}

const DIFFICULTY_ACCENT: Record<DebateDifficulty, string> = {
  NOVICE: "#34d399",
  CHALLENGER: "#a78bfa",
  BRUTAL: "#f87171",
};

type Phase = "scanning" | "locking" | "revealed";

function pickReelTopics(count: number): string[] {
  const pool = getAllTopicsMixed();
  const picked: string[] = [];
  for (let i = 0; i < count; i++) {
    picked.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  return picked;
}

export default function TopicReveal({
  topic,
  difficulty,
  onAccept,
}: TopicRevealProps) {
  const [phase, setPhase] = useState<Phase>("scanning");
  const [reelIndex, setReelIndex] = useState(0);
  const [flash, setFlash] = useState(false);
  const reelTopics = useMemo(() => pickReelTopics(8), []);

  const accent = DIFFICULTY_ACCENT[difficulty];

  useEffect(() => {
    if (phase !== "scanning") return;

    const interval = setInterval(() => {
      setReelIndex((i) => (i + 1) % reelTopics.length);
    }, 80);

    const toLocking = setTimeout(() => {
      clearInterval(interval);
      setPhase("locking");
    }, 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(toLocking);
    };
  }, [phase, reelTopics.length]);

  useEffect(() => {
    if (phase !== "locking") return;

    setFlash(true);
    const flashOff = setTimeout(() => setFlash(false), 300);
    const toRevealed = setTimeout(() => setPhase("revealed"), 500);

    return () => {
      clearTimeout(flashOff);
      clearTimeout(toRevealed);
    };
  }, [phase]);

  const displayText =
    phase === "revealed" ? topic : reelTopics[reelIndex];

  return (
    <section className="min-h-[calc(100vh-57px)] flex flex-col items-center justify-center bg-arena-bg px-6 py-12 relative overflow-hidden">
      <div
        className="scan-line-overlay pointer-events-none absolute inset-0 z-10"
        aria-hidden
      />

      <div
        className={`relative z-20 max-w-3xl w-full text-center transition-all duration-300 ${
          phase === "scanning"
            ? "text-arena-muted blur-[1px]"
            : phase === "locking"
              ? "text-white blur-0"
              : "text-white blur-0"
        }`}
        style={
          flash
            ? {
                boxShadow: `0 0 0 2px ${accent}`,
                borderRadius: "12px",
                padding: "24px",
              }
            : undefined
        }
      >
        <p
          className={`font-display font-bold leading-snug transition-all ${
            phase === "revealed"
              ? "text-[28px] font-extrabold"
              : "text-xl font-bold"
          }`}
        >
          {displayText}
        </p>

        {phase === "revealed" && (
          <div className="mt-6 flex flex-col items-center gap-4 animate-[fadeIn_0.4s_ease-out]">
            <span
              className="font-display font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border"
              style={{ color: accent, borderColor: accent }}
            >
              {difficulty}
            </span>
            <p className="font-body text-xs text-arena-muted italic max-w-md">
              This is your battleground. There are no alternatives.
            </p>
            <button
              type="button"
              onClick={onAccept}
              className="mt-4 font-display font-extrabold text-sm uppercase tracking-wider bg-player-accent text-arena-bg px-8 py-4 rounded-lg hover:brightness-110 transition-all"
            >
              ACCEPT AND CHOOSE OPPONENT →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
