"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getCharacterAvatarPath } from "@/lib/avatars";

export interface HealthBarsProps {
  playerHP: number;
  aiHP: number;
  round: number;
  maxRounds: number;
  playerName: string;
  playerRank: number;
  playerAvatarSeed: string;
  characterId: string;
  characterName: string;
}

function playerAvatarUrl(seed: string) {
  return `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${seed}&backgroundColor=1a1330`;
}

function HealthBarFill({
  hp,
  side,
  shake,
}: {
  hp: number;
  side: "player" | "ai";
  shake: boolean;
}) {
  const clamped = Math.max(0, Math.min(100, hp));
  const colorClass =
    side === "player" ? "bg-player-accent" : "bg-ai-accent";
  const danger = clamped > 0 && clamped < 30;

  return (
    <div
      className={`relative w-full h-[10px] rounded-full bg-arena-border overflow-hidden ${
        shake ? "animate-shake" : ""
      }`}
    >
      <motion.div
        className={`absolute top-0 h-full rounded-full ${colorClass} ${
          side === "ai" ? "right-0" : "left-0"
        } ${danger ? "animate-danger-pulse" : ""}`}
        initial={false}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={
          side === "ai"
            ? { right: 0, left: "auto" }
            : { left: 0, right: "auto" }
        }
      />
    </div>
  );
}

export default function HealthBars({
  playerHP,
  aiHP,
  round,
  maxRounds,
  playerName,
  playerRank,
  playerAvatarSeed,
  characterId,
  characterName,
}: HealthBarsProps) {
  const prevPlayerHP = useRef(playerHP);
  const prevAiHP = useRef(aiHP);
  const [shakePlayer, setShakePlayer] = useState(false);
  const [shakeAi, setShakeAi] = useState(false);

  useEffect(() => {
    if (playerHP < prevPlayerHP.current) {
      setShakePlayer(true);
      const t = setTimeout(() => setShakePlayer(false), 400);
      prevPlayerHP.current = playerHP;
      return () => clearTimeout(t);
    }
    prevPlayerHP.current = playerHP;
  }, [playerHP]);

  useEffect(() => {
    if (aiHP < prevAiHP.current) {
      setShakeAi(true);
      const t = setTimeout(() => setShakeAi(false), 400);
      prevAiHP.current = aiHP;
      return () => clearTimeout(t);
    }
    prevAiHP.current = aiHP;
  }, [aiHP]);

  return (
    <header className="relative z-10 w-full bg-arena-bg px-6 py-4 border-b border-arena-border">
      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-start max-w-6xl mx-auto">
        {/* Player block */}
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex items-center gap-3">
            <div className="w-[52px] h-[52px] rounded-full ring-2 ring-player-accent overflow-hidden shrink-0">
              <Image
                src={playerAvatarUrl(playerAvatarSeed)}
                alt={playerName}
                width={52}
                height={52}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <div className="min-w-0">
              <p className="font-display font-extrabold text-white uppercase text-sm tracking-wide truncate">
                You — {playerName}
              </p>
              <p className="font-body text-arena-muted text-[11px]">
                Rank {playerRank}
              </p>
            </div>
          </div>
          <HealthBarFill hp={playerHP} side="player" shake={shakePlayer} />
        </div>

        {/* Round counter */}
        <div className="flex flex-col items-center justify-center pt-1 px-4">
          <p className="font-display font-extrabold text-white text-xl tracking-widest whitespace-nowrap">
            RND {round} / {maxRounds}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ai-accent animate-pulse-dot" />
            <span className="font-body text-[10px] uppercase tracking-widest text-ai-accent font-medium">
              Live Combat
            </span>
          </div>
        </div>

        {/* AI block */}
        <div className="flex flex-col gap-2 min-w-0 items-end text-right">
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className="w-[52px] h-[52px] rounded-full ring-2 ring-ai-accent overflow-hidden shrink-0">
              <Image
                src={getCharacterAvatarPath(characterId)}
                alt={characterName}
                width={52}
                height={52}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <div className="min-w-0">
              <p className="font-display font-extrabold text-white uppercase text-sm tracking-wide truncate">
                {characterName}
              </p>
              <p className="font-body text-arena-muted text-[11px]">
                Opponent
              </p>
            </div>
          </div>
          <div className="w-full flex flex-row-reverse">
            <div className="w-full">
              <HealthBarFill hp={aiHP} side="ai" shake={shakeAi} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
