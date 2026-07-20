"use client";

import { useSettings } from "@/components/providers/settings-provider";
import { FONTS } from "@/lib/fonts";
import { fontFamilyFor } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import type { FontId } from "@/types";

function FontGroup({ title, ids }: { title: string; ids: FontId[] }) {
  const { settings, updateSettings } = useSettings();
  const items = FONTS.filter((f) => ids.includes(f.id));

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <div className="flex flex-col gap-1.5">
        {items.map((f) => (
          <button
            key={f.id}
            onClick={() => updateSettings({ font: f.id })}
            style={{ fontFamily: fontFamilyFor(f.id) }}
            className={cn(
              "focus-ring rounded-xl border p-3 text-left text-base transition-colors",
              settings.font === f.id
                ? "border-accent bg-accent/10"
                : "border-border hover:bg-muted/50",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function FontPicker() {
  const monoIds: FontId[] = [
    "geist-mono",
    "jetbrains-mono",
    "ibm-plex-mono",
    "fira-code",
    "source-code-pro",
    "cascadia-code",
  ];
  const sansIds: FontId[] = [
    "inter",
    "space-grotesk",
    "manrope",
    "nunito",
    "poppins",
    "outfit",
    "plus-jakarta-sans",
    "general-sans",
  ];

  return (
    <div className="flex flex-col gap-6">
      <FontGroup title="Mono" ids={monoIds} />
      <FontGroup title="Sans" ids={sansIds} />
    </div>
  );
}
