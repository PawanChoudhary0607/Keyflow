import { TypingTest } from "@/components/typing/typing-test";
import type { TestMode } from "@/types";

const VALID_MODES: TestMode[] = ["time", "words", "quote", "zen"];

interface HomePageProps {
  searchParams: Promise<{ mode?: string; resume?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const mode = VALID_MODES.includes(params.mode as TestMode)
    ? (params.mode as TestMode)
    : undefined;
  const resume = params.resume === "1";

  return (
    <TypingTest initialConfig={mode ? { mode } : undefined} useLastConfig={resume} />
  );
}
