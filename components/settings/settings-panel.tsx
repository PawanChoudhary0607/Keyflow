"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Laptop, Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useSettings } from "@/components/providers/settings-provider";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ThemePicker } from "@/components/settings/theme-picker";
import { FontPicker } from "@/components/settings/font-picker";
import { PALETTES } from "@/lib/palettes";
import { FONTS } from "@/lib/fonts";
import { SOUND_PACKS } from "@/lib/sound-packs";
import { cn } from "@/lib/utils";
import type { SoundPackId } from "@/types";

type SettingsView = "root" | "themes" | "fonts";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </p>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border p-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        label={label}
        className="shrink-0"
      />
    </div>
  );
}

export function SettingsPanel() {
  const { settings, updateSettings } = useSettings();
  const { theme, setTheme } = useTheme();
  const [view, setView] = useState<SettingsView>("root");

  const currentPalette = PALETTES.find((p) => p.id === settings.palette);
  const currentFont = FONTS.find((f) => f.id === settings.font);

  return (
    <AnimatePresence mode="wait">
      {view === "themes" ? (
        <SubView key="themes" title="Themes" onBack={() => setView("root")}>
          <ThemePicker />
        </SubView>
      ) : view === "fonts" ? (
        <SubView key="fonts" title="Fonts" onBack={() => setView("root")}>
          <FontPicker />
        </SubView>
      ) : (
        <motion.div
          key="root"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-8"
        >
          <section>
            <SectionLabel>Appearance</SectionLabel>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: "light", label: "Light", icon: Sun },
                  { id: "dark", label: "Dark", icon: Moon },
                  { id: "system", label: "System", icon: Laptop },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setTheme(opt.id)}
                  className={cn(
                    "focus-ring flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-medium transition-colors",
                    theme === opt.id
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-muted-foreground hover:bg-muted/50",
                  )}
                >
                  <opt.icon className="h-4 w-4" />
                  {opt.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setView("themes")}
              className="focus-ring mt-2 flex w-full items-center justify-between rounded-xl border border-border p-3 text-sm transition-colors hover:bg-muted/50"
            >
              <span className="flex items-center gap-2">
                <span className="flex overflow-hidden rounded-md">
                  {currentPalette?.swatch.map((hex, i) => (
                    <span key={i} className="h-4 w-2.5" style={{ backgroundColor: hex }} />
                  ))}
                </span>
                Theme &middot;{" "}
                <span className="text-muted-foreground">{currentPalette?.label}</span>
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>

            <button
              onClick={() => setView("fonts")}
              className="focus-ring mt-2 flex w-full items-center justify-between rounded-xl border border-border p-3 text-sm transition-colors hover:bg-muted/50"
            >
              <span>
                Font &middot;{" "}
                <span className="text-muted-foreground">{currentFont?.label}</span>
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </section>

          <section>
            <SectionLabel>Keyboard</SectionLabel>
            <ToggleRow
              label="Show Keyboard"
              checked={settings.showKeyboard}
              onCheckedChange={(v) => updateSettings({ showKeyboard: v })}
            />
          </section>

          <section>
            <SectionLabel>Sound</SectionLabel>
            <div className="flex flex-col gap-2">
              {SOUND_PACKS.map((pack) => (
                <button
                  key={pack.id}
                  onClick={() =>
                    updateSettings({
                      soundPack: pack.id as SoundPackId,
                      soundEnabled: pack.id !== "none",
                    })
                  }
                  className={cn(
                    "focus-ring flex items-center justify-between rounded-xl border p-3 text-left text-sm transition-colors",
                    settings.soundPack === pack.id
                      ? "border-accent bg-accent/10"
                      : "border-border hover:bg-muted/50",
                  )}
                >
                  <span>
                    <span className="block font-medium">{pack.label}</span>
                    <span className="block text-xs text-muted-foreground">
                      {pack.description}
                    </span>
                  </span>
                  {pack.id === "none" ? (
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Volume2 className="h-4 w-4 text-accent" />
                  )}
                </button>
              ))}
            </div>

            {settings.soundEnabled && (
              <div className="mt-3 flex items-center gap-3">
                <VolumeX className="h-4 w-4 shrink-0 text-muted-foreground" />
                <Slider
                  value={settings.soundVolume}
                  onChange={(v) => updateSettings({ soundVolume: v })}
                  aria-label="Sound volume"
                />
                <Volume2 className="h-4 w-4 shrink-0 text-muted-foreground" />
              </div>
            )}
          </section>

          <section>
            <SectionLabel>Gameplay</SectionLabel>
            <div className="flex flex-col gap-2">
              <ToggleRow
                label="Live Stats"
                description="Show WPM, Accuracy and Timer while typing."
                checked={settings.liveStats}
                onCheckedChange={(v) => updateSettings({ liveStats: v })}
              />
              <ToggleRow
                label="Ghost Mode"
                description="Dim upcoming words for better focus."
                checked={settings.ghostMode}
                onCheckedChange={(v) => updateSettings({ ghostMode: v })}
              />
              <ToggleRow
                label="Error Sound (Fah Mode)"
                description="Play the error sound whenever the wrong key is pressed."
                checked={settings.errorSoundEnabled}
                onCheckedChange={(v) => updateSettings({ errorSoundEnabled: v })}
              />
              <ToggleRow
                label="Smooth Caret"
                description="Animate the caret as it moves between characters."
                checked={settings.smoothCaret}
                onCheckedChange={(v) => updateSettings({ smoothCaret: v })}
              />
            </div>
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SubView({
  title,
  onBack,
  children,
}: {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      key={title}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.2 }}
    >
      <button
        onClick={onBack}
        className="focus-ring mb-4 flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>
      <h3 className="mb-4 font-display text-base font-semibold">{title}</h3>
      {children}
    </motion.div>
  );
}
