import { cn } from "@/lib/utils";
import { Caret } from "@/components/typing/caret";

interface WordProps {
  target: string;
  typed: string;
  isCurrent: boolean;
  isDone: boolean;
  smoothCaret: boolean;
}

/**
 * Renders a single word with per-character correctness coloring.
 * - Completed words: characters beyond what was typed show as "skipped".
 * - The current word: shows the live caret at the typed position, plus
 *   any extra characters typed past the target length.
 */
export function Word({ target, typed, isCurrent, isDone, smoothCaret }: WordProps) {
  const chars = target.split("");
  const extra = typed.length > target.length ? typed.slice(target.length) : "";

  return (
    <span className="relative mr-[0.6em] inline-flex text-2xl sm:text-3xl">
      {isCurrent && typed.length === 0 && <Caret smooth={smoothCaret} />}
      {chars.map((char, i) => {
        const typedChar = typed[i];
        let status: "pending" | "correct" | "incorrect" = "pending";
        if (typedChar !== undefined) {
          status = typedChar === char ? "correct" : "incorrect";
        } else if (isDone) {
          status = "pending";
        }

        return (
          <span key={i} className="relative inline-flex">
            <span
              className={cn(
                "transition-colors duration-100",
                status === "correct" && "text-correct",
                status === "incorrect" &&
                  "text-incorrect underline decoration-2 underline-offset-[3px]",
                status === "pending" && "text-muted-foreground/60",
              )}
            >
              {char}
            </span>
            {isCurrent && i === typed.length - 1 && (
              <span className="absolute left-full top-0">
                <Caret smooth={smoothCaret} />
              </span>
            )}
          </span>
        );
      })}
      {extra.split("").map((char, i) => (
        <span key={`extra-${i}`} className="relative inline-flex text-incorrect/80">
          {char}
          {isCurrent && chars.length + i === typed.length - 1 && (
            <span className="absolute left-full top-0">
              <Caret smooth={smoothCaret} />
            </span>
          )}
        </span>
      ))}
    </span>
  );
}
