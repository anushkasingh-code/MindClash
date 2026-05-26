"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export interface RefereeCritiqueProps {
  critiqueText: string;
  onRematch: () => void;
  onChangeOpponent: () => void;
}

const REFEREE_AVATAR =
  "https://api.dicebear.com/8.x/bottts-neutral/svg?seed=referee&backgroundColor=1a1330";

type CritiqueSection = {
  type: "strength" | "weakness" | "verdict" | "plain";
  body: string;
};

function parseCritique(text: string): CritiqueSection[] {
  const markers = [
    { key: "STRENGTH:", type: "strength" as const },
    { key: "WEAKNESS:", type: "weakness" as const },
    { key: "VERDICT:", type: "verdict" as const },
  ];

  const sections: CritiqueSection[] = [];
  let remaining = text.trim();

  while (remaining.length > 0) {
    let earliest: {
      index: number;
      marker: (typeof markers)[number];
    } | null = null;

    for (const marker of markers) {
      const idx = remaining.toUpperCase().indexOf(marker.key);
      if (idx !== -1 && (earliest === null || idx < earliest.index)) {
        earliest = { index: idx, marker };
      }
    }

    if (!earliest) {
      sections.push({ type: "plain", body: remaining });
      break;
    }

    if (earliest.index > 0) {
      const plain = remaining.slice(0, earliest.index).trim();
      if (plain) sections.push({ type: "plain", body: plain });
    }

    remaining = remaining.slice(earliest.index + earliest.marker.key.length);
    let nextStart = remaining.length;
    for (const m of markers) {
      const idx = remaining.toUpperCase().indexOf(m.key);
      if (idx !== -1 && idx < nextStart) nextStart = idx;
    }

    const body = remaining.slice(0, nextStart).trim();
    sections.push({ type: earliest.marker.type, body });
    remaining = remaining.slice(nextStart).trim();
  }

  if (sections.length === 0) {
    sections.push({ type: "plain", body: text });
  }

  return sections;
}

function SectionBlock({ section }: { section: CritiqueSection }) {
  if (section.type === "strength") {
    return (
      <p className="font-body text-sm leading-relaxed text-player-accent">
        <span className="font-display font-bold uppercase text-xs tracking-widest block mb-1">
          Strength
        </span>
        {section.body}
      </p>
    );
  }
  if (section.type === "weakness") {
    return (
      <p className="font-body text-sm leading-relaxed text-ai-accent">
        <span className="font-display font-bold uppercase text-xs tracking-widest block mb-1">
          Weakness
        </span>
        {section.body}
      </p>
    );
  }
  if (section.type === "verdict") {
    return (
      <p className="font-display font-extrabold text-white text-lg leading-snug">
        <span className="font-display font-bold uppercase text-xs tracking-widest text-arena-muted block mb-1">
          Verdict
        </span>
        {section.body}
      </p>
    );
  }
  return (
    <p className="font-body text-sm text-white/90 leading-relaxed">{section.body}</p>
  );
}

export default function RefereeCritique({
  critiqueText,
  onRematch,
  onChangeOpponent,
}: RefereeCritiqueProps) {
  const [displayed, setDisplayed] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const sections = useMemo(() => parseCritique(critiqueText), [critiqueText]);

  useEffect(() => {
    setDisplayed("");
    setTypingDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setDisplayed(critiqueText.slice(0, i));
      if (i >= critiqueText.length) {
        clearInterval(interval);
        setTypingDone(true);
      }
    }, 12);
    return () => clearInterval(interval);
  }, [critiqueText]);

  return (
    <section className="w-full bg-arena-surface border border-arena-border rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-neutral-glow shrink-0">
          <Image
            src={REFEREE_AVATAR}
            alt="The Referee"
            width={40}
            height={40}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>
        <h3 className="font-display font-extrabold text-white uppercase tracking-wide text-sm">
          THE REFEREE&apos;S VERDICT
        </h3>
      </div>

      <div className="space-y-4 mb-8 min-h-[80px]">
        {!typingDone ? (
          <p className="font-body text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
            {displayed}
            <span className="inline-block w-0.5 h-4 bg-neutral-glow ml-0.5 animate-pulse align-middle" />
          </p>
        ) : (
          <div className="space-y-4">
            {sections.map((s, i) => (
              <SectionBlock key={i} section={s} />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onRematch}
          className="font-display font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg border border-player-accent text-player-accent hover:bg-player-accent/10 transition-colors"
        >
          REMATCH
        </button>
        <button
          type="button"
          onClick={onChangeOpponent}
          className="font-display font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg border border-arena-border text-arena-muted hover:text-white hover:border-arena-muted transition-colors"
        >
          CHANGE OPPONENT
        </button>
      </div>
    </section>
  );
}
