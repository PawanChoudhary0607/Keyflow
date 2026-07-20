"use client";

import { Tabs } from "@/components/ui/tabs";
import { ToggleChip } from "@/components/typing/test-controls/toggle-chip";
import type {
  TestConfig,
  TestMode,
  TimeOption,
  WordsOption,
  QuoteLength,
  Difficulty,
} from "@/types";

const TIME_OPTIONS: TimeOption[] = [15, 30, 60, 120];
const WORDS_OPTIONS: WordsOption[] = [10, 25, 50, 100];
const QUOTE_LENGTHS: QuoteLength[] = ["short", "medium", "long"];

interface TestControlsProps {
  config: TestConfig;
  onChange: (config: TestConfig) => void;
  disabled?: boolean;
}

/**
 * The three control rows above the typing area:
 *  1. Modifiers — Punctuation, Numbers, Capital Words, Easy, Hard
 *  2. Mode — Time / Words / Quote / Zen
 *  3. Length — dynamic based on the selected mode
 */
export function TestControls({ config, onChange, disabled }: TestControlsProps) {
  const setDifficulty = (next: Difficulty) => {
    onChange({ ...config, difficulty: config.difficulty === next ? "normal" : next });
  };

  return (
    <div
      className={
        "flex flex-col items-center gap-3.5 transition-opacity duration-200" +
        (disabled ? " pointer-events-none opacity-40" : "")
      }
    >
      <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-xl border border-border bg-muted/40 p-1.5">
        <ToggleChip
          active={config.punctuation}
          onClick={() => onChange({ ...config, punctuation: !config.punctuation })}
        >
          Punctuation
        </ToggleChip>
        <ToggleChip
          active={config.numbers}
          onClick={() => onChange({ ...config, numbers: !config.numbers })}
        >
          Numbers
        </ToggleChip>
        <ToggleChip
          active={config.capitalWords}
          onClick={() => onChange({ ...config, capitalWords: !config.capitalWords })}
        >
          Capital Words
        </ToggleChip>
        <span className="mx-1.5 h-5 w-px bg-border" aria-hidden="true" />
        <ToggleChip
          active={config.difficulty === "easy"}
          onClick={() => setDifficulty("easy")}
        >
          Easy
        </ToggleChip>
        <ToggleChip
          active={config.difficulty === "hard"}
          onClick={() => setDifficulty("hard")}
        >
          Hard
        </ToggleChip>
      </div>

      <Tabs<TestMode>
        layoutId="mode-tabs"
        value={config.mode}
        onChange={(mode) => onChange({ ...config, mode })}
        options={[
          { value: "time", label: "Time" },
          { value: "words", label: "Words" },
          { value: "quote", label: "Quote" },
          { value: "zen", label: "Zen" },
        ]}
      />

      {config.mode === "time" && (
        <Tabs<string>
          layoutId="time-tabs"
          value={String(config.timeOption)}
          onChange={(v) => onChange({ ...config, timeOption: Number(v) as TimeOption })}
          options={TIME_OPTIONS.map((t) => ({ value: String(t), label: String(t) }))}
        />
      )}

      {config.mode === "words" && (
        <Tabs<string>
          layoutId="words-tabs"
          value={String(config.wordsOption)}
          onChange={(v) => onChange({ ...config, wordsOption: Number(v) as WordsOption })}
          options={WORDS_OPTIONS.map((w) => ({ value: String(w), label: String(w) }))}
        />
      )}

      {config.mode === "quote" && (
        <Tabs<QuoteLength>
          layoutId="quote-length-tabs"
          value={config.quoteLength}
          onChange={(quoteLength) => onChange({ ...config, quoteLength })}
          options={QUOTE_LENGTHS.map((l) => ({
            value: l,
            label: l[0]!.toUpperCase() + l.slice(1),
          }))}
        />
      )}
    </div>
  );
}
