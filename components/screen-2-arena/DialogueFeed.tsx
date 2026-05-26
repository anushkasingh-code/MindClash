"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getCharacterAvatarPath } from "@/lib/avatars";

export type DialogueMessage = {
  role: "user" | "ai";
  content: string;
  reactionTag?: string;
};

export interface DialogueFeedProps {
  messages: DialogueMessage[];
  isLoading: boolean;
  characterName: string;
  characterAccent: string;
  playerAvatarSeed: string;
  characterId: string;
}

const REACTION_TAGS = [
  "LOGICAL ATTACK",
  "PREMISE DENIED",
  "EVIDENCE DEMANDED",
  "REFRAMED",
  "AD ABSURDUM",
] as const;

function playerAvatarUrl(seed: string) {
  return `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${seed}&backgroundColor=1a1330`;
}

function TypewriterText({
  text,
  speedMs = 18,
  onComplete,
}: {
  text: string;
  speedMs?: number;
  onComplete?: () => void;
}) {
  const [displayed, setDisplayed] = useState("");
  const completedRef = useRef(false);

  useEffect(() => {
    setDisplayed("");
    completedRef.current = false;
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete?.();
        }
      }
    }, speedMs);
    return () => clearInterval(interval);
  }, [text, speedMs, onComplete]);

  return <span>{displayed}</span>;
}

function AiMessageBubble({
  content,
  reactionTag,
  characterName,
  characterAccent,
  characterId,
  isLatest,
}: {
  content: string;
  reactionTag?: string;
  characterName: string;
  characterAccent: string;
  characterId: string;
  isLatest: boolean;
}) {
  const [typingDone, setTypingDone] = useState(!isLatest);

  useEffect(() => {
    if (!isLatest) setTypingDone(true);
  }, [isLatest]);
  const tag =
    reactionTag ??
    REACTION_TAGS[content.length % REACTION_TAGS.length];

  return (
    <div className="bubble-enter flex flex-col gap-2 max-w-[85%]">
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-full overflow-hidden shrink-0 ring-1"
          style={{ boxShadow: `0 0 0 1px ${characterAccent}` }}
        >
          <Image
            src={getCharacterAvatarPath(characterId)}
            alt={characterName}
            width={28}
            height={28}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>
        <span
          className="font-display font-bold text-xs uppercase tracking-wide"
          style={{ color: characterAccent }}
        >
          {characterName}
        </span>
      </div>
      <div
        className="p-4 border rounded-xl rounded-bl-[4px] text-left"
        style={{
          backgroundColor: "#f871711a",
          borderColor: "#f87171",
          borderWidth: "0.5px",
        }}
      >
        <p className="font-body text-sm text-white leading-relaxed">
          {isLatest && !typingDone ? (
            <TypewriterText
              text={content}
              onComplete={() => setTypingDone(true)}
            />
          ) : (
            content
          )}
        </p>
        {typingDone && (
          <span
            className="inline-block mt-3 font-display font-bold text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border bg-arena-bg"
            style={{ color: characterAccent, borderColor: characterAccent }}
          >
            {tag}
          </span>
        )}
      </div>
    </div>
  );
}

export default function DialogueFeed({
  messages,
  isLoading,
  characterName,
  characterAccent,
  playerAvatarSeed,
  characterId,
}: DialogueFeedProps) {
  const feedRef = useRef<HTMLDivElement>(null);
  const lastAiIndex = messages.map((m) => m.role).lastIndexOf("ai");

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div
      ref={feedRef}
      className="bg-arena-surface border border-arena-border rounded-xl max-h-[420px] overflow-y-auto p-5 flex flex-col gap-5"
    >
      {messages.map((msg, index) => {
        if (msg.role === "user") {
          return (
            <div
              key={`user-${index}-${msg.content.slice(0, 12)}`}
              className="bubble-enter flex flex-col gap-2 max-w-[85%] ml-auto items-end"
            >
              <div className="flex items-center gap-2 flex-row-reverse">
                <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 ring-1 ring-player-accent">
                  <Image
                    src={playerAvatarUrl(playerAvatarSeed)}
                    alt="You"
                    width={28}
                    height={28}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
                <span className="font-display font-bold text-xs uppercase tracking-wide text-player-accent">
                  You
                </span>
              </div>
              <div
                className="p-4 border rounded-xl rounded-br-[4px] text-right"
                style={{
                  backgroundColor: "#a78bfa26",
                  borderColor: "#a78bfa",
                  borderWidth: "0.5px",
                }}
              >
                <p className="font-body text-sm text-white leading-relaxed text-left">
                  {msg.content}
                </p>
              </div>
            </div>
          );
        }

        return (
          <AiMessageBubble
            key={`ai-${index}-${msg.content.slice(0, 12)}`}
            content={msg.content}
            reactionTag={msg.reactionTag}
            characterName={characterName}
            characterAccent={characterAccent}
            characterId={characterId}
            isLatest={index === lastAiIndex && !isLoading}
          />
        );
      })}

      {isLoading && (
        <div className="flex items-center gap-1.5 py-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="loading-dot w-2 h-2 rounded-full bg-ai-accent"
            />
          ))}
        </div>
      )}
    </div>
  );
}
