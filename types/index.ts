/** The four ways a KeyFlow test can be configured. */
export type TestMode = "time" | "words" | "quote" | "zen";

export type TimeOption = 15 | 30 | 60 | 120;
export type WordsOption = 10 | 25 | 50 | 100;
export type QuoteLength = "short" | "medium" | "long";
export type Difficulty = "normal" | "easy" | "hard";

export type ColorPalette =
  | "flow"
  | "paper"
  | "dusk"
  | "terminal"
  | "sunset"
  | "frost"
  | "bloom"
  | "tide"
  | "moss"
  | "ink"
  | "neon"
  | "mocha";

export type FontCategory = "mono" | "sans";

export type FontId =
  // mono
  | "geist-mono"
  | "jetbrains-mono"
  | "ibm-plex-mono"
  | "fira-code"
  | "source-code-pro"
  | "cascadia-code"
  // sans
  | "inter"
  | "space-grotesk"
  | "manrope"
  | "nunito"
  | "poppins"
  | "outfit"
  | "plus-jakarta-sans"
  | "general-sans";

export type SoundPackId = "none" | "mechanical" | "typewriter";

export interface TestConfig {
  mode: TestMode;
  timeOption: TimeOption;
  wordsOption: WordsOption;
  quoteLength: QuoteLength;
  punctuation: boolean;
  numbers: boolean;
  capitalWords: boolean;
  difficulty: Difficulty;
}

/** State of a single character within a word being typed. */
export type CharStatus = "pending" | "correct" | "incorrect" | "extra";

export interface TypedChar {
  char: string;
  status: CharStatus;
}

export interface WpmSample {
  /** Seconds elapsed since the test started. */
  time: number;
  wpm: number;
  rawWpm: number;
}

/** The final, persisted outcome of a completed test. */
export interface TestResult {
  id: string;
  completedAt: string;
  mode: TestMode;
  target: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  extraChars: number;
  missedChars: number;
  correctWords: number;
  incorrectWords: number;
  totalChars: number;
  durationSeconds: number;
  mistakes: number;
  consistency: number;
  wpmHistory: WpmSample[];
}

export interface Settings {
  palette: ColorPalette;
  font: FontId;
  soundPack: SoundPackId;
  soundVolume: number;
  soundEnabled: boolean;
  errorSoundEnabled: boolean;
  smoothCaret: boolean;
  showKeyboard: boolean;
  liveStats: boolean;
  ghostMode: boolean;
}
