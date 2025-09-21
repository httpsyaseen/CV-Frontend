"use client";

import { useState } from "react";
import { BasicInformation } from "./steps/basic-information";
import { PreviousExperience } from "./steps/previous-experience";
import { AcademicExperience } from "./steps/academic-information";
import { PersonalStatement } from "./steps/personal-statement";
import { ServiceLevel } from "./steps/service-level";
import api from "@/lib/api";
import toast from "react-hot-toast";
import showError from "@/components/send-error";

export interface FormData {
  // Basic Information
  firstName: string;
  lastName: string;
  yearOfBirth: number | string;
  yearOfMedicalGraduation: number | string;
  applyingForJobRole: string;
  targetMarkets: string[];

  // Previous Experience
  previousExperiences: Array<{
    startDate: string;
    endDate: string;
    hospitalName: string;
    hospitalAddress: string;
    jobTitle: string;
    jobDescription: string;
  }>;

  // Academic Experience
  researchExperience: string;
  teachingExperience: string;
  leadershipManagementExperience: string;
  auditQualityImprovementExperience: string;
  clinicalSkillsProcedureCompetency: string;

  // Personal Statement
  personalStatement: string;

  // Service Level
  serviceLevel: string;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  yearOfBirth: "",
  yearOfMedicalGraduation: "",
  applyingForJobRole: "",
  targetMarkets: [],
  previousExperiences: [
    {
      startDate: "",
      endDate: "",
      hospitalName: "",
      hospitalAddress: "",
      jobTitle: "",
      jobDescription: "",
    },
  ],
  researchExperience: "",
  teachingExperience: "",
  leadershipManagementExperience: "",
  auditQualityImprovementExperience: "",
  clinicalSkillsProcedureCompetency: "",
  personalStatement: "",
  serviceLevel: "",
};

export default function NewRequestPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const totalSteps = 5;

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const goToNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Helper function to check if a value is empty
      const isEmpty = (
        value: string | number | string[] | undefined | null
      ): boolean => {
        if (value === null || value === undefined) return true;
        if (typeof value === "string") return value.trim() === "";
        if (Array.isArray(value)) return value.length === 0;
        if (typeof value === "number") return false; // Numbers are never considered empty
        return false;
      };

      // Helper function to check if a text field has less than 5 words
      const hasLessThan5Words = (text: string): boolean => {
        if (!text || typeof text !== "string") return true;
        const words = text
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0);
        return words.length < 5;
      };

      // Helper function to check if a field should be excluded from API (empty or <5 words for text fields)
      const shouldExcludeFromAPI = (
        value: string | number | string[] | undefined | null,
        isTextField: boolean = false
      ): boolean => {
        if (isEmpty(value)) return true;
        if (isTextField && typeof value === "string") {
          return hasLessThan5Words(value);
        }
        return false;
      };

      // Helper function to validate experience for API submission
      const isValidExperience = (exp: {
        startDate: string;
        endDate: string;
        hospitalName: string;
        hospitalAddress: string;
        jobTitle: string;
        jobDescription: string;
      }): boolean => {
        // Don't include if basic fields are empty
        if (
          isEmpty(exp.startDate) ||
          isEmpty(exp.endDate) ||
          isEmpty(exp.hospitalName) ||
          isEmpty(exp.jobTitle)
        ) {
          return false;
        }
        // Don't include if job description has less than 5 words
        if (hasLessThan5Words(exp.jobDescription)) {
          return false;
        }
        return true;
      };

      // Filter out empty previous experiences
      const validPreviousExperiences = formData.previousExperiences.filter(
        (exp) => isValidExperience(exp)
      );

      // Build submitData with only non-empty fields
      const submitData: Record<string, unknown> = {};

      // Basic Information - always include if not empty
      if (!isEmpty(formData.firstName))
        submitData.firstName = formData.firstName;
      if (!isEmpty(formData.lastName)) submitData.lastName = formData.lastName;
      if (!isEmpty(formData.yearOfBirth))
        submitData.yearOfBirth = parseInt(formData.yearOfBirth as string) || 0;
      if (!isEmpty(formData.yearOfMedicalGraduation))
        submitData.yearOfMedicalGraduation =
          parseInt(formData.yearOfMedicalGraduation as string) || 0;
      if (!isEmpty(formData.applyingForJobRole))
        submitData.applyingForJobRole = formData.applyingForJobRole;
      if (!isEmpty(formData.targetMarkets))
        submitData.targetMarkets = formData.targetMarkets;

      // Previous Experiences - only include if there are valid experiences
      if (validPreviousExperiences.length > 0) {
        submitData.previousExperiences = validPreviousExperiences;
      }

      // Academic Experience - only include if not empty and has 5+ words
      if (!shouldExcludeFromAPI(formData.researchExperience, true))
        submitData.researchExperience = formData.researchExperience;
      if (!shouldExcludeFromAPI(formData.teachingExperience, true))
        submitData.teachingExperience = formData.teachingExperience;
      if (!shouldExcludeFromAPI(formData.leadershipManagementExperience, true))
        submitData.leadershipManagementExperience =
          formData.leadershipManagementExperience;
      if (
        !shouldExcludeFromAPI(formData.auditQualityImprovementExperience, true)
      )
        submitData.auditQualityImprovementExperience =
          formData.auditQualityImprovementExperience;
      if (
        !shouldExcludeFromAPI(formData.clinicalSkillsProcedureCompetency, true)
      )
        submitData.clinicalSkillsProcedureCompetency =
          formData.clinicalSkillsProcedureCompetency;

      // Personal Statement - only include if not empty and has 5+ words
      if (!shouldExcludeFromAPI(formData.personalStatement, true))
        submitData.personalStatement = formData.personalStatement;

      // Service Level - only include if not empty
      if (!isEmpty(formData.serviceLevel))
        submitData.serviceLevel = formData.serviceLevel;

      console.log("Submitting CV request:", submitData);

      const response = await api.post("/cv/", submitData);

      console.log("CV submitted successfully:", response.data);
      toast.success("CV request submitted successfully!");

      // Reset form after successful submission
      setFormData(initialFormData);
      setCurrentStep(1);
    } catch (error) {
      console.error("Error submitting CV:", error);
      showError(error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInformation
            data={formData}
            updateData={updateFormData}
            onNext={goToNext}
            onPrevious={goToPrevious}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        );
      case 2:
        return (
          <PreviousExperience
            data={formData}
            updateData={updateFormData}
            onNext={goToNext}
            onPrevious={goToPrevious}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        );
      case 3:
        return (
          <AcademicExperience
            data={formData}
            updateData={updateFormData}
            onNext={goToNext}
            onPrevious={goToPrevious}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        );
      case 4:
        return (
          <PersonalStatement
            data={formData}
            updateData={updateFormData}
            onNext={goToNext}
            onPrevious={goToPrevious}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        );
      case 5:
        return (
          <ServiceLevel
            data={formData}
            updateData={updateFormData}
            onNext={handleSubmit}
            onPrevious={goToPrevious}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        );
      default:
        return null;
    }
  };

  return renderStep();
}
