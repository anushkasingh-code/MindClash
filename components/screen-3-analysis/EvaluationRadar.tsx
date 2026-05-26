"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

export interface RoundMetric {
  logicScore: number;
  evidenceScore: number;
  clarityScore: number;
}

export interface EvaluationRadarProps {
  roundMetrics: RoundMetric[];
}

function average(scores: number[]) {
  if (scores.length === 0) return 0;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

export default function EvaluationRadar({
  roundMetrics,
}: EvaluationRadarProps) {
  const data = [
    {
      axis: "Persuasion",
      score: average(roundMetrics.map((m) => m.clarityScore)),
      fullMark: 10,
    },
    {
      axis: "Logic",
      score: average(roundMetrics.map((m) => m.logicScore)),
      fullMark: 10,
    },
    {
      axis: "Evidence",
      score: average(roundMetrics.map((m) => m.evidenceScore)),
      fullMark: 10,
    },
  ];

  return (
    <section className="w-full">
      <h3 className="font-display font-bold text-arena-muted uppercase tracking-widest text-sm mb-4 text-center">
        COGNITIVE PERFORMANCE
      </h3>
      <div className="w-full h-[280px] bg-arena-bg rounded-xl border border-arena-border p-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#1e1e35" />
            <PolarAngleAxis
              dataKey="axis"
              tick={{ fill: "#555570", fontSize: 11, fontFamily: "var(--font-body)" }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 10]}
              tick={{ fill: "#555570", fontSize: 10 }}
              axisLine={false}
            />
            <Radar
              name="Performance"
              dataKey="score"
              stroke="#a78bfa"
              fill="#a78bfa"
              fillOpacity={0.35}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
