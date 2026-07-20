import type { SoundPackId } from "@/types";

export interface SoundPackMeta {
  id: SoundPackId;
  label: string;
  description: string;
  folder: string | null;
  /**
   * "sprite": a single audio sprite with a precise per-key offset map
   *           (see lib/mechanical-sprite-map.ts) — every physical key
   *           has its own real, distinct click.
   * "files":  a handful of sample files per category (letters, numbers,
   *           modifier, backspace, enter, space); one is picked at
   *           random per keystroke for natural variation.
   */
  kind: "sprite" | "files";
  letterVariants?: number;
  numberVariants?: number;
}

/**
 * KeyFlow's sound engine supports two pack "kinds" (see SoundPackMeta.kind
 * above). To add a new sprite-based pack, drop a sprite file + offset map
 * and add an entry. To add a new sample-based pack, create a folder with
 * letters/key-01.wav..key-0N.wav, numbers/key-01.wav..key-0N.wav, and
 * modifier.wav / backspace.wav / enter.wav / space.wav, then add an entry
 * below with matching variant counts. The shared error sound always comes
 * from /public/sounds/error.mp3.
 */
export const SOUND_PACKS: SoundPackMeta[] = [
  { id: "none", label: "Silent", description: "No sound", folder: null, kind: "files" },
  {
    id: "mechanical",
    label: "Mechanical",
    description: "Real per-key mechanical switch recordings",
    folder: "mechanical",
    kind: "sprite",
  },
  {
    id: "typewriter",
    label: "Typewriter",
    description: "Warm, heavy thock",
    folder: "typewriter",
    kind: "files",
    letterVariants: 3,
    numberVariants: 2,
  },
];

export function getSoundPack(id: SoundPackId): SoundPackMeta {
  return SOUND_PACKS.find((p) => p.id === id) ?? SOUND_PACKS[0]!;
}
