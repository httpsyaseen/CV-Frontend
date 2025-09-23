"use client";

import { FormStep } from "@/components/form-step";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WordCounter } from "@/components/word-counter";
import type { FormData } from "../page";

interface SupportingStatementProps {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export function SupportingStatement({
  data,
  updateData,
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
}: SupportingStatementProps) {
  const updateSupportingStatement = (value: string) => {
    const words = value
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    if (words.length <= 2000) {
      updateData({ supportingStatement: value });
    } else {
      const truncated = words.slice(0, 2000).join(" ");
      updateData({ supportingStatement: truncated });
    }
  };

  const getWordCount = (text: string) => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  return (
    <FormStep
      title="Supporting Statement"
      description="Please provide a comprehensive supporting statement (2000 words maximum)"
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={onNext}
      onPrevious={onPrevious}
      canGoNext={true}
    >
      <div className="space-y-4 bg-white">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-900 mb-2">
            Supporting Statement Guidelines
          </h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>
              • Provide comprehensive details about your medical training and
              career progression
            </li>
            <li>
              • Highlight your clinical expertise and specialized competencies
            </li>
            <li>
              • Demonstrate your understanding of the role and healthcare
              environment
            </li>
            <li>
              • Include specific examples of your achievements and contributions
            </li>
            <li>• Connect your experiences to the position requirements</li>
            <li>• Showcase your professional development and future goals</li>
          </ul>
        </div>

        <div className="space-y-3 bg-white">
          <Label
            htmlFor="supportingStatement"
            className="text-base font-medium"
          >
            Supporting Statement (Word Limit: 2000)
          </Label>
          <Textarea
            id="supportingStatement"
            value={data.supportingStatement}
            onChange={(e) => updateSupportingStatement(e.target.value)}
            placeholder="Write your comprehensive supporting statement here. This should provide detailed evidence of your qualifications, experience, and suitability for the role. Include specific examples, achievements, and demonstrate how your background aligns with the position requirements..."
            rows={15}
            className="bg-white resize-none"
          />
          <WordCounter
            currentWords={getWordCount(data.supportingStatement)}
            maxWords={2000}
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Your supporting statement should be
            comprehensive and detailed, providing evidence-based examples of
            your competencies. Structure it logically to cover your training,
            clinical experience, achievements, and career aspirations while
            demonstrating your suitability for the specific role you&apos;re
            applying for.
          </p>
        </div>
      </div>
    </FormStep>
  );
}
