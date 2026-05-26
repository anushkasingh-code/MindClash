"use client";

import { useCallback, useRef, useState } from "react";

export interface ControlPanelProps {
  onSubmit: (argument: string) => void;
  isLoading: boolean;
  refereeSummaryLine?: string;
  round: number;
  maxRounds: number;
  topic: string;
  onWithdraw: () => void;
}

function truncateTopic(topic: string, max = 40) {
  if (topic.length <= max) return topic;
  return `${topic.slice(0, max)}...`;
}

function showWithdrawButton(round: number, maxRounds: number): boolean {
  if (maxRounds <= 3) return round > 2;
  return round > 3;
}

export default function ControlPanel({
  onSubmit,
  isLoading,
  refereeSummaryLine,
  round,
  maxRounds,
  topic,
  onWithdraw,
}: ControlPanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);
  const [confirmingWithdraw, setConfirmingWithdraw] = useState(false);

  const canWithdraw = showWithdrawButton(round, maxRounds);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(160, Math.max(48, el.scrollHeight))}px`;
  }, []);

  const handleSubmit = () => {
    const text = textareaRef.current?.value.trim() ?? "";
    if (!text || isLoading) return;
    onSubmit(text);
    if (textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.style.height = "48px";
    }
  };

  const handleWithdrawClick = () => {
    setConfirmingWithdraw(true);
    setTimeout(() => setConfirmingWithdraw(false), 3000);
  };

  return (
    <footer className="relative w-full bg-arena-bg border-t border-arena-border px-6 py-5 z-10">
      {canWithdraw && (
        <div className="absolute top-4 right-6 z-20">
          {!confirmingWithdraw ? (
            <button
              type="button"
              onClick={handleWithdrawClick}
              className="font-display font-bold text-[11px] uppercase tracking-wider text-arena-muted border border-arena-muted px-3 py-1.5 rounded transition-colors duration-200 hover:border-ai-accent hover:text-ai-accent"
            >
              WITHDRAW FROM COMBAT
            </button>
          ) : (
            <div className="flex items-center gap-3 font-display font-bold text-[11px] uppercase tracking-wider">
              <button
                type="button"
                onClick={() => {
                  setConfirmingWithdraw(false);
                  onWithdraw();
                }}
                className="text-ai-accent hover:underline"
              >
                CONFIRM WITHDRAWAL
              </button>
              <span className="text-arena-muted">|</span>
              <button
                type="button"
                onClick={() => setConfirmingWithdraw(false)}
                className="text-player-accent hover:underline"
              >
                STAY AND FIGHT
              </button>
            </div>
          )}
        </div>
      )}

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-end gap-5">
        <div className="flex-1 min-w-0 max-w-md shrink-0 lg:max-w-sm">
          {refereeSummaryLine ? (
            <div className="border border-arena-border rounded-lg py-3 px-4 bg-arena-surface/50">
              <span className="font-display font-bold text-[10px] uppercase tracking-widest text-neutral-glow block mb-1">
                REFEREE:
              </span>
              <p className="font-body text-xs text-arena-muted italic leading-relaxed text-left">
                {refereeSummaryLine}
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex-1 flex flex-col sm:flex-row gap-3 items-end min-w-0">
          <textarea
            ref={textareaRef}
            rows={1}
            disabled={isLoading}
            onInput={adjustHeight}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="State your position. Defend it. Don't fold."
            className="flex-1 w-full min-h-[48px] max-h-[160px] resize-none bg-arena-surface/80 border-0 border-b border-arena-border px-0 py-3 font-body text-[15px] text-white placeholder:text-arena-muted placeholder:font-display placeholder:italic focus:outline-none focus:border-player-accent transition-all duration-200"
            style={
              focused
                ? { boxShadow: "0 0 0 1px #a78bfa40" }
                : undefined
            }
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="shrink-0 font-display font-extrabold text-[13px] uppercase tracking-wider bg-player-accent text-arena-bg px-5 py-3 rounded-lg disabled:opacity-40 hover:brightness-110 hover:scale-[1.02] transition-all"
          >
            DEPLOY ARGUMENT
          </button>
        </div>
      </div>

      <p className="font-body text-[11px] text-arena-muted mt-3 max-w-6xl mx-auto">
        Round {round} of {maxRounds} · {truncateTopic(topic)}
      </p>
    </footer>
  );
}
