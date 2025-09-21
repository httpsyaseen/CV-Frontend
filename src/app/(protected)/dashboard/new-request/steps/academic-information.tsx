"use client";

import { FormStep } from "@/components/form-step";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WordCounter } from "@/components/word-counter";
import type { FormData } from "../page";

interface AcademicExperienceProps {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export function AcademicExperience({
  data,
  updateData,
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
}: AcademicExperienceProps) {
  const updateField = (field: keyof FormData, value: string) => {
    const words = value
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    if (words.length <= 1000) {
      updateData({ [field]: value });
    } else {
      const truncated = words.slice(0, 1000).join(" ");
      updateData({ [field]: truncated });
    }
  };

  const getWordCount = (text: string) => {
    if (!text) return 0;
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  const fields = [
    {
      key: "researchExperience" as keyof FormData,
      label: "Research Experience",
      placeholder:
        "Describe your research experience, publications, presentations, and any ongoing research projects...",
    },
    {
      key: "teachingExperience" as keyof FormData,
      label: "Teaching Experience",
      placeholder:
        "Detail your teaching roles, training programs, mentoring experience, and educational contributions...",
    },
    {
      key: "leadershipAndManagementExperience" as keyof FormData,
      label: "Leadership & Management Experience",
      placeholder:
        "Outline your leadership roles, management responsibilities, team coordination, and organizational contributions...",
    },
    {
      key: "auditAndQualityImprovementExperience" as keyof FormData,
      label: "Audit & Quality Improvement Experience",
      placeholder:
        "Describe your involvement in clinical audits, quality improvement projects, and process optimization initiatives...",
    },
    {
      key: "clinicalSkillsAndProceduralCompetency" as keyof FormData,
      label: "Clinical Skills & Procedure Competency",
      placeholder:
        "List your clinical skills, procedural competencies, certifications, and specialized training...",
    },
  ];

  return (
    <FormStep
      title="Academic & Professional Experience"
      description="Please provide details about your academic and professional achievements"
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={onNext}
      onPrevious={onPrevious}
      canGoNext={true}
    >
      <div className="space-y-8 bg-white">
        {fields.map((field) => (
          <div key={field.key} className="space-y-3">
            <Label htmlFor={field.key} className="text-base font-medium">
              {field.label}
            </Label>
            <Textarea
              id={field.key}
              value={(data[field.key] as string) || ""}
              onChange={(e) => updateField(field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={6}
              className="bg-white resize-none"
            />
            <WordCounter
              currentWords={getWordCount((data[field.key] as string) || "")}
              maxWords={1000}
            />
          </div>
        ))}
      </div>
    </FormStep>
  );
}
