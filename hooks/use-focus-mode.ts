"use client";

import { useEffect, useRef, useState } from "react";

const IDLE_TIMEOUT_MS = 5000;

/**
 * Drives KeyFlow's focus mode:
 *  - `blurred` turns true as soon as the test starts (dims chrome).
 *  - `idle` turns true after 5s with no mouse movement while a test is
 *    running, so the caller can hide everything but the typing text.
 * Moving the mouse always resets the idle timer.
 */
export function useFocusMode(isRunning: boolean) {
  const [idle, setIdle] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isRunning) {
      setIdle(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const resetTimer = () => {
      setIdle(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setIdle(true), IDLE_TIMEOUT_MS);
    };

    resetTimer();
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("mousedown", resetTimer);

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("mousedown", resetTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning]);

  return { blurred: isRunning, idle };
}
