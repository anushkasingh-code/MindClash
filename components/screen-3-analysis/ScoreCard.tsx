"use client";

import { motion } from "framer-motion";

export interface ScoreCardProps {
  won: boolean;
  withdrawn?: boolean;
  playerHP: number;
  roundsWon: number;
  avgLogicScore: number;
  totalDamageDealt: number;
  characterName: string;
}

const METRICS = [
  { key: "playerHP", label: "HP Remaining" },
  { key: "roundsWon", label: "Rounds Won" },
  { key: "avgLogicScore", label: "Avg Logic Score" },
  { key: "totalDamageDealt", label: "Total Damage Dealt" },
] as const;

export default function ScoreCard({
  won,
  withdrawn = false,
  playerHP,
  roundsWon,
  avgLogicScore,
  totalDamageDealt,
  characterName,
}: ScoreCardProps) {
  const values: Record<(typeof METRICS)[number]["key"], number> = {
    playerHP,
    roundsWon,
    avgLogicScore,
    totalDamageDealt,
  };

  return (
    <article className="w-full bg-arena-surface rounded-2xl border border-arena-border p-8">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="text-center mb-8"
      >
        <h2
          className={`font-display font-extrabold text-[36px] uppercase tracking-tight ${
            withdrawn
              ? "text-neutral-glow"
              : won
                ? "text-player-accent"
                : "text-ai-accent"
          }`}
        >
          {withdrawn
            ? "WITHDREW FROM COMBAT"
            : won
              ? "MIND UNBROKEN"
              : "ARGUMENT COLLAPSED"}
        </h2>
        <p className="font-body text-arena-muted mt-2 text-[15px]">
          You vs {characterName}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {METRICS.map(({ key, label }) => (
          <div
            key={key}
            className="bg-arena-bg border border-arena-border rounded-xl p-5 text-center"
          >
            <p className="font-body text-[11px] uppercase tracking-wider text-arena-muted mb-1">
              {label}
            </p>
            <p className="font-display font-extrabold text-[28px] text-white">
              {key === "avgLogicScore"
                ? values[key].toFixed(1)
                : values[key]}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}
