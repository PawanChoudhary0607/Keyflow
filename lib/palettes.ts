import type { ColorPalette } from "@/types";

export interface PaletteMeta {
  id: ColorPalette;
  label: string;
  swatch: [string, string, string];
}

/**
 * Swatches are the raw hex previews shown in the theme picker.
 * They should stay in sync with the HSL tokens in app/globals.css.
 */
export const PALETTES: PaletteMeta[] = [
  { id: "flow", label: "Flow", swatch: ["#0a0d12", "#4fe0c7", "#a78bfa"] },
  { id: "paper", label: "Paper", swatch: ["#faf6ee", "#1f7fb8", "#d9633b"] },
  { id: "dusk", label: "Dusk", swatch: ["#150f22", "#d3a3f7", "#f472b6"] },
  { id: "terminal", label: "Terminal", swatch: ["#0a120d", "#4ade80", "#facc15"] },
  { id: "sunset", label: "Sunset", swatch: ["#1a100a", "#f5a35c", "#f4718f"] },
  { id: "frost", label: "Frost", swatch: ["#0b1220", "#7dd3fc", "#93c5fd"] },
  { id: "bloom", label: "Bloom", swatch: ["#1c0f16", "#f9a8d4", "#fda4af"] },
  { id: "tide", label: "Tide", swatch: ["#06181a", "#2dd4bf", "#38bdf8"] },
  { id: "moss", label: "Moss", swatch: ["#0e150e", "#86efac", "#bef264"] },
  { id: "ink", label: "Ink", swatch: ["#0c0c0d", "#e5e7eb", "#9ca3af"] },
  { id: "neon", label: "Neon", swatch: ["#0a0014", "#f472f4", "#22d3ee"] },
  { id: "mocha", label: "Mocha", swatch: ["#1a120c", "#e0a672", "#c98a58"] },
];
