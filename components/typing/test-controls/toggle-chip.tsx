"use client";

import { cn } from "@/lib/utils";

interface ToggleChipProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function ToggleChip({ active, onClick, children }: ToggleChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "focus-ring rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150 active:scale-95",
        active
          ? "bg-accent text-accent-foreground shadow-sm"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
