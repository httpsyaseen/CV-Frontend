"use client";

import { FormStep } from "@/components/form-step";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { VirtualizedYearSelect } from "@/components/virtualized-year-select";
import { OptimizedCheckboxGroup } from "@/components/optimized-checkbox-group";
import { useMemo, useCallback } from "react";
import type { FormData } from "../page";

interface BasicInformationProps {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export function BasicInformation({
  data,
  updateData,
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
}: BasicInformationProps) {
  // Memoize target markets to prevent recreation on each render
  const targetMarketOptions = useMemo(
    () => [
      { value: "uk", label: "UK (England & Wales, Scotland, NI)" },
      { value: "republicOfIreland", label: "Republic of Ireland" },
      { value: "europe", label: "Europe" },
      { value: "america", label: "America" },
      { value: "gcc", label: "GCC (UAE, KSA, Qatar, Oman, etc.)" },
      { value: "others", label: "Others" },
    ],
    []
  );

  const canGoNext = useMemo(() => data.lastName.trim() !== "", [data.lastName]);

  // Memoized handlers for better performance
  const handleTargetMarketChange = useCallback(
    (market: string, checked: boolean) => {
      if (checked) {
        updateData({ targetMarkets: [...data.targetMarkets, market] });
      } else {
        updateData({
          targetMarkets: data.targetMarkets.filter((m) => m !== market),
        });
      }
    },
    [data.targetMarkets, updateData]
  );

  const handleYearOfBirthChange = useCallback(
    (value: string) => {
      updateData({ yearOfBirth: value });
    },
    [updateData]
  );

  const handleMedicalGraduationChange = useCallback(
    (value: string) => {
      updateData({ yearOfMedicalGraduation: value });
    },
    [updateData]
  );

  return (
    <FormStep
      title="Basic Information"
      description="Please provide your last name (required). All other fields are optional but help us serve you better."
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={onNext}
      onPrevious={onPrevious}
      canGoNext={canGoNext}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={data.firstName}
            onChange={(e) => {
              const value = e.target.value
                .replace(/[^a-zA-Z]/g, "")
                .slice(0, 60);
              updateData({ firstName: value });
            }}
            placeholder="Enter your first name (optional)"
            maxLength={60}
            className="bg-white"
          />
          <p className="text-xs text-gray-500">
            Alphabets only, max 60 characters
          </p>
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={data.lastName}
            onChange={(e) => {
              const value = e.target.value
                .replace(/[^a-zA-Z]/g, "")
                .slice(0, 15);
              updateData({ lastName: value });
            }}
            placeholder="Enter your last name"
            maxLength={15}
            className="bg-white"
            required
          />
          <p className="text-xs text-gray-500">
            Alphabets only, max 15 characters
          </p>
        </div>

        {/* Year of Birth */}
        <div className="space-y-2">
          <Label htmlFor="yearOfBirth">Year of Birth</Label>
          <VirtualizedYearSelect
            value={data.yearOfBirth as string}
            onValueChange={handleYearOfBirthChange}
            placeholder="Select year (optional)"
            className="bg-white"
          />
        </div>

        {/* Year of Medical Graduation */}
        <div className="space-y-2">
          <Label htmlFor="yearOfMedicalGraduation">
            Year of Medical Graduation
          </Label>
          <VirtualizedYearSelect
            value={data.yearOfMedicalGraduation as string}
            onValueChange={handleMedicalGraduationChange}
            placeholder="Select year (optional)"
            className="bg-white"
          />
        </div>
      </div>

      {/* Job Role */}
      <div className="space-y-4">
        <Label>Applying for Job Role</Label>
        <RadioGroup
          value={data.applyingForJobRole}
          onValueChange={(value: string) =>
            updateData({ applyingForJobRole: value })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="tier1" id="tier1" />
            <Label htmlFor="tier1">
              Tier 1 (SHO, CT/ST1–2, FY2, JCF, CF, etc.)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="middleGrade" id="middle" />
            <Label htmlFor="middleGrade">
              Middle Grade (Registrar, SpR, SCF, CF, etc.)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="consultant" id="consultant" />
            <Label htmlFor="consultant">Consultant</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Target Markets */}
      <div className="space-y-4">
        <Label>Target Market (multiple selections allowed)</Label>
        <OptimizedCheckboxGroup
          selectedValues={data.targetMarkets}
          onChange={handleTargetMarketChange}
          options={targetMarketOptions}
        />
      </div>
    </FormStep>
  );
}
