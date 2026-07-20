"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TabOption<T extends string> {
  value: T;
  label: string;
}

interface TabsProps<T extends string> {
  value: T;
  options: TabOption<T>[];
  onChange: (value: T) => void;
  className?: string;
  layoutId?: string;
}

export function Tabs<T extends string>({
  value,
  options,
  onChange,
  className,
  layoutId,
}: TabsProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1 rounded-xl border border-border bg-muted/40 p-1",
        className,
      )}
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "focus-ring relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200",
              active
                ? "text-accent-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId ?? "tab-pill"}
                className="absolute inset-0 rounded-lg bg-accent shadow-sm"
                transition={{ type: "spring", stiffness: 500, damping: 34 }}
              />
            )}
            <span className="relative">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
