"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface KeyDef {
  code: string;
  label: string;
  /** Width in keyboard units (1u = a standard letter key). */
  width?: number;
}

const ROWS: KeyDef[][] = [
  [
    { code: "Backquote", label: "`" },
    { code: "Digit1", label: "1" },
    { code: "Digit2", label: "2" },
    { code: "Digit3", label: "3" },
    { code: "Digit4", label: "4" },
    { code: "Digit5", label: "5" },
    { code: "Digit6", label: "6" },
    { code: "Digit7", label: "7" },
    { code: "Digit8", label: "8" },
    { code: "Digit9", label: "9" },
    { code: "Digit0", label: "0" },
    { code: "Minus", label: "-" },
    { code: "Equal", label: "=" },
    { code: "Backspace", label: "⌫", width: 2 },
  ],
  [
    { code: "Tab", label: "Tab", width: 1.5 },
    { code: "KeyQ", label: "Q" },
    { code: "KeyW", label: "W" },
    { code: "KeyE", label: "E" },
    { code: "KeyR", label: "R" },
    { code: "KeyT", label: "T" },
    { code: "KeyY", label: "Y" },
    { code: "KeyU", label: "U" },
    { code: "KeyI", label: "I" },
    { code: "KeyO", label: "O" },
    { code: "KeyP", label: "P" },
    { code: "BracketLeft", label: "[" },
    { code: "BracketRight", label: "]" },
    { code: "Backslash", label: "\\", width: 1.5 },
  ],
  [
    { code: "CapsLock", label: "Caps", width: 1.75 },
    { code: "KeyA", label: "A" },
    { code: "KeyS", label: "S" },
    { code: "KeyD", label: "D" },
    { code: "KeyF", label: "F" },
    { code: "KeyG", label: "G" },
    { code: "KeyH", label: "H" },
    { code: "KeyJ", label: "J" },
    { code: "KeyK", label: "K" },
    { code: "KeyL", label: "L" },
    { code: "Semicolon", label: ";" },
    { code: "Quote", label: "'" },
    { code: "Enter", label: "Enter", width: 2.25 },
  ],
  [
    { code: "ShiftLeft", label: "Shift", width: 2.25 },
    { code: "KeyZ", label: "Z" },
    { code: "KeyX", label: "X" },
    { code: "KeyC", label: "C" },
    { code: "KeyV", label: "V" },
    { code: "KeyB", label: "B" },
    { code: "KeyN", label: "N" },
    { code: "KeyM", label: "M" },
    { code: "Comma", label: "," },
    { code: "Period", label: "." },
    { code: "Slash", label: "/" },
    { code: "ShiftRight", label: "Shift", width: 2.75 },
  ],
  [
    { code: "ControlLeft", label: "Ctrl", width: 1.25 },
    { code: "MetaLeft", label: "⌘", width: 1.25 },
    { code: "AltLeft", label: "Alt", width: 1.25 },
    { code: "Space", label: "", width: 6.25 },
    { code: "AltRight", label: "Alt", width: 1.25 },
    { code: "MetaRight", label: "⌘", width: 1.25 },
    { code: "ControlRight", label: "Ctrl", width: 1.25 },
  ],
];

interface VirtualKeyboardProps {
  pressed: Set<string>;
  wrongCode: string | null;
  shiftActive: boolean;
  capsLockOn: boolean;
  className?: string;
}

function isShiftKey(code: string) {
  return code === "ShiftLeft" || code === "ShiftRight";
}

function Keycap({
  keyDef,
  active,
  wrong,
}: {
  keyDef: KeyDef;
  active: boolean;
  wrong: boolean;
}) {
  const restShadow =
    "inset 0 1.5px 0 rgba(255,255,255,0.16), inset 0 -2px 0 rgba(0,0,0,0.3), 0 3.5px 0 rgba(0,0,0,0.45), 0 7px 9px -1px rgba(0,0,0,0.35)";
  const pressedShadow =
    "inset 0 1px 0 rgba(255,255,255,0.09), inset 0 -1px 0 rgba(0,0,0,0.22), 0 0.5px 0 rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.22)";
  const wrongShadow =
    "inset 0 1.5px 0 rgba(255,255,255,0.12), inset 0 -1.5px 0 rgba(0,0,0,0.28), 0 1.5px 0 rgba(0,0,0,0.4), 0 3px 5px -1px rgba(0,0,0,0.3)";

  return (
    <motion.div
      style={{ flexGrow: keyDef.width ?? 1, flexBasis: 0, transformPerspective: 300 }}
      animate={{
        y: active ? 2.5 : 0,
        scaleY: active ? 0.92 : 1,
        scaleX: active ? 0.985 : 1,
        rotateX: active ? 3 : 0,
        boxShadow: wrong ? wrongShadow : active ? pressedShadow : restShadow,
      }}
      transition={{ type: "spring", stiffness: 560, damping: 30, mass: 0.55 }}
      className={cn(
        "relative flex h-10 select-none items-center justify-center overflow-hidden rounded-[8px] border text-[11px] font-medium tracking-wide",
        wrong
          ? "border-incorrect/40 bg-gradient-to-b from-incorrect/40 to-incorrect/20 text-incorrect"
          : active
            ? "border-accent/50 bg-gradient-to-b from-accent to-accent/90 text-accent-foreground"
            : "border-white/[0.08] bg-gradient-to-b from-muted/85 via-muted/55 to-muted/45 text-muted-foreground",
      )}
    >
      {/* Subtle top-surface light catch */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[8px] bg-gradient-to-b to-transparent transition-opacity duration-150",
          active ? "from-white/[0.06] opacity-60" : "from-white/[0.1] opacity-100",
        )}
      />
      <span className="relative">{keyDef.label}</span>
    </motion.div>
  );
}

export function VirtualKeyboard({
  pressed,
  wrongCode,
  shiftActive,
  capsLockOn,
  className,
}: VirtualKeyboardProps) {
  return (
    <div
      className={cn(
        "hidden w-full max-w-3xl select-none rounded-[1.5rem] border border-black/50 bg-gradient-to-b from-card/75 to-card/40 p-3.5 shadow-[0_22px_45px_-18px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)] sm:block",
        className,
      )}
      aria-hidden="true"
    >
      <div className="flex flex-col gap-[7px] rounded-xl border border-white/[0.07] bg-background/30 p-3 shadow-[inset_0_2px_6px_rgba(0,0,0,0.35)]">
        {ROWS.map((row, i) => (
          <div key={i} className="flex gap-[7px]">
            {row.map((key) => {
              const active =
                pressed.has(key.code) ||
                (isShiftKey(key.code) && shiftActive) ||
                (key.code === "CapsLock" && capsLockOn);
              return (
                <Keycap
                  key={key.code}
                  keyDef={key}
                  active={active}
                  wrong={wrongCode === key.code}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
