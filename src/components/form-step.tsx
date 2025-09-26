"use client";

import type React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormStepProps {
  title: string;
  description?: string;
  currentStep: number;
  totalSteps: number;
  children: React.ReactNode;
  onNext?: () => void;
  onPrevious?: () => void;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  isLastStep?: boolean;
  isSubmitting?: boolean;
  className?: string;
}

export function FormStep({
  title,
  description,
  currentStep,
  totalSteps,
  children,
  onNext,
  onPrevious,
  canGoNext = true,
  canGoPrevious = true,
  isLastStep = false,
  isSubmitting = false,
  className,
}: FormStepProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className={cn("min-h-screen bg-white", className)}>
      <div className="container mx-auto px-24 py-8 bg-white">
        {/* Progress Header */}
        <div className="">
          <Button onClick={() => (window.location.href = "/dashboard")}>
            <ChevronLeft className="w-4 h-4" />
            Go to Dashboard
          </Button>
          <div className="mb-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                CV Information Collection
              </h1>
              <span className="text-sm text-gray-600">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
        {/* Form Card */}
        <Card className="max-w-4xl mx-auto bg-white">
          <CardHeader>
            <CardTitle className="text-xl text-emerald-700">{title}</CardTitle>
            {description && <p className="text-gray-600">{description}</p>}
          </CardHeader>
          <CardContent className="space-y-6">
            {children}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={onPrevious}
                disabled={!canGoPrevious || currentStep === 1 || isSubmitting}
                className="flex items-center gap-2 bg-transparent disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <Button
                onClick={onNext}
                disabled={!canGoNext || isSubmitting}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting && isLastStep && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {isLastStep
                  ? isSubmitting
                    ? "Submitting..."
                    : "Submit"
                  : "Next"}
                {!isLastStep && !isSubmitting && (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
