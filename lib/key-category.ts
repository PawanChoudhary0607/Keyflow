export type KeySoundCategory =
  "letters" | "numbers" | "modifier" | "backspace" | "enter" | "space";

const MODIFIER_CODES = new Set([
  "ShiftLeft",
  "ShiftRight",
  "ControlLeft",
  "ControlRight",
  "AltLeft",
  "AltRight",
  "MetaLeft",
  "MetaRight",
  "CapsLock",
  "Tab",
]);

/** Classifies a physical key code into a broad sound category. */
export function classifyKeyCode(code: string | null): KeySoundCategory {
  if (!code) return "letters";
  if (code === "Space") return "space";
  if (code === "Backspace") return "backspace";
  if (code === "Enter") return "enter";
  if (code.startsWith("Digit")) return "numbers";
  if (MODIFIER_CODES.has(code)) return "modifier";
  return "letters";
}
