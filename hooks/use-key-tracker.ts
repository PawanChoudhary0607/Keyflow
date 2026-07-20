"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks raw physical keyboard state for driving the virtual keyboard:
 * which key codes are currently held, whether Shift is active, and
 * whether Caps Lock is on. Also exposes a ref with the most recently
 * pressed code, so callers can correlate it with correctness feedback
 * that arrives asynchronously (e.g. from a controlled <input> onChange).
 */
export function useKeyTracker(enabled: boolean) {
  const [pressed, setPressed] = useState<Set<string>>(new Set());
  const [shiftActive, setShiftActive] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const lastCodeRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      lastCodeRef.current = e.code;
      setPressed((prev) => {
        if (prev.has(e.code)) return prev;
        const next = new Set(prev);
        next.add(e.code);
        return next;
      });
      setShiftActive(e.shiftKey);
      if (typeof e.getModifierState === "function") {
        setCapsLockOn(e.getModifierState("CapsLock"));
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      setPressed((prev) => {
        if (!prev.has(e.code)) return prev;
        const next = new Set(prev);
        next.delete(e.code);
        return next;
      });
      setShiftActive(e.shiftKey);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [enabled]);

  return { pressed, shiftActive, capsLockOn, lastCodeRef };
}
