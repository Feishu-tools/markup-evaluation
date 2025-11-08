import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { GradingData } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidGradingData(data: any): data is GradingData {
  if (typeof data !== 'object' || data === null || !Array.isArray(data.grading_report)) {
    return false;
  }

  for (const item of data.grading_report) {
    if (
      typeof item.question_number !== 'string' ||
      (item.question_type !== 'objective' && item.question_type !== 'subjective') ||
      typeof item.is_correct !== 'boolean'
    ) {
      return false;
    }
  }

  return true;
}
