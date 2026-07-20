"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Gauge, RotateCcw, Target, Timer, XCircle, Zap } from "lucide-react";
import { StatCard } from "@/components/results/stat-card";
import { WpmChart } from "@/components/results/wpm-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { formatTime } from "@/lib/stats";
import type { TestResult } from "@/types";

export function ResultsSummary({ result }: { result: TestResult }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-12 sm:px-6"
    >
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {result.mode} mode &middot; {formatTime(result.durationSeconds)}
        </p>
        <h1 className="mt-2 font-display text-5xl font-bold text-accent sm:text-6xl">
          {result.wpm} <span className="text-2xl text-foreground sm:text-3xl">wpm</span>
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard icon={Gauge} label="Raw WPM" value={result.rawWpm} />
        <StatCard icon={Target} label="Accuracy" value={`${result.accuracy}%`} accent />
        <StatCard icon={Zap} label="Consistency" value={`${result.consistency}%`} />
        <StatCard icon={Timer} label="Time" value={formatTime(result.durationSeconds)} />
        <StatCard icon={CheckCircle2} label="Correct words" value={result.correctWords} />
        <StatCard icon={XCircle} label="Incorrect words" value={result.incorrectWords} />
        <StatCard icon={CheckCircle2} label="Characters" value={result.totalChars} />
        <StatCard icon={XCircle} label="Mistakes" value={result.mistakes} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>WPM over time</CardTitle>
        </CardHeader>
        <CardContent>
          <WpmChart samples={result.wpmHistory} />
        </CardContent>
      </Card>

      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Link href="/?resume=1" className={buttonVariants({ size: "lg" })}>
          <RotateCcw className="h-4 w-4" />
          Try again
        </Link>
        <Link href="/" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Back home
        </Link>
      </div>
    </motion.div>
  );
}
