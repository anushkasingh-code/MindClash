"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { getCharacterAvatarPath } from "@/lib/avatars";
import { CHARACTERS } from "@/lib/characters";

export interface AvatarSelectorProps {
  onSelect: (characterId: string) => void;
  unlockedIds: string[];
}

const DIFFICULTY_STYLES: Record<
  (typeof CHARACTERS)[number]["difficulty"],
  string
> = {
  STARTER: "text-emerald-400 border-emerald-400/50 bg-emerald-400/10",
  ADVANCED: "text-neutral-glow border-neutral-glow/50 bg-neutral-glow/10",
  BOSS: "text-ai-accent border-ai-accent/50 bg-ai-accent/10",
};

export default function AvatarSelector({
  onSelect,
  unlockedIds,
}: AvatarSelectorProps) {
  return (
    <section className="w-full bg-arena-bg px-6 py-10">
      <h2 className="font-display font-extrabold text-white uppercase text-[28px] tracking-tight mb-8">
        SELECT YOUR OPPONENT
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {CHARACTERS.map((char) => {
          const isLocked =
            char.locked && !unlockedIds.includes(char.id);
          const canSelect = !isLocked;

          return (
            <motion.button
              key={char.id}
              type="button"
              disabled={isLocked}
              onClick={() => canSelect && onSelect(char.id)}
              whileHover={canSelect ? { y: -2 } : undefined}
              className={`relative text-left bg-arena-surface rounded-xl p-5 border border-arena-border transition-colors ${
                canSelect
                  ? "hover:border-neutral-glow cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              {isLocked && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-arena-bg/60">
                  <span className="text-2xl text-arena-muted" aria-hidden>
                    🔒
                  </span>
                </div>
              )}

              <div
                className="w-[72px] h-[72px] rounded-full overflow-hidden mb-4 ring-2"
                style={{ boxShadow: `0 0 0 2px ${char.accent}` }}
              >
                <Image
                  src={getCharacterAvatarPath(char.id)}
                  alt={char.name}
                  width={72}
                  height={72}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>

              <h3
                className="font-display font-extrabold text-white uppercase text-sm tracking-wide mb-1"
                style={{ color: canSelect ? char.accent : undefined }}
              >
                {char.name}
              </h3>
              <p className="font-body text-arena-muted text-xs mb-3 leading-relaxed">
                {char.desc}
              </p>
              <span
                className={`inline-block font-display font-bold text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border ${DIFFICULTY_STYLES[char.difficulty]}`}
              >
                {char.difficulty}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
