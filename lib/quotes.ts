import type { QuoteLength } from "@/types";

export interface Quote {
  id: string;
  text: string;
  source: string;
  length: QuoteLength;
}

/**
 * A small, original set of quotes for quote mode, grouped by length so
 * "Short / Medium / Long" in the UI maps to a real word-count bucket.
 * Add more by appending objects — length is assigned by word count.
 */
export const QUOTES: Quote[] = [
  {
    id: "q1",
    text: "Simplicity is the soul of efficiency.",
    source: "Unknown",
    length: "short",
  },
  {
    id: "q2",
    text: "Practice does not make perfect, it makes permanent.",
    source: "Unknown",
    length: "short",
  },
  {
    id: "q3",
    text: "Speed without accuracy is just noise.",
    source: "Unknown",
    length: "short",
  },
  {
    id: "q4",
    text: "Flow is friction that has become familiar.",
    source: "Unknown",
    length: "short",
  },
  {
    id: "q5",
    text: "The only way to do great work is to love what you do, and to keep doing it long after it stops feeling new.",
    source: "Unknown",
    length: "medium",
  },
  {
    id: "q6",
    text: "A journey of a thousand miles begins with a single step, and a fast typist begins with a single steady keystroke.",
    source: "Unknown",
    length: "medium",
  },
  {
    id: "q7",
    text: "Good code, like good writing, is rewritten far more often than it is written for the first time.",
    source: "Unknown",
    length: "medium",
  },
  {
    id: "q8",
    text: "Every expert was once a beginner who refused to give up, one line, one word, one letter at a time.",
    source: "Unknown",
    length: "medium",
  },
  {
    id: "q9",
    text: "Speed without accuracy is just noise; accuracy without speed is just patience. The craft lives somewhere in between, in the quiet hours of repetition, where the hands learn what the mind already knows.",
    source: "Unknown",
    length: "long",
  },
  {
    id: "q10",
    text: "The only way to do great work is to love what you do, and to keep doing it long after it stops feeling new, long after the applause fades, long after the reasons you started have quietly changed shape.",
    source: "Unknown",
    length: "long",
  },
  {
    id: "q11",
    text: "Every expert was once a beginner who refused to give up, one line, one word, one letter at a time, building a kind of patience that looks, from a distance, indistinguishable from talent.",
    source: "Unknown",
    length: "long",
  },
];

export function getRandomQuote(length: QuoteLength = "medium"): Quote {
  const pool = QUOTES.filter((q) => q.length === length);
  const source = pool.length > 0 ? pool : QUOTES;
  return source[Math.floor(Math.random() * source.length)] ?? QUOTES[0]!;
}
