"use client";

import { FormStep } from "@/components/form-step";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Star } from "lucide-react";
import type { FormData } from "../page";

interface ServiceLevelProps {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export function ServiceLevel({
  data,
  updateData,
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
}: ServiceLevelProps) {
  const canGoNext = data.serviceLevel !== "";

  return (
    <FormStep
      title="Service Level Selection"
      description="Choose the level of review service that best meets your needs"
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={onNext}
      onPrevious={onPrevious}
      canGoNext={canGoNext}
      isLastStep={true}
    >
      <div className="space-y-6">
        <RadioGroup
          value={data.serviceLevel}
          onValueChange={(value) => updateData({ serviceLevel: value })}
          className="space-y-4"
        >
          {/* Standard Review */}
          <Card
            className={`cursor-pointer transition-all ${
              data.serviceLevel === "standard"
                ? "ring-2 ring-emerald-500 bg-emerald-50"
                : "hover:shadow-md"
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="standard" id="standard" />
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-600" />
                    Standard Review
                  </CardTitle>
                  <CardDescription>
                    Comprehensive feedback and suggestions
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-600">£99</div>
                  <div className="text-sm text-gray-500">24-48 hours</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Detailed feedback on content and structure
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Suggestions for improvement
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Grammar and language review
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Professional formatting recommendations
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Premium Review */}
          <Card
            className={`cursor-pointer transition-all ${
              data.serviceLevel === "premium"
                ? "ring-2 ring-emerald-500 bg-emerald-50"
                : "hover:shadow-md"
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="premium" id="premium" />
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500" />
                    Premium Review
                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                      Most Popular
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Standard review plus professional rewriting service
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-600">
                    £199
                  </div>
                  <div className="text-sm text-gray-500">48-72 hours</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Everything in Standard Review
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Professional rewriting and optimization
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Enhanced content development
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Industry-specific customization
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  One round of revisions included
                </li>
              </ul>
            </CardContent>
          </Card>
        </RadioGroup>

        {data.serviceLevel && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-2">Ready to Submit</h3>
            <p className="text-sm text-green-800">
              You&apos;ve selected the{" "}
              <strong>
                {data.serviceLevel === "standard" ? "Standard" : "Premium"}{" "}
                Review
              </strong>{" "}
              service. Click Submit to proceed with your CV review request.
            </p>
          </div>
        )}
      </div>
    </FormStep>
  );
}
