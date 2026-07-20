import type { FontCategory, FontId } from "@/types";

export interface FontMeta {
  id: FontId;
  label: string;
  category: FontCategory;
  /** CSS variable set on <body> by app/layout.tsx for fonts loaded via next/font. */
  cssVar: `--font-${string}`;
  /**
   * True for fonts not distributed on Google Fonts (Cascadia Code, General
   * Sans). These are referenced by name with a system-font fallback chain
   * instead of being self-hosted — they render correctly for users who
   * have the font installed locally (e.g. Cascadia Code ships with VS
   * Code / Windows Terminal) and fall back gracefully otherwise.
   */
  systemFallback?: string;
}

export const FONTS: FontMeta[] = [
  // Mono
  { id: "geist-mono", label: "Geist Mono", category: "mono", cssVar: "--font-geist-mono" },
  {
    id: "jetbrains-mono",
    label: "JetBrains Mono",
    category: "mono",
    cssVar: "--font-jetbrains-mono",
  },
  {
    id: "ibm-plex-mono",
    label: "IBM Plex Mono",
    category: "mono",
    cssVar: "--font-ibm-plex-mono",
  },
  { id: "fira-code", label: "Fira Code", category: "mono", cssVar: "--font-fira-code" },
  {
    id: "source-code-pro",
    label: "Source Code Pro",
    category: "mono",
    cssVar: "--font-source-code-pro",
  },
  {
    id: "cascadia-code",
    label: "Cascadia Code",
    category: "mono",
    cssVar: "--font-cascadia-code",
    systemFallback: `"Cascadia Code", "Cascadia Mono", ui-monospace, monospace`,
  },
  // Sans
  { id: "inter", label: "Inter", category: "sans", cssVar: "--font-inter" },
  {
    id: "space-grotesk",
    label: "Space Grotesk",
    category: "sans",
    cssVar: "--font-space-grotesk",
  },
  { id: "manrope", label: "Manrope", category: "sans", cssVar: "--font-manrope" },
  { id: "nunito", label: "Nunito", category: "sans", cssVar: "--font-nunito" },
  { id: "poppins", label: "Poppins", category: "sans", cssVar: "--font-poppins" },
  { id: "outfit", label: "Outfit", category: "sans", cssVar: "--font-outfit" },
  {
    id: "plus-jakarta-sans",
    label: "Plus Jakarta Sans",
    category: "sans",
    cssVar: "--font-plus-jakarta-sans",
  },
  {
    id: "general-sans",
    label: "General Sans",
    category: "sans",
    cssVar: "--font-general-sans",
    systemFallback: `"General Sans", ui-sans-serif, system-ui, sans-serif`,
  },
];

export function getFont(id: FontId): FontMeta {
  return FONTS.find((f) => f.id === id) ?? FONTS[0]!;
}

/** CSS `font-family` value to apply for a given font id. */
export function fontFamilyFor(id: FontId): string {
  const meta = getFont(id);
  return meta.systemFallback ?? `var(${meta.cssVar})`;
}
