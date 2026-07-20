"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      value={{ light: "light", dark: "dark" }}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
