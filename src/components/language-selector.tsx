"use client";

import type * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Language } from "@/lib/languages";

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  languages: Language[];
  placeholder?: string;
  disabled?: boolean;
}

export function LanguageSelector({
  value,
  onChange,
  languages,
  placeholder = "Select a language",
  disabled = false,
}: LanguageSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full min-w-[150px] text-sm md:text-base">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
