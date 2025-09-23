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
  const updateField = (
    field: keyof FormData,
    value: string,
    maxWords: number
  ) => {
    const words = value
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    if (words.length <= maxWords) {
      updateData({ [field]: value });
    } else {
      const truncated = words.slice(0, maxWords).join(" ");
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
      key: "clinicalSkillsAndProcedures" as keyof FormData,
      label: "Clinical Skills and Procedures",
      placeholder:
        "List your clinical skills, procedural competencies, certifications, and specialized training...",
      maxWords: 500,
    },
    {
      key: "teachingExperience" as keyof FormData,
      label: "Teaching Experience",
      placeholder:
        "Detail your teaching roles, training programs, mentoring experience, and educational contributions...",
      maxWords: 1000,
    },
    {
      key: "teamworkAndCommunication" as keyof FormData,
      label: "Teamwork and Communication",
      placeholder:
        "Describe your teamwork skills, communication abilities, collaborative experiences, and interpersonal strengths...",
      maxWords: 1000,
    },
    {
      key: "leadershipAndManagement" as keyof FormData,
      label: "Leadership and Management",
      placeholder:
        "Outline your leadership roles, management responsibilities, team coordination, and organizational contributions...",
      maxWords: 1000,
    },
    {
      key: "researchExperience" as keyof FormData,
      label: "Research Experience",
      placeholder:
        "Describe your research experience, publications, presentations, and any ongoing research projects...",
      maxWords: 1000,
    },
    {
      key: "publicationsAndPresentations" as keyof FormData,
      label: "Publications and Presentations",
      placeholder:
        "List your publications, conference presentations, academic contributions, and scholarly activities...",
      maxWords: 1000,
    },
    {
      key: "qualityImprovementAndAudit" as keyof FormData,
      label: "Quality Improvement and Audit",
      placeholder:
        "Describe your involvement in clinical audits, quality improvement projects, and process optimization initiatives...",
      maxWords: 1000,
    },
    {
      key: "others" as keyof FormData,
      label: "Others",
      placeholder:
        "Include any other relevant experiences, achievements, or information that supports your application...",
      maxWords: 500,
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
              {field.label} (Word Limit: {field.maxWords})
            </Label>
            <Textarea
              id={field.key}
              value={(data[field.key] as string) || ""}
              onChange={(e) =>
                updateField(field.key, e.target.value, field.maxWords)
              }
              placeholder={field.placeholder}
              rows={6}
              className="bg-white resize-none"
            />
            <WordCounter
              currentWords={getWordCount((data[field.key] as string) || "")}
              maxWords={field.maxWords}
            />
          </div>
        ))}
      </div>
    </FormStep>
  );
}
