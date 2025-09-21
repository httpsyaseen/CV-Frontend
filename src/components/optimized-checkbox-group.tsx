"use client";

import { memo, useCallback, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface OptimizedCheckboxGroupProps {
  selectedValues: string[];
  onChange: (value: string, checked: boolean) => void;
  options: Array<{ value: string; label: string }>;
  className?: string;
}

const CheckboxItem = memo(function CheckboxItem({
  option,
  isChecked,
  onChange,
}: {
  option: { value: string; label: string };
  isChecked: boolean;
  onChange: (value: string, checked: boolean) => void;
}) {
  const handleChange = useCallback(
    (checked: boolean | string) => {
      onChange(option.value, checked as boolean);
    },
    [option.value, onChange]
  );

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={option.value}
        checked={isChecked}
        onCheckedChange={handleChange}
      />
      <Label htmlFor={option.value} className="text-sm cursor-pointer">
        {option.label}
      </Label>
    </div>
  );
});

export const OptimizedCheckboxGroup = memo(function OptimizedCheckboxGroup({
  selectedValues,
  onChange,
  options,
  className = "grid grid-cols-1 md:grid-cols-2 gap-3",
}: OptimizedCheckboxGroupProps) {
  // Memoize the selected values set for O(1) lookup
  const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues]);

  return (
    <div className={className}>
      {options.map((option) => (
        <CheckboxItem
          key={option.value}
          option={option}
          isChecked={selectedSet.has(option.value)}
          onChange={onChange}
        />
      ))}
    </div>
  );
});
