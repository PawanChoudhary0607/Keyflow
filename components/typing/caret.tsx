"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Caret({ smooth }: { smooth: boolean }) {
  return (
    <motion.span
      layout={smooth}
      layoutId={smooth ? "typing-caret" : undefined}
      transition={{ type: "spring", stiffness: 700, damping: 40 }}
      className={cn(
        "inline-block h-[1.15em] w-[2.5px] translate-y-[0.1em] rounded-full bg-caret shadow-[0_0_8px_hsl(var(--caret)/0.7)]",
        !smooth && "animate-caret-blink",
      )}
      aria-hidden="true"
    />
  );
}
