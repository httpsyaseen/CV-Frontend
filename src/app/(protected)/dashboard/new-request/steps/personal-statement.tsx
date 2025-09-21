"use client";

import { FormStep } from "@/components/form-step";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WordCounter } from "@/components/word-counter";
import type { FormData } from "../page";

interface PersonalStatementProps {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export function PersonalStatement({
  data,
  updateData,
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
}: PersonalStatementProps) {
  const updatePersonalStatement = (value: string) => {
    const words = value
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    if (words.length <= 2500) {
      updateData({ personalStatement: value });
    } else {
      const truncated = words.slice(0, 2500).join(" ");
      updateData({ personalStatement: truncated });
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
      title="Personal Statement and Supporting Details"
      description="Please provide your personal statement that highlights your motivation, career goals, and unique qualities"
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={onNext}
      onPrevious={onPrevious}
      canGoNext={true}
    >
      <div className="space-y-4 bg-white">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">
            Personal Statement Guidelines
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Explain your motivation for applying to this role</li>
            <li>• Highlight your career goals and aspirations</li>
            <li>• Demonstrate your understanding of the position</li>
            <li>• Showcase your unique qualities and experiences</li>
            <li>• Connect your background to the role requirements</li>
          </ul>
        </div>

        <div className="space-y-3 bg-white">
          <Label htmlFor="personalStatement" className="text-base font-medium">
            Personal Statement
          </Label>
          <Textarea
            id="personalStatement"
            value={data.personalStatement}
            onChange={(e) => updatePersonalStatement(e.target.value)}
            placeholder="Write your personal statement here. This is your opportunity to tell your story, explain your motivations, and demonstrate why you're the ideal candidate for this role..."
            rows={12}
            className="bg-white resize-none"
          />
          <WordCounter
            currentWords={getWordCount(data.personalStatement)}
            maxWords={2500}
          />
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            <strong>Tip:</strong> A well-crafted personal statement typically
            includes specific examples, demonstrates self-reflection, and
            clearly articulates your career vision. Take your time to make it
            compelling and authentic.
          </p>
        </div>
      </div>
    </FormStep>
  );
}
