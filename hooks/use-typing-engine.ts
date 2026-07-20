"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { generateWordBatch, generateWords } from "@/lib/word-list";
import { getRandomQuote } from "@/lib/quotes";
import {
  calculateAccuracy,
  calculateConsistency,
  calculateRawWpm,
  calculateWpm,
} from "@/lib/stats";
import type { TestConfig, TestResult, WpmSample } from "@/types";

export type EngineStatus = "idle" | "running" | "finished";

interface CompletedWord {
  target: string;
  typed: string;
}

export interface UseTypingEngineOptions {
  config: TestConfig;
  onComplete?: (result: TestResult) => void;
  onKeystroke?: (kind: "correct" | "incorrect" | "space" | "backspace") => void;
}

function buildInitialWords(config: TestConfig): string[] {
  const wordOptions = {
    punctuation: config.punctuation,
    numbers: config.numbers,
    capitalWords: config.capitalWords,
    difficulty: config.difficulty,
  };
  if (config.mode === "quote") return getRandomQuote(config.quoteLength).text.split(" ");
  if (config.mode === "words") return generateWords(config.wordsOption, wordOptions);
  // "time" and "zen" both use an endless, appendable word stream.
  return generateWordBatch(80, wordOptions);
}

/** Correct characters typed so far across completed words (+1 per trailing space). */
function countCorrectChars(list: CompletedWord[]): number {
  return list.reduce((sum, w) => {
    let c = 0;
    for (let i = 0; i < w.target.length; i++) {
      if (w.typed[i] === w.target[i]) c++;
    }
    return sum + c + 1;
  }, 0);
}

/** Total characters typed so far, including the trailing space per word. */
function countRawChars(list: CompletedWord[]): number {
  return list.reduce((sum, w) => sum + Math.max(w.target.length, w.typed.length) + 1, 0);
}

export function useTypingEngine({ config, onComplete, onKeystroke }: UseTypingEngineOptions) {
  const [words, setWords] = useState<string[]>(() => buildInitialWords(config));
  const [completedWords, setCompletedWords] = useState<CompletedWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [status, setStatus] = useState<EngineStatus>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [wpmHistory, setWpmHistory] = useState<WpmSample[]>([]);
  const [result, setResult] = useState<TestResult | null>(null);

  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finishedRef = useRef(false);
  const lastSampledSecondRef = useRef(0);

  // Refs mirror the latest state so the interval callback (created once
  // per "running" transition) always reads fresh values without needing
  // to be re-created every render.
  const completedWordsRef = useRef<CompletedWord[]>([]);
  const wpmHistoryRef = useRef<WpmSample[]>([]);
  const mistakesRef = useRef(0);

  useEffect(() => {
    completedWordsRef.current = completedWords;
  }, [completedWords]);
  useEffect(() => {
    wpmHistoryRef.current = wpmHistory;
  }, [wpmHistory]);
  useEffect(() => {
    mistakesRef.current = mistakes;
  }, [mistakes]);

  const targetSeconds = config.mode === "time" ? config.timeOption : null;

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    finishedRef.current = false;
    startTimeRef.current = null;
    lastSampledSecondRef.current = 0;
    setWords(buildInitialWords(config));
    setCompletedWords([]);
    setCurrentWordIndex(0);
    setCurrentInput("");
    setStatus("idle");
    setElapsed(0);
    setMistakes(0);
    setWpmHistory([]);
    setResult(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    config.mode,
    config.timeOption,
    config.wordsOption,
    config.quoteLength,
    config.punctuation,
    config.numbers,
    config.capitalWords,
    config.difficulty,
  ]);

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    config.mode,
    config.timeOption,
    config.wordsOption,
    config.quoteLength,
    config.punctuation,
    config.numbers,
    config.capitalWords,
    config.difficulty,
  ]);

  const finish = useCallback(
    (finalCompletedWords: CompletedWord[], elapsedSeconds: number, samples: WpmSample[]) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      if (intervalRef.current) clearInterval(intervalRef.current);

      let correctChars = 0;
      let incorrectChars = 0;
      let extraChars = 0;
      let missedChars = 0;
      let correctWords = 0;
      let incorrectWords = 0;

      for (const w of finalCompletedWords) {
        const wordCorrect = w.typed === w.target;
        if (wordCorrect) correctWords++;
        else incorrectWords++;

        const maxLen = Math.max(w.target.length, w.typed.length);
        for (let i = 0; i < maxLen; i++) {
          const t = w.target[i];
          const c = w.typed[i];
          if (t === undefined) extraChars++;
          else if (c === undefined) missedChars++;
          else if (c === t) correctChars++;
          else incorrectChars++;
        }
        // account for the space between words as a correctly typed character
        correctChars += 1;
      }

      const totalChars = correctChars + incorrectChars + extraChars + missedChars;
      const wpm = calculateWpm(correctChars, elapsedSeconds);
      const rawWpm = calculateRawWpm(totalChars, elapsedSeconds);
      const accuracy = calculateAccuracy(correctChars, correctChars + mistakesRef.current);
      const consistency = calculateConsistency(samples);

      const finalResult: TestResult = {
        id: crypto.randomUUID(),
        completedAt: new Date().toISOString(),
        mode: config.mode,
        target:
          config.mode === "time"
            ? config.timeOption
            : config.mode === "words"
              ? config.wordsOption
              : finalCompletedWords.length,
        wpm,
        rawWpm,
        accuracy,
        correctChars,
        incorrectChars,
        extraChars,
        missedChars,
        correctWords,
        incorrectWords,
        totalChars,
        durationSeconds: Math.round(elapsedSeconds),
        mistakes: mistakesRef.current,
        consistency,
        wpmHistory: samples,
      };

      setStatus("finished");
      setResult(finalResult);
      onComplete?.(finalResult);
    },
    [config.mode, config.timeOption, config.wordsOption, onComplete],
  );

  // Single timer loop: advances elapsed time, samples WPM once per
  // second, and ends the test once "time" mode hits its target.
  useEffect(() => {
    if (status !== "running") return;

    intervalRef.current = setInterval(() => {
      if (startTimeRef.current === null) return;
      const secs = (Date.now() - startTimeRef.current) / 1000;
      setElapsed(secs);

      const wholeSecond = Math.floor(secs);
      if (wholeSecond > lastSampledSecondRef.current) {
        lastSampledSecondRef.current = wholeSecond;
        const correct = countCorrectChars(completedWordsRef.current);
        const raw = countRawChars(completedWordsRef.current);
        const nextSample: WpmSample = {
          time: wholeSecond,
          wpm: calculateWpm(correct, secs),
          rawWpm: calculateRawWpm(raw, secs),
        };
        wpmHistoryRef.current = [...wpmHistoryRef.current, nextSample];
        setWpmHistory(wpmHistoryRef.current);
      }

      if (targetSeconds !== null && secs >= targetSeconds) {
        finish(completedWordsRef.current, targetSeconds, wpmHistoryRef.current);
      }
    }, 200);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status, targetSeconds, finish]);

  const liveStats = useMemo(() => {
    const correct = countCorrectChars(completedWords);
    const wpm = calculateWpm(correct, elapsed || 1);
    const accuracy = calculateAccuracy(correct, correct + mistakes);
    return { wpm: elapsed > 0.3 ? wpm : 0, accuracy };
  }, [completedWords, elapsed, mistakes]);

  const handleChange = useCallback(
    (rawValue: string) => {
      if (status === "finished") return;

      if (status === "idle") {
        startTimeRef.current = Date.now();
        setStatus("running");
      }

      const target = words[currentWordIndex] ?? "";

      if (rawValue.endsWith(" ")) {
        const typed = rawValue.trimEnd();
        if (typed.length === 0) return; // ignore leading space

        const isCorrect = typed === target;
        onKeystroke?.(isCorrect ? "space" : "incorrect");

        const nextCompleted = [...completedWords, { target, typed }];
        setCompletedWords(nextCompleted);
        completedWordsRef.current = nextCompleted;
        setCurrentInput("");

        const isLastWordInList = currentWordIndex === words.length - 1;

        if (config.mode === "words" && nextCompleted.length >= config.wordsOption) {
          finish(nextCompleted, elapsed, wpmHistory);
          return;
        }
        if (config.mode === "quote" && isLastWordInList) {
          finish(nextCompleted, elapsed, wpmHistory);
          return;
        }
        if (config.mode === "time" && isLastWordInList) {
          setWords((w) => [
            ...w,
            ...generateWordBatch(60, {
              punctuation: config.punctuation,
              numbers: config.numbers,
              capitalWords: config.capitalWords,
              difficulty: config.difficulty,
            }),
          ]);
        }
        if (config.mode === "zen" && isLastWordInList) {
          setWords((w) => [
            ...w,
            ...generateWordBatch(60, {
              punctuation: config.punctuation,
              numbers: config.numbers,
              capitalWords: config.capitalWords,
              difficulty: config.difficulty,
            }),
          ]);
        }
        setCurrentWordIndex((i) => i + 1);
        return;
      }

      // Track mistakes: a keystroke is a mistake if the newest character
      // typed doesn't match the target at that position.
      if (rawValue.length > currentInput.length) {
        const newIndex = rawValue.length - 1;
        const typedChar = rawValue[newIndex];
        const targetChar = target[newIndex];
        if (typedChar !== targetChar) {
          setMistakes((m) => m + 1);
          onKeystroke?.("incorrect");
        } else {
          onKeystroke?.("correct");
        }
      } else if (rawValue.length < currentInput.length) {
        onKeystroke?.("backspace");
      }

      // Cap extra characters so a runaway word can't grow forever.
      setCurrentInput(rawValue.slice(0, target.length + 15));
    },
    [
      status,
      words,
      currentWordIndex,
      completedWords,
      currentInput,
      config.mode,
      config.wordsOption,
      config.punctuation,
      config.numbers,
      config.capitalWords,
      config.difficulty,
      elapsed,
      wpmHistory,
      finish,
      onKeystroke,
    ],
  );

  return {
    words,
    completedWords,
    currentWordIndex,
    currentInput,
    status,
    elapsed,
    mistakes,
    liveStats,
    result,
    handleChange,
    reset,
    targetSeconds,
  };
}
