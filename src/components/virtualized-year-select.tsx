"use client";

import { useMemo, useState, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VirtualizedYearSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  className?: string;
}

export function VirtualizedYearSelect({
  value,
  onValueChange,
  placeholder,
  className,
}: VirtualizedYearSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Memoize years calculation to prevent recalculation
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from(
      { length: currentYear - 1900 + 1 },
      (_, i) => currentYear - i
    );
  }, []);

  // Filter years based on search term for better performance
  const filteredYears = useMemo(() => {
    if (!searchTerm) {
      // Show recent years first (last 50 years) and then older ones
      const recentYears = years.slice(0, 50);
      const olderYears = years.slice(50);
      return { recent: recentYears, older: olderYears };
    }

    const filtered = years.filter((year) =>
      year.toString().includes(searchTerm)
    );
    return { recent: filtered.slice(0, 20), older: filtered.slice(20, 40) };
  }, [years, searchTerm]);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setSearchTerm("");
    }
  }, []);

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      onOpenChange={handleOpenChange}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        <div className="sticky top-0 bg-white border-b p-2 mb-2 z-10">
          <input
            type="text"
            placeholder="Type to search year..."
            className="w-full px-2 py-1 text-sm border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <div className="max-h-[250px] overflow-y-auto">
          {/* Recent/Filtered Years */}
          {filteredYears.recent.map((year) => (
            <SelectItem key={`recent-${year}`} value={year.toString()}>
              {year}
            </SelectItem>
          ))}

          {/* Separator if showing older years */}
          {!searchTerm && filteredYears.older.length > 0 && (
            <div className="text-center py-1 text-xs text-gray-400 border-t border-b bg-gray-50">
              Older Years
            </div>
          )}

          {/* Older Years */}
          {filteredYears.older.map((year) => (
            <SelectItem key={`older-${year}`} value={year.toString()}>
              {year}
            </SelectItem>
          ))}

          {/* No results message */}
          {filteredYears.recent.length === 0 &&
            filteredYears.older.length === 0 && (
              <div className="text-center py-4 text-sm text-gray-500">
                No years found
              </div>
            )}
        </div>
      </SelectContent>
    </Select>
  );
}
