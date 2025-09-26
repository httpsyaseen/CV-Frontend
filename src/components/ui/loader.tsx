"use client";

import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function Loader({
  size = "md",
  text = "Loading...",
  className,
}: LoaderProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        className
      )}
    >
      {/* Animated Spinner */}
      <div className="relative">
        <div
          className={cn(
            "animate-spin rounded-full border-4 border-muted",
            "border-t-primary border-r-primary/60 border-b-primary/30",
            sizeClasses[size]
          )}
        />
        {/* Inner glow effect */}
        <div
          className={cn(
            "absolute inset-0 animate-pulse rounded-full",
            "bg-gradient-to-r from-primary/20 to-accent/20 blur-sm",
            sizeClasses[size]
          )}
        />
      </div>

      {/* Loading Text */}
      {text && (
        <p
          className={cn(
            "font-medium text-card-foreground animate-pulse",
            textSizeClasses[size]
          )}
        >
          {text}
        </p>
      )}
    </div>
  );
}

// CV-specific loader with document animation
export function CVLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6",
        className
      )}
    >
      {/* Document Stack Animation */}
      <div className="relative">
        {/* Background documents */}
        <div className="absolute -top-2 -left-2 w-16 h-20 bg-muted rounded-lg opacity-30 animate-pulse" />
        <div className="absolute -top-1 -left-1 w-16 h-20 bg-muted rounded-lg opacity-50 animate-pulse delay-150" />

        {/* Main document */}
        <div className="relative w-16 h-20 bg-card border-2 border-primary rounded-lg shadow-lg">
          {/* Document lines */}
          <div className="p-2 space-y-1">
            <div className="h-1 bg-primary/60 rounded animate-pulse" />
            <div className="h-1 bg-primary/40 rounded animate-pulse delay-100" />
            <div className="h-1 bg-primary/30 rounded animate-pulse delay-200" />
            <div className="h-1 bg-primary/20 rounded animate-pulse delay-300" />
          </div>

          {/* Checkmark animation */}
          <div className="absolute bottom-2 right-2">
            <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center animate-bounce">
              <svg
                className="w-2 h-2 text-primary-foreground"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="font-semibold text-lg text-card-foreground">
          Processing your CV
        </p>
        <p className="text-sm text-muted-foreground animate-pulse">
          Please wait while we review your information...
        </p>
      </div>
    </div>
  );
}
