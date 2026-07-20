"use client";

import { useCallback, useEffect, useRef } from "react";
import { getSoundPack } from "@/lib/sound-packs";
import { classifyKeyCode, type KeySoundCategory } from "@/lib/key-category";
import {
  MECHANICAL_SPRITE_FALLBACK,
  MECHANICAL_SPRITE_OFFSETS,
} from "@/lib/mechanical-sprite-map";
import type { SoundPackId } from "@/types";

const ERROR_SOUND_URL = "/sounds/error.mp3";
/** Random pitch/volume jitter applied per keystroke so repeats don't sound identical. */
const JITTER = 0.03;

type FileCategory = Exclude<KeySoundCategory, never>;

interface LoadedAssets {
  spriteBuffer: AudioBuffer | null;
  fileBuffers: Partial<Record<FileCategory, AudioBuffer[]>>;
  errorBuffer: AudioBuffer | null;
}

async function decode(ctx: AudioContext, url: string): Promise<AudioBuffer | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    return await ctx.decodeAudioData(arrayBuffer);
  } catch {
    return null;
  }
}

function jitterMultiplier() {
  return 1 + (Math.random() * 2 - 1) * JITTER;
}

/**
 * KeyFlow's keyboard sound engine. Two playback strategies, chosen by
 * the active pack's `kind`:
 *  - "sprite": one audio buffer, per-key offsets (real recordings).
 *  - "files": several sample files per category, one picked at random.
 * A shared error/"Fah" sound is loaded independently of the pack.
 */
export function useKeyboardSound(packId: SoundPackId, enabled: boolean, volume: number) {
  const ctxRef = useRef<AudioContext | null>(null);
  const assetsRef = useRef<LoadedAssets>({
    spriteBuffer: null,
    fileBuffers: {},
    errorBuffer: null,
  });

  useEffect(() => {
    const pack = getSoundPack(packId);
    if (!enabled) {
      assetsRef.current = { spriteBuffer: null, fileBuffers: {}, errorBuffer: null };
      return;
    }

    let cancelled = false;
    const AudioContextCtor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = ctxRef.current ?? new AudioContextCtor();
    ctxRef.current = ctx;

    (async () => {
      const errorBuffer = await decode(ctx, ERROR_SOUND_URL);
      if (cancelled) return;

      if (pack.kind === "sprite" && pack.folder) {
        const spriteBuffer = await decode(ctx, `/sounds/${pack.folder}/sprite.ogg`);
        if (cancelled) return;
        assetsRef.current = { spriteBuffer, fileBuffers: {}, errorBuffer };
        return;
      }

      if (pack.kind === "files" && pack.folder) {
        const categories: FileCategory[] = ["modifier", "backspace", "enter", "space"];
        const fileBuffers: Partial<Record<FileCategory, AudioBuffer[]>> = {};

        for (const cat of categories) {
          const buf = await decode(ctx, `/sounds/${pack.folder}/${cat}.wav`);
          if (buf) fileBuffers[cat] = [buf];
        }

        const letters: AudioBuffer[] = [];
        for (let i = 1; i <= (pack.letterVariants ?? 0); i++) {
          const buf = await decode(
            ctx,
            `/sounds/${pack.folder}/letters/key-${String(i).padStart(2, "0")}.wav`,
          );
          if (buf) letters.push(buf);
        }
        if (letters.length) fileBuffers.letters = letters;

        const numbers: AudioBuffer[] = [];
        for (let i = 1; i <= (pack.numberVariants ?? 0); i++) {
          const buf = await decode(
            ctx,
            `/sounds/${pack.folder}/numbers/key-${String(i).padStart(2, "0")}.wav`,
          );
          if (buf) numbers.push(buf);
        }
        if (numbers.length) fileBuffers.numbers = numbers;

        if (cancelled) return;
        assetsRef.current = { spriteBuffer: null, fileBuffers, errorBuffer };
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [packId, enabled]);

  const playBuffer = useCallback(
    (buffer: AudioBuffer, offsetSec = 0, durationSec?: number, pitchJitter = true) => {
      const ctx = ctxRef.current;
      if (!ctx) return;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = pitchJitter ? jitterMultiplier() : 1;
      const gain = ctx.createGain();
      gain.gain.value = volume * (pitchJitter ? jitterMultiplier() : 1);
      source.connect(gain).connect(ctx.destination);
      if (durationSec !== undefined) {
        source.start(0, offsetSec, durationSec);
      } else {
        source.start(0, offsetSec);
      }
    },
    [volume],
  );

  /** Pass a physical KeyboardEvent.code, or "error" for the Fah sound. */
  const play = useCallback(
    (codeOrError: string | "error") => {
      if (!enabled) return;
      const { spriteBuffer, fileBuffers, errorBuffer } = assetsRef.current;

      if (codeOrError === "error") {
        if (errorBuffer) playBuffer(errorBuffer, 0, undefined, false);
        return;
      }

      if (spriteBuffer) {
        const [offsetMs, durationMs] =
          MECHANICAL_SPRITE_OFFSETS[codeOrError] ?? MECHANICAL_SPRITE_FALLBACK;
        playBuffer(spriteBuffer, offsetMs / 1000, durationMs / 1000);
        return;
      }

      const category = classifyKeyCode(codeOrError);
      const candidates = fileBuffers[category] ?? fileBuffers.letters;
      if (!candidates || candidates.length === 0) return;
      const buffer = candidates[Math.floor(Math.random() * candidates.length)]!;
      playBuffer(buffer);
    },
    [enabled, playBuffer],
  );

  return { play };
}
