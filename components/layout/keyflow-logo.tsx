import { cn } from "@/lib/utils";

export function KeyFlowLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
        <rect x="1" y="6" width="24" height="14" rx="4" className="fill-accent" />
        <rect x="5" y="10" width="3" height="3" rx="0.8" className="fill-accent-foreground" />
        <rect x="10" y="10" width="3" height="3" rx="0.8" className="fill-accent-foreground" />
        <rect x="15" y="10" width="3" height="3" rx="0.8" className="fill-accent-foreground" />
        <rect
          x="7"
          y="15"
          width="12"
          height="2.4"
          rx="1.2"
          className="fill-accent-foreground/80"
        />
      </svg>
      <span className="font-display text-lg font-semibold tracking-tight">
        Key<span className="text-accent">Flow</span>
      </span>
    </span>
  );
}
