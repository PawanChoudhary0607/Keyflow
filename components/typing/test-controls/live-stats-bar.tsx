import { formatTime } from "@/lib/stats";
import { cn } from "@/lib/utils";
import type { TestConfig } from "@/types";

interface LiveStatsBarProps {
  config: TestConfig;
  elapsed: number;
  targetSeconds: number | null;
  wordsTyped: number;
  wpm: number;
  accuracy: number;
  className?: string;
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex items-baseline gap-1.5 px-3.5 py-2 first:pl-4 last:pr-4">
      <span className="font-display text-lg font-semibold tabular-nums text-foreground sm:text-xl">
        {value}
      </span>
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function LiveStatsBar({
  config,
  elapsed,
  targetSeconds,
  wordsTyped,
  wpm,
  accuracy,
  className,
}: LiveStatsBarProps) {
  const remaining = targetSeconds !== null ? Math.max(0, targetSeconds - elapsed) : null;

  return (
    <div
      className={cn(
        "glass flex items-stretch divide-x divide-border/60 rounded-full shadow-sm",
        className,
      )}
    >
      <Stat value={wpm} label="wpm" />
      <Stat value={`${accuracy}%`} label="acc" />
      {config.mode === "time" && remaining !== null ? (
        <Stat value={formatTime(remaining)} label="left" />
      ) : config.mode === "words" ? (
        <Stat value={`${wordsTyped}/${config.wordsOption}`} label="words" />
      ) : (
        <Stat value={formatTime(elapsed)} label="time" />
      )}
    </div>
  );
}
