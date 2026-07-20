"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTypingEngine } from "@/hooks/use-typing-engine";
import { useKeyboardSound } from "@/hooks/use-keyboard-sound";
import { useFocusMode } from "@/hooks/use-focus-mode";
import { useKeyTracker } from "@/hooks/use-key-tracker";
import { useSettings } from "@/components/providers/settings-provider";
import { Word } from "@/components/typing/word";
import { VirtualKeyboard } from "@/components/typing/virtual-keyboard";
import { TestControls } from "@/components/typing/test-controls/test-controls";
import { LiveStatsBar } from "@/components/typing/test-controls/live-stats-bar";
import { TopBar } from "@/components/layout/top-bar";
import { fontFamilyFor } from "@/lib/fonts";
import { loadLastConfig, saveLastConfig, saveLatestResult } from "@/lib/storage";
import { cn } from "@/lib/utils";
import type { TestConfig } from "@/types";

const DEFAULT_CONFIG: TestConfig = {
  mode: "time",
  timeOption: 30,
  wordsOption: 25,
  quoteLength: "medium",
  punctuation: false,
  numbers: false,
  capitalWords: false,
  difficulty: "normal",
};

export function TypingTest({
  initialConfig,
  useLastConfig,
}: {
  initialConfig?: Partial<TestConfig>;
  useLastConfig?: boolean;
}) {
  const router = useRouter();
  const { settings } = useSettings();
  const [config, setConfig] = useState<TestConfig>(() => {
    if (useLastConfig) {
      const last = loadLastConfig();
      if (last) return last;
    }
    return { ...DEFAULT_CONFIG, ...initialConfig };
  });
  const [focused, setFocused] = useState(false);
  const [wrongCode, setWrongCode] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const wrongTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabPressedRef = useRef(false);
  const tabTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { play } = useKeyboardSound(
    settings.soundPack,
    settings.soundEnabled,
    settings.soundVolume,
  );
  const { pressed, shiftActive, capsLockOn, lastCodeRef } = useKeyTracker(
    settings.showKeyboard,
  );

  const engine = useTypingEngine({
    config,
    onComplete: (result) => {
      saveLatestResult(result);
      saveLastConfig(config);
      setTimeout(() => router.push("/results"), 350);
    },
    onKeystroke: (kind) => {
      if (kind === "incorrect") {
        if (settings.errorSoundEnabled) play("error");
        const code = lastCodeRef.current;
        if (code) {
          setWrongCode(code);
          if (wrongTimeoutRef.current) clearTimeout(wrongTimeoutRef.current);
          wrongTimeoutRef.current = setTimeout(() => setWrongCode(null), 220);
        }
      } else if (kind === "space" || kind === "correct" || kind === "backspace") {
        const code = lastCodeRef.current ?? (kind === "space" ? "Space" : "KeyA");
        play(code);
      }
    },
  });

  // `blurred` = typing has started (soft-blur the surrounding chrome).
  // `idle`    = 5s with no mouse movement (fully hide it). The typing
  // card and live stats are deliberately kept outside both states so
  // they always stay sharp and visible — only the nav + mode controls
  // blur/hide.
  const { blurred, idle } = useFocusMode(engine.status === "running");
  const hidden = blurred && idle;

  const focusInput = useCallback(() => inputRef.current?.focus(), []);

  useEffect(() => {
    focusInput();
  }, [focusInput, config]);

  // Keep the active word roughly centered by scrolling the words container.
  useEffect(() => {
    const container = wordsContainerRef.current;
    if (!container) return;
    const activeWord = container.querySelector<HTMLElement>('[data-current="true"]');
    if (activeWord) {
      const offset = activeWord.offsetTop - container.clientHeight / 2;
      container.scrollTo({ top: Math.max(0, offset), behavior: "smooth" });
    }
  }, [engine.currentWordIndex]);

  const handleRestart = useCallback(() => {
    engine.reset();
    focusInput();
  }, [engine, focusInput]);

  // Tab + Enter → restart, scoped to when the typing input is focused so
  // it doesn't hijack normal Tab navigation elsewhere on the page.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement !== inputRef.current) return;
      if (e.key === "Tab") {
        e.preventDefault();
        tabPressedRef.current = true;
        if (tabTimeoutRef.current) clearTimeout(tabTimeoutRef.current);
        tabTimeoutRef.current = setTimeout(() => {
          tabPressedRef.current = false;
        }, 1500);
      } else if (e.key === "Enter" && tabPressedRef.current) {
        e.preventDefault();
        tabPressedRef.current = false;
        play("Enter");
        handleRestart();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleRestart, play]);

  const handleConfigChange = (next: TestConfig) => setConfig(next);

  const typingFontFamily = fontFamilyFor(settings.font);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-flow-gradient">
      <TopBar blurred={blurred && !hidden} hidden={hidden} />

      <main className="flex flex-1 flex-col items-center justify-center gap-7 overflow-hidden px-4 pb-6 sm:px-6">
        <div
          className={cn(
            "transition-all duration-300 ease-out",
            blurred && !hidden && "pointer-events-none opacity-50 blur-[3px]",
            hidden && "pointer-events-none opacity-0",
          )}
        >
          <TestControls
            config={config}
            onChange={handleConfigChange}
            disabled={engine.status === "running"}
          />
        </div>

        {settings.liveStats && (
          <LiveStatsBar
            config={config}
            elapsed={engine.elapsed}
            targetSeconds={engine.targetSeconds}
            wordsTyped={engine.completedWords.length}
            wpm={engine.liveStats.wpm}
            accuracy={engine.liveStats.accuracy}
            className={cn(
              "transition-opacity duration-300",
              hidden && "pointer-events-none opacity-0",
            )}
          />
        )}

        <div className="relative w-full max-w-4xl">
          <input
            ref={inputRef}
            value={engine.currentInput}
            onChange={(e) => engine.handleChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="sr-only"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Typing input"
          />

          <div
            onClick={focusInput}
            style={{ fontFamily: typingFontFamily }}
            className={cn(
              "glass relative w-full cursor-text overflow-hidden rounded-[1.75rem] px-7 py-7 transition-shadow duration-300 sm:px-9 sm:py-8",
              focused
                ? "shadow-[0_0_0_1px_hsl(var(--ring)/0.6),0_0_70px_-20px_hsl(var(--accent)/0.45)]"
                : "shadow-[0_0_0_1px_hsl(var(--border)),0_0_50px_-24px_hsl(var(--accent)/0.25)]",
            )}
          >
            {!focused && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/70 text-sm text-muted-foreground backdrop-blur-sm">
                Click here or press any key to focus
              </div>
            )}

            <div
              ref={wordsContainerRef}
              className="flex flex-wrap content-start gap-y-2 overflow-hidden pb-[0.4em] leading-[1.8] tracking-wide"
              style={{ maxHeight: "calc(1.8em * 3)" }}
            >
              {engine.words.map((word, i) => {
                const isDone = i < engine.currentWordIndex;
                const isCurrent = i === engine.currentWordIndex;
                const isFuture = i > engine.currentWordIndex;
                const typed = isDone
                  ? (engine.completedWords[i]?.typed ?? "")
                  : isCurrent
                    ? engine.currentInput
                    : "";
                return (
                  <span
                    key={i}
                    data-current={isCurrent || undefined}
                    className={cn(
                      "transition-opacity duration-300",
                      settings.ghostMode && isFuture && "opacity-30",
                    )}
                  >
                    <Word
                      target={word}
                      typed={typed}
                      isCurrent={isCurrent}
                      isDone={isDone}
                      smoothCaret={settings.smoothCaret}
                    />
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {settings.showKeyboard && (
          <VirtualKeyboard
            pressed={pressed}
            wrongCode={wrongCode}
            shiftActive={shiftActive}
            capsLockOn={capsLockOn}
            className={cn(
              "transition-all duration-300 ease-out",
              blurred && !hidden && "opacity-80",
              hidden && "pointer-events-none opacity-0",
            )}
          />
        )}

        {hidden && (
          <p className="pointer-events-none fixed bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/70">
            Tab + Enter to restart
          </p>
        )}
      </main>
    </div>
  );
}
