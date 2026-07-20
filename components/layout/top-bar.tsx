"use client";

import { Github, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { KeyFlowLogo } from "@/components/layout/keyflow-logo";
import { SettingsTrigger } from "@/components/settings/settings-trigger";
import { useSettings } from "@/components/providers/settings-provider";
import { cn } from "@/lib/utils";

interface TopBarProps {
  /** Soft-blurs and dims the bar (typing has started). */
  blurred?: boolean;
  /** Fully hides the bar (idle timeout reached). */
  hidden?: boolean;
  className?: string;
}

const GITHUB_URL =
  process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/PawanChoudhary0607/KeyFlow";

export function TopBar({ blurred, hidden, className }: TopBarProps) {
  const { settings, updateSettings } = useSettings();
  const audioOn = settings.soundPack !== "none" && settings.soundEnabled;

  const toggleAudio = () => {
    if (audioOn) {
      updateSettings({ soundEnabled: false });
    } else {
      updateSettings({
        soundEnabled: true,
        soundPack: settings.soundPack === "none" ? "mechanical" : settings.soundPack,
      });
    }
  };

  return (
    <header
      className={cn(
        "flex h-16 shrink-0 items-center justify-between px-4 transition-all duration-300 ease-out sm:px-6",
        blurred && "pointer-events-none opacity-50 blur-[3px]",
        hidden && "pointer-events-none opacity-0 blur-0",
        className,
      )}
    >
      <Link href="/" className="focus-ring rounded-lg">
        <KeyFlowLogo />
      </Link>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleAudio}
          aria-label={audioOn ? "Mute keyboard sound" : "Unmute keyboard sound"}
          aria-pressed={audioOn}
          className="focus-ring flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted-foreground transition-all duration-150 hover:border-accent/40 hover:bg-muted hover:text-foreground active:scale-95"
        >
          {audioOn ? (
            <Volume2 className="h-[18px] w-[18px]" />
          ) : (
            <VolumeX className="h-[18px] w-[18px]" />
          )}
        </button>
        <SettingsTrigger />
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="View source on GitHub"
          className="focus-ring flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted-foreground transition-all duration-150 hover:border-accent/40 hover:bg-muted hover:text-foreground active:scale-95"
        >
          <Github className="h-[18px] w-[18px]" />
        </a>
      </div>
    </header>
  );
}
