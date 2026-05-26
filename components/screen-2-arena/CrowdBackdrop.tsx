"use client";

const FIGURE_COUNT = 24;
const HEIGHTS = [
  52, 58, 45, 62, 48, 55, 50, 68, 42, 60, 47, 54, 58, 44, 66, 49, 57, 43,
  61, 46, 53, 59, 41, 56,
];

function Silhouette({ height, delay }: { height: number; delay: number }) {
  const headR = height * 0.18;
  const bodyW = height * 0.35;
  const bodyH = height * 0.55;
  const cx = bodyW / 2 + 4;

  return (
    <g
      className="animate-crowd-sway"
      style={{ animationDelay: `${delay}s` }}
    >
      <ellipse
        cx={cx}
        cy={headR + 2}
        rx={headR}
        ry={headR * 1.1}
        fill="#1a1a2e"
      />
      <rect
        x={cx - bodyW / 2}
        y={headR * 2 + 4}
        width={bodyW}
        height={bodyH}
        rx={2}
        fill="#1a1a2e"
      />
    </g>
  );
}

export default function CrowdBackdrop() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden
    >
      <svg
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        className="w-full h-[80px] opacity-90"
      >
        {Array.from({ length: FIGURE_COUNT }).map((_, i) => (
          <g
            key={i}
            transform={`translate(${(1200 / FIGURE_COUNT) * i + 8}, ${80 - HEIGHTS[i]})`}
          >
            <Silhouette
              height={HEIGHTS[i]}
              delay={i * 0.15}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
