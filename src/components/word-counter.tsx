"use client";

import { cn } from "@/lib/utils";

interface WordCounterProps {
  currentWords: number;
  maxWords: number;
  className?: string;
}

export function WordCounter({
  currentWords,
  maxWords,
  className,
}: WordCounterProps) {
  const remainingWords = maxWords - currentWords;
  const isOverLimit = currentWords > maxWords;

  return (
    <div className={cn("text-sm", className)}>
      <span
        className={cn(
          "font-medium",
          isOverLimit
            ? "text-red-600"
            : remainingWords <= 50
            ? "text-orange-600"
            : "text-gray-600"
        )}
      >
        {isOverLimit
          ? `${Math.abs(remainingWords)} words over limit`
          : `${remainingWords} words remaining`}
      </span>
      <span className="text-gray-500 ml-2">
        ({currentWords}/{maxWords} words)
      </span>
    </div>
  );
}
