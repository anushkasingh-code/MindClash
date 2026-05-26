"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { DebateDifficulty } from "@/lib/topicEngine";

export interface MatchConfigProps {
  onConfirm: (difficulty: DebateDifficulty, rounds: number) => void;
}

const DIFFICULTY_OPTIONS: {
  id: DebateDifficulty;
  accent: string;
  title: string;
  subtitle: string;
  tag: string;
  description: string;
  rounds: number;
}[] = [
  {
    id: "NOVICE",
    accent: "#34d399",
    title: "NOVICE",
    subtitle: "Build your footing",
    tag: "3 ROUNDS",
    description: "Accessible topics. Room to think. Still no hand-holding.",
    rounds: 3,
  },
  {
    id: "CHALLENGER",
    accent: "#a78bfa",
    title: "CHALLENGER",
    subtitle: "Where real thinking starts",
    tag: "4 ROUNDS",
    description: "Contested territory. The opponent adapts. Prepare.",
    rounds: 4,
  },
  {
    id: "BRUTAL",
    accent: "#f87171",
    title: "BRUTAL",
    subtitle: "No safety net",
    tag: "5 ROUNDS",
    description: "The hardest topics. Maximum opponent aggression.",
    rounds: 5,
  },
];

export default function MatchConfig({ onConfirm }: MatchConfigProps) {
  const [selected, setSelected] = useState<DebateDifficulty | null>(null);

  const selectedOption = DIFFICULTY_OPTIONS.find((o) => o.id === selected);

  return (
    <section className="min-h-[calc(100vh-57px)] flex flex-col items-center justify-center bg-arena-bg px-6 py-12">
      <header className="mb-10 text-center">
        <h2 className="font-display font-extrabold text-white uppercase text-2xl tracking-tight">
          SELECT COMBAT LEVEL
        </h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl w-full mb-10">
        {DIFFICULTY_OPTIONS.map((option) => {
          const isSelected = selected === option.id;
          return (
            <motion.button
              key={option.id}
              type="button"
              onClick={() => setSelected(option.id)}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="text-left rounded-xl p-6 border transition-colors"
              style={{
                backgroundColor: isSelected
                  ? `${option.accent}14`
                  : "var(--color-arena-surface)",
                borderColor: isSelected ? option.accent : "#1e1e35",
                borderWidth: isSelected ? "1px" : "1px",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = option.accent;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = "#1e1e35";
                }
              }}
            >
              <h3
                className="font-display font-extrabold text-lg uppercase tracking-wide mb-1"
                style={{ color: option.accent }}
              >
                {option.title}
              </h3>
              <p className="font-body text-xs text-arena-muted mb-3">
                {option.subtitle}
              </p>
              <span
                className="inline-block font-display font-bold text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border mb-3"
                style={{
                  color: option.accent,
                  borderColor: `${option.accent}80`,
                }}
              >
                {option.tag}
              </span>
              <p className="font-body text-[11px] text-arena-muted leading-relaxed">
                {option.description}
              </p>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedOption && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
          >
            <button
              type="button"
              onClick={() =>
                onConfirm(selectedOption.id, selectedOption.rounds)
              }
              className="font-display font-extrabold text-sm uppercase tracking-wider bg-player-accent text-arena-bg px-8 py-4 rounded-lg hover:brightness-110 transition-all"
            >
              GENERATE MY TOPIC →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
