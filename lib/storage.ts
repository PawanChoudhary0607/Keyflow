import type { Settings, TestConfig, TestResult } from "@/types";

export const STORAGE_KEYS = {
  settings: "keyflow:settings",
  latestResult: "keyflow:latest-result",
  history: "keyflow:history",
  lastConfig: "keyflow:last-config",
} as const;

export const DEFAULT_SETTINGS: Settings = {
  palette: "flow",
  font: "jetbrains-mono",
  soundPack: "mechanical",
  soundVolume: 0.5,
  soundEnabled: true,
  errorSoundEnabled: true,
  smoothCaret: true,
  showKeyboard: true,
  liveStats: true,
  ghostMode: false,
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadSettings(): Settings {
  if (!isBrowser()) return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.settings);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

export function saveLatestResult(result: TestResult) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEYS.latestResult, JSON.stringify(result));

  const history = loadHistory();
  history.unshift(result);
  window.localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history.slice(0, 50)));
}

export function loadLatestResult(): TestResult | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.latestResult);
    return raw ? (JSON.parse(raw) as TestResult) : null;
  } catch {
    return null;
  }
}

export function loadHistory(): TestResult[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.history);
    return raw ? (JSON.parse(raw) as TestResult[]) : [];
  } catch {
    return [];
  }
}

export function getBestWpm(): number {
  const history = loadHistory();
  if (history.length === 0) return 0;
  return Math.max(...history.map((r) => r.wpm));
}

/**
 * Persists the exact TestConfig used for a completed test, so the
 * Results page's "Try Again" can resume with the same mode, duration,
 * word count, quote length, and modifiers instead of resetting to
 * defaults.
 */
export function saveLastConfig(config: TestConfig) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEYS.lastConfig, JSON.stringify(config));
}

export function loadLastConfig(): TestConfig | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.lastConfig);
    return raw ? (JSON.parse(raw) as TestConfig) : null;
  } catch {
    return null;
  }
}
