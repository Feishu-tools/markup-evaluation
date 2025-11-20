import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { JsonDataItem } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidGradingData(data: any): data is JsonDataItem[] {
  if (!Array.isArray(data)) {
    return false;
  }

  for (const item of data) {
    if (
      typeof item.image_url !== "string" ||
      !Array.isArray(item.questions_info)
    ) {
      return false;
    }

    for (const question of item.questions_info) {
      if (
        typeof question.question_number !== "string" ||
        typeof question.question_type !== "string" ||
        (!Array.isArray(question.answer_steps) && !Array.isArray(question.steps))
      ) {
        return false;
      }
      const steps = question.answer_steps || question.steps;
      if(steps){
        for (const step of steps) {
          if (typeof step.step_id !== "number") {
            return false;
          }
        }
      }
    }
  }

  return true;
}
