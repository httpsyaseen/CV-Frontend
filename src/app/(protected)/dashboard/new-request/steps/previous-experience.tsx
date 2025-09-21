"use client";

import { FormStep } from "@/components/form-step";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WordCounter } from "@/components/word-counter";
import { Plus, Trash2 } from "lucide-react";
import type { FormData } from "../page";

interface PreviousExperienceProps {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export function PreviousExperience({
  data,
  updateData,
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
}: PreviousExperienceProps) {
  // Helper function for word counting
  const getWordCount = (text: string) => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  // Check if an experience is completely empty
  const isExperienceEmpty = (experience: {
    startDate: string;
    endDate: string;
    hospitalName: string;
    hospitalAddress: string;
    jobTitle: string;
    jobDescription: string;
  }) => {
    return (
      experience.startDate.trim() === "" &&
      experience.endDate.trim() === "" &&
      experience.hospitalName.trim() === "" &&
      experience.hospitalAddress.trim() === "" &&
      experience.jobTitle.trim() === "" &&
      experience.jobDescription.trim() === ""
    );
  };

  // Check if an experience is completely filled
  const isExperienceComplete = (experience: {
    startDate: string;
    endDate: string;
    hospitalName: string;
    hospitalAddress: string;
    jobTitle: string;
    jobDescription: string;
  }) => {
    return (
      experience.startDate.trim() !== "" &&
      experience.endDate.trim() !== "" &&
      experience.hospitalName.trim() !== "" &&
      experience.hospitalAddress.trim() !== "" &&
      experience.jobTitle.trim() !== "" &&
      experience.jobDescription.trim() !== ""
    );
  };

  // Check if all experiences are valid (either empty or complete, no partial)
  const areAllExperiencesValid = () => {
    return data.previousExperiences.every(
      (exp) => isExperienceEmpty(exp) || isExperienceComplete(exp)
    );
  };

  // Check if we can proceed to next step (only need valid experiences, no minimum requirement)
  const canGoNext = () => {
    return areAllExperiencesValid();
  };

  // Check if we can add new experience
  const canAddNewExperience = () => {
    return areAllExperiencesValid() && data.previousExperiences.length < 10;
  };

  const addJob = () => {
    if (canAddNewExperience()) {
      updateData({
        previousExperiences: [
          ...data.previousExperiences,
          {
            startDate: "",
            endDate: "",
            hospitalName: "",
            hospitalAddress: "",
            jobTitle: "",
            jobDescription: "",
          },
        ],
      });
    }
  };

  const removeJob = (index: number) => {
    if (data.previousExperiences.length > 1) {
      const newJobs = data.previousExperiences.filter((_, i) => i !== index);
      updateData({ previousExperiences: newJobs });
    }
  };

  const updateJob = (index: number, field: string, value: string) => {
    const newJobs = [...data.previousExperiences];
    if (field === "jobDescription") {
      const words = value
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
      if (words.length <= 750) {
        newJobs[index] = { ...newJobs[index], [field]: value };
      } else {
        const truncated = words.slice(0, 750).join(" ");
        newJobs[index] = { ...newJobs[index], [field]: truncated };
      }
    } else {
      newJobs[index] = { ...newJobs[index], [field]: value };
    }
    updateData({ previousExperiences: newJobs });
  };

  return (
    <FormStep
      title="Previous Experience and Employment"
      description="Please provide details about your previous work experience"
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={onNext}
      onPrevious={onPrevious}
      canGoNext={canGoNext()}
    >
      <div className="space-y-6 bg-white">
        {data.previousExperiences.map((job, index) => {
          const isEmpty = isExperienceEmpty(job);
          const isComplete = isExperienceComplete(job);
          const isPartial = !isEmpty && !isComplete;

          return (
            <Card
              key={index}
              className={`relative shadow-lg ${
                isEmpty
                  ? "bg-gray-50 border-gray-200"
                  : isComplete
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-300"
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">
                    Experience {index + 1}
                  </CardTitle>
                  {isEmpty && (
                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      Empty
                    </span>
                  )}
                  {isComplete && (
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                      Complete
                    </span>
                  )}
                  {isPartial && (
                    <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                      Incomplete - Fill all fields or clear all
                    </span>
                  )}
                </div>
                {data.previousExperiences.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeJob(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                    <Input
                      id={`startDate-${index}`}
                      type="date"
                      value={job.startDate}
                      onChange={(e) =>
                        updateJob(index, "startDate", e.target.value)
                      }
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`endDate-${index}`}>End Date</Label>
                    <Input
                      id={`endDate-${index}`}
                      type="date"
                      value={job.endDate}
                      onChange={(e) =>
                        updateJob(index, "endDate", e.target.value)
                      }
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`hospitalName-${index}`}>
                      Hospital Name
                    </Label>
                    <Input
                      id={`hospitalName-${index}`}
                      value={job.hospitalName}
                      onChange={(e) =>
                        updateJob(
                          index,
                          "hospitalName",
                          e.target.value.slice(0, 100)
                        )
                      }
                      placeholder="Enter hospital name"
                      maxLength={100}
                      className="bg-white"
                    />
                    <p className="text-xs text-gray-500">Max 100 characters</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`jobTitle-${index}`}>Job Title</Label>
                    <Input
                      id={`jobTitle-${index}`}
                      value={job.jobTitle}
                      onChange={(e) =>
                        updateJob(
                          index,
                          "jobTitle",
                          e.target.value.slice(0, 20)
                        )
                      }
                      placeholder="Enter job title"
                      maxLength={20}
                      className="bg-white"
                    />
                    <p className="text-xs text-gray-500">Max 20 characters</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`hospitalAddress-${index}`}>
                    Hospital Address
                  </Label>
                  <Input
                    id={`hospitalAddress-${index}`}
                    value={job.hospitalAddress}
                    onChange={(e) =>
                      updateJob(
                        index,
                        "hospitalAddress",
                        e.target.value.slice(0, 100)
                      )
                    }
                    placeholder="Enter hospital address"
                    maxLength={100}
                    className="bg-white"
                  />
                  <p className="text-xs text-gray-500">Max 100 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`jobDescription-${index}`}>
                    Job Description / Responsibilities
                  </Label>
                  <Textarea
                    id={`jobDescription-${index}`}
                    value={job.jobDescription}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      updateJob(index, "jobDescription", e.target.value)
                    }
                    placeholder="Describe your job responsibilities and achievements..."
                    rows={4}
                    className="bg-white resize-none"
                  />
                  <WordCounter
                    currentWords={getWordCount(job.jobDescription)}
                    maxWords={750}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Add Job Button */}
        <div className="text-center space-y-3">
          {data.previousExperiences.length < 10 ? (
            <>
              <Button
                variant="outline"
                onClick={addJob}
                disabled={!canAddNewExperience()}
                className={`flex items-center gap-2 ${
                  canAddNewExperience()
                    ? "bg-transparent hover:bg-gray-50"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Plus className="w-4 h-4" />
                Add Another Experience
              </Button>
              {!areAllExperiencesValid() && (
                <p className="text-red-600 text-sm font-medium">
                  ⚠️ Each experience must be either completely filled out or
                  completely empty.
                  <br />
                  Complete or clear partially filled experiences before adding
                  new ones.
                </p>
              )}
            </>
          ) : (
            <p className="text-red-600 text-sm">
              Maximum allowed is 10 previous jobs. Please combine successive
              jobs together if you have more than 10.
            </p>
          )}
        </div>
      </div>
    </FormStep>
  );
}
