/**
 * A compact list of common English words used to generate practice
 * passages for "time", "words", and "zen" modes. Kept intentionally
 * small — words are shuffled and repeated, which is how most typing
 * tests work.
 */
export const COMMON_WORDS = [
  "the",
  "of",
  "and",
  "to",
  "in",
  "is",
  "you",
  "that",
  "it",
  "he",
  "was",
  "for",
  "on",
  "are",
  "as",
  "with",
  "his",
  "they",
  "at",
  "be",
  "this",
  "have",
  "from",
  "or",
  "one",
  "had",
  "by",
  "word",
  "but",
  "not",
  "what",
  "all",
  "were",
  "we",
  "when",
  "your",
  "can",
  "said",
  "there",
  "use",
  "each",
  "which",
  "she",
  "how",
  "their",
  "if",
  "will",
  "up",
  "other",
  "about",
  "out",
  "many",
  "then",
  "them",
  "these",
  "so",
  "some",
  "her",
  "would",
  "make",
  "like",
  "him",
  "into",
  "time",
  "has",
  "look",
  "two",
  "more",
  "write",
  "go",
  "see",
  "number",
  "no",
  "way",
  "could",
  "people",
  "than",
  "first",
  "water",
  "been",
  "call",
  "who",
  "its",
  "now",
  "find",
  "long",
  "down",
  "day",
  "did",
  "get",
  "come",
  "made",
  "may",
  "part",
  "over",
  "new",
  "sound",
  "take",
  "only",
  "little",
  "work",
  "know",
  "place",
  "year",
  "live",
  "back",
  "give",
  "most",
  "very",
  "after",
  "thing",
  "our",
  "just",
  "name",
  "good",
  "sentence",
  "man",
  "think",
  "say",
  "great",
  "where",
  "help",
  "through",
  "much",
  "before",
  "line",
  "right",
  "too",
  "mean",
  "old",
  "any",
  "same",
  "tell",
  "boy",
  "follow",
  "came",
  "want",
  "show",
  "also",
  "around",
  "form",
  "three",
  "small",
  "set",
  "put",
  "end",
  "does",
  "another",
  "well",
  "large",
  "must",
  "big",
  "even",
  "such",
  "because",
  "turn",
  "here",
  "why",
  "ask",
  "went",
  "men",
  "read",
  "need",
  "land",
  "different",
  "home",
  "us",
  "move",
  "try",
  "kind",
  "hand",
  "picture",
  "again",
  "change",
  "off",
  "play",
  "spell",
  "air",
  "away",
  "animal",
  "house",
  "point",
  "page",
  "letter",
  "mother",
  "answer",
  "found",
  "study",
  "still",
  "learn",
  "should",
  "world",
  "keyboard",
  "flow",
  "focus",
  "rhythm",
  "speed",
  "practice",
  "session",
  "stream",
];

const PUNCTUATION_END = [".", ",", "!", "?"];

export interface WordGenOptions {
  punctuation?: boolean;
  numbers?: boolean;
  capitalWords?: boolean;
  difficulty?: "normal" | "easy" | "hard";
}

function randomNumber(): string {
  const digits = 1 + Math.floor(Math.random() * 3);
  let n = "";
  for (let i = 0; i < digits; i++) n += Math.floor(Math.random() * 10);
  return n;
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Applies the punctuation/numbers/capitalWords modifiers to a plain
 * word list in place, returning a new array. Kept as a single pass so
 * modifiers can be combined freely (e.g. punctuation + numbers).
 */
function applyModifiers(words: string[], options: WordGenOptions): string[] {
  const { punctuation, numbers, capitalWords } = options;
  return words.map((word) => {
    let w = word;

    if (numbers && Math.random() < 0.12) {
      w = randomNumber();
    } else if (capitalWords) {
      w = capitalize(w);
    }

    if (punctuation) {
      // Occasionally start a "sentence" with a capitalized word.
      if (Math.random() < 0.08 && !capitalWords) {
        w = capitalize(w);
      }
      // Occasionally attach trailing punctuation.
      if (Math.random() < 0.15) {
        const mark = PUNCTUATION_END[Math.floor(Math.random() * PUNCTUATION_END.length)];
        w = `${w}${mark}`;
      } else if (Math.random() < 0.08) {
        w = `${w},`;
      }
    }

    return w;
  });
}

/**
 * Generate `count` words by sampling from the common word list.
 * Uses a simple seeded-free shuffle since visual variety, not
 * cryptographic randomness, is what matters here.
 */
export function generateWords(count: number, options: WordGenOptions = {}): string[] {
  const words: string[] = [];
  const pool =
    options.difficulty === "easy"
      ? COMMON_WORDS.filter((w) => w.length <= 4)
      : options.difficulty === "hard"
        ? COMMON_WORDS.filter((w) => w.length >= 6)
        : COMMON_WORDS;
  let previous = "";
  for (let i = 0; i < count; i++) {
    let candidate = pool[Math.floor(Math.random() * pool.length)] ?? "the";
    // Avoid the exact same word appearing twice in a row.
    let attempts = 0;
    while (candidate === previous && attempts < 5) {
      candidate = pool[Math.floor(Math.random() * pool.length)] ?? "the";
      attempts++;
    }
    words.push(candidate);
    previous = candidate;
  }
  return applyModifiers(words, options);
}

/**
 * Generate an effectively endless stream of words for "time" and
 * "zen" modes by producing generous batches that get appended to as
 * the test runs.
 */
export function generateWordBatch(batchSize = 60, options: WordGenOptions = {}): string[] {
  return generateWords(batchSize, options);
}
