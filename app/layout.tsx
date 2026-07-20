import type { Metadata } from "next";
import {
  Fira_Code,
  IBM_Plex_Mono,
  Inter,
  JetBrains_Mono,
  Manrope,
  Nunito,
  Outfit,
  Plus_Jakarta_Sans,
  Poppins,
  Source_Code_Pro,
  Space_Grotesk,
} from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SettingsProvider } from "@/components/providers/settings-provider";

// Display/body chrome fonts (used outside the typing area).
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const interBody = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

// Mono font choices for the typing area.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});
const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});
const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code-pro",
  display: "swap",
});

// Sans font choices for the typing area.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const spaceGroteskTyping = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const FONT_VARIABLES = [
  spaceGrotesk.variable,
  interBody.variable,
  jetbrainsMono.variable,
  ibmPlexMono.variable,
  firaCode.variable,
  sourceCodePro.variable,
  inter.variable,
  spaceGroteskTyping.variable,
  manrope.variable,
  nunito.variable,
  poppins.variable,
  outfit.variable,
  plusJakartaSans.variable,
  GeistMono.variable,
].join(" ");

export const metadata: Metadata = {
  title: "KeyFlow — Typing Speed Test",
  description:
    "A fast, minimal, local-first typing practice app. Track your WPM, accuracy, and consistency across time, words, quote, and zen modes.",
  keywords: ["typing test", "wpm test", "typing speed", "typing practice", "keyflow"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-palette="flow" suppressHydrationWarning>
      <body className={`${FONT_VARIABLES} font-body antialiased`}>
        <ThemeProvider>
          <SettingsProvider>{children}</SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
