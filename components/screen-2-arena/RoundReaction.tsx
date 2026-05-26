"use client";

import { useEffect, useMemo, useState } from "react";

const CROWD_CHEERS = [
  "THE ARENA STIRS. A POINT LANDED.",
  "WHISPERS OF APPROVAL FROM THE STANDS.",
  "THEY SAW THAT. THE CROWD LEANS IN.",
  "A RIPPLE THROUGH THE COLOSSEUM.",
  "RARE. THEY RESPECT THAT.",
];

const CROWD_BOOS = [
  "THE ARENA GROWS COLD.",
  "SILENCE. WORSE THAN JEERING.",
  "THEY EXPECTED MORE FROM YOU.",
  "THE STANDS SHIFT UNCOMFORTABLY.",
  "EVEN YOUR ALLIES LOOK AWAY.",
];

const CROWD_MURMUR = [
  "THE CROWD IS UNCONVINCED.",
  "CONTESTED. THE ARENA IS DIVIDED.",
  "NEITHER SIDE CLAIMS THIS ROUND.",
  "THE DEBATE CONTINUES. AS IT SHOULD.",
  "EQUILIBRIUM. FOR NOW.",
];

export interface RoundReactionProps {
  show: boolean;
  playerDamageDealt: number;
  playerDamageTaken: number;
  onDismiss: () => void;
}

type ReactionType = "cheers" | "boos" | "murmur";

function getReactionType(
  dealt: number,
  taken: number
): ReactionType {
  const diff = dealt - taken;
  if (diff > 3) return "cheers";
  if (diff < -3) return "boos";
  return "murmur";
}

const STYLE: Record<
  ReactionType,
  { color: string; label: string }
> = {
  cheers: { color: "#a78bfa", label: "player-accent" },
  boos: { color: "#f87171", label: "ai-accent" },
  murmur: { color: "#60a5fa", label: "neutral-glow" },
};

export default function RoundReaction({
  show,
  playerDamageDealt,
  playerDamageTaken,
  onDismiss,
}: RoundReactionProps) {
  const [exiting, setExiting] = useState(false);
  const [visible, setVisible] = useState(false);

  const reactionType = getReactionType(
    playerDamageDealt,
    playerDamageTaken
  );

  const message = useMemo(() => {
    const pool =
      reactionType === "cheers"
        ? CROWD_CHEERS
        : reactionType === "boos"
          ? CROWD_BOOS
          : CROWD_MURMUR;
    return pool[Math.floor(Math.random() * pool.length)];
  }, [reactionType, show, playerDamageDealt, playerDamageTaken]);

  const { color } = STYLE[reactionType];

  useEffect(() => {
    if (!show) {
      setVisible(false);
      setExiting(false);
      return;
    }

    setExiting(false);
    setVisible(true);

    const dismissTimer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        setVisible(false);
        onDismiss();
      }, 200);
    }, 3000);

    return () => clearTimeout(dismissTimer);
  }, [show, playerDamageDealt, playerDamageTaken, onDismiss]);

  if (!visible && !show) return null;

  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 z-50 bottom-[120px] ${
        exiting ? "animate-reaction-exit" : "animate-reaction-enter"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 bg-arena-surface border border-arena-border rounded-full py-3.5 px-6">
        <span
          className="w-2 h-2 rounded-full shrink-0 animate-pulse-dot"
          style={{ backgroundColor: color }}
        />
        <p
          className="font-display font-bold text-[13px] uppercase tracking-[0.1em] whitespace-nowrap"
          style={{ color }}
        >
          {message}
        </p>
      </div>
    </div>
  );
}
