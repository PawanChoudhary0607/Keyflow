"use client";

import { useSettings } from "@/components/providers/settings-provider";
import { PALETTES } from "@/lib/palettes";
import { cn } from "@/lib/utils";
import type { ColorPalette } from "@/types";

export function ThemePicker() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="grid grid-cols-2 gap-2">
      {PALETTES.map((p) => (
        <button
          key={p.id}
          onClick={() => updateSettings({ palette: p.id as ColorPalette })}
          className={cn(
            "focus-ring flex items-center gap-2 rounded-xl border p-2.5 text-left text-sm transition-colors",
            settings.palette === p.id
              ? "border-accent bg-accent/10"
              : "border-border hover:bg-muted/50",
          )}
        >
          <span className="flex overflow-hidden rounded-md">
            {p.swatch.map((hex, i) => (
              <span key={i} className="h-5 w-3" style={{ backgroundColor: hex }} />
            ))}
          </span>
          {p.label}
        </button>
      ))}
    </div>
  );
}
