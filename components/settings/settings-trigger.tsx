"use client";

import { Settings2 } from "lucide-react";
import { useState } from "react";
import { Sheet } from "@/components/ui/sheet";
import { SettingsPanel } from "@/components/settings/settings-panel";

export function SettingsTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open settings"
        className="focus-ring flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Settings2 className="h-[18px] w-[18px]" />
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Settings">
        <SettingsPanel />
      </Sheet>
    </>
  );
}
