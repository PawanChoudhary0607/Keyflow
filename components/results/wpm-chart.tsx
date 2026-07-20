"use client";

import type { WpmSample } from "@/types";

interface WpmChartProps {
  samples: WpmSample[];
}

/**
 * A dependency-free SVG line chart. Deliberately hand-rolled instead of
 * pulling in a charting library — the data is tiny (one point per
 * second) and a single <polyline> renders it perfectly.
 */
export function WpmChart({ samples }: WpmChartProps) {
  if (samples.length < 2) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        Not enough data to chart yet.
      </div>
    );
  }

  const width = 600;
  const height = 160;
  const padding = 8;
  const maxWpm = Math.max(...samples.map((s) => s.wpm), 10);

  const points = samples.map((s, i) => {
    const x = padding + (i / (samples.length - 1)) * (width - padding * 2);
    const y = height - padding - (s.wpm / maxWpm) * (height - padding * 2);
    return `${x},${y}`;
  });

  const areaPoints = `${padding},${height - padding} ${points.join(" ")} ${width - padding},${height - padding}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-40 w-full"
      preserveAspectRatio="none"
      role="img"
      aria-label="Words per minute over time"
    >
      <polygon points={areaPoints} className="fill-accent/10" />
      <polyline
        points={points.join(" ")}
        fill="none"
        className="stroke-accent"
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
