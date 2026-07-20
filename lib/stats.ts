import type { WpmSample } from "@/types";

/**
 * Standard typing-test WPM formula: (all typed characters / 5) / minutes.
 * Using "characters / 5" as the definition of a word is the industry
 * convention (matches MonkeyType, TypeRacer, etc.) and normalizes for
 * word length.
 */
export function calculateWpm(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  return Math.round(correctChars / 5 / minutes);
}

export function calculateRawWpm(totalChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  return Math.round(totalChars / 5 / minutes);
}

export function calculateAccuracy(correctChars: number, totalKeystrokes: number): number {
  if (totalKeystrokes <= 0) return 100;
  return Math.max(0, Math.min(100, Math.round((correctChars / totalKeystrokes) * 100)));
}

/**
 * Consistency is derived from the coefficient of variation of the WPM
 * samples collected during the test — lower variance relative to the
 * mean means steadier, more consistent typing.
 */
export function calculateConsistency(samples: WpmSample[]): number {
  if (samples.length < 2) return 100;
  const values = samples.map((s) => s.wpm);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  if (mean === 0) return 100;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = stdDev / mean;
  const consistency = Math.max(0, Math.min(100, 100 - coefficientOfVariation * 100));
  return Math.round(consistency);
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
