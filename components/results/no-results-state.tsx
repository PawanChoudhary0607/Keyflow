import Link from "next/link";
import { Keyboard } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function NoResultsState() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-32 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
        <Keyboard className="h-7 w-7" />
      </div>
      <h1 className="font-display text-2xl font-semibold">No results yet</h1>
      <p className="text-muted-foreground">
        Complete a typing test to see your WPM, accuracy, and consistency here.
      </p>
      <Link href="/" className={buttonVariants({ size: "lg" })}>
        Start a test
      </Link>
    </div>
  );
}
