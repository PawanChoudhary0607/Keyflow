"use client";

import { useEffect, useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { loadLatestResult } from "@/lib/storage";
import { ResultsSummary } from "@/components/results/results-summary";
import { NoResultsState } from "@/components/results/no-results-state";
import type { TestResult } from "@/types";

export default function ResultsPage() {
  const [result, setResult] = useState<TestResult | null | undefined>(undefined);

  useEffect(() => {
    setResult(loadLatestResult());
  }, []);

  return (
    <div className="flex min-h-dvh flex-col">
      <TopBar />
      {result === undefined ? (
        <div className="h-[60vh]" aria-hidden="true" />
      ) : result === null ? (
        <NoResultsState />
      ) : (
        <ResultsSummary result={result} />
      )}
    </div>
  );
}
