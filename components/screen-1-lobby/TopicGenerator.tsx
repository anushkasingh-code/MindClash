"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export interface TopicGeneratorProps {
  onTopicSelect: (topic: string) => void;
}

const PRESET_TOPICS = [
  {
    tag: "Ethics",
    topic: "AI will produce more net good than net harm by 2040",
  },
  {
    tag: "Science",
    topic: "Consciousness cannot be replicated in silicon",
  },
  {
    tag: "Society",
    topic: "Democracy is failing by its own design",
  },
] as const;

export default function TopicGenerator({ onTopicSelect }: TopicGeneratorProps) {
  const [customTopic, setCustomTopic] = useState("");

  const handleEnter = () => {
    const topic = customTopic.trim();
    if (topic) onTopicSelect(topic);
  };

  return (
    <section className="w-full bg-arena-bg px-6 py-10">
      <header className="mb-8">
        <h2 className="font-display font-extrabold text-white uppercase text-[28px] tracking-tight">
          CHOOSE YOUR BATTLEGROUND
        </h2>
        <p className="font-body text-arena-muted mt-2 text-[15px]">
          Pick a contested topic or write your own
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {PRESET_TOPICS.map((item) => (
          <motion.button
            key={item.topic}
            type="button"
            onClick={() => onTopicSelect(item.topic)}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            className="text-left bg-arena-surface border border-arena-border p-5 rounded-lg hover:border-neutral-glow transition-colors cursor-pointer"
          >
            <span className="inline-block font-body text-[11px] uppercase tracking-wider text-arena-muted border border-arena-border px-2 py-0.5 rounded-full mb-3">
              {item.tag}
            </span>
            <p className="font-display font-bold text-white text-lg leading-snug">
              {item.topic}
            </p>
          </motion.button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end gap-6 max-w-3xl">
        <div className="flex-1">
          <input
            type="text"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEnter()}
            placeholder="Or write your own stance..."
            className="w-full bg-transparent border-0 border-b border-arena-border pb-2 font-display italic text-white placeholder:text-arena-muted focus:outline-none focus:border-player-accent transition-colors text-[16px]"
          />
        </div>
        <motion.button
          type="button"
          onClick={handleEnter}
          disabled={!customTopic.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="shrink-0 font-display font-bold uppercase text-sm tracking-wider bg-player-accent text-arena-bg px-6 py-3 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all"
        >
          ENTER THE ARENA →
        </motion.button>
      </div>
    </section>
  );
}
