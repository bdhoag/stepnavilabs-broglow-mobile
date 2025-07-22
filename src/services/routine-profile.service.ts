import { APIResponse } from "@/src/data/types";
import { apiClient } from "../lib/instance";

// ==============================
// Types
// ==============================

export type RoutineQuestionType = "SINGLE_CHOICE" | "MULTIPLE_CHOICE";

export interface RoutineOption {
  _id: string;
  value: string;
  label: string;
  description: string;
}

export interface RoutineProfileQuestion {
  _id: string;
  question: string;
  description: string;
  type: RoutineQuestionType;
  options: RoutineOption[];
  order: number;
  isActive: boolean;
  isRequired: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface FetchRoutineQuestionsResponse {
  data: RoutineProfileQuestion[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ==============================
// API: Fetch Routine Questions
// ==============================

export async function fetchRoutineProfileQuestions(): Promise<
  RoutineProfileQuestion[]
> {
  const response: APIResponse<FetchRoutineQuestionsResponse> =
    await apiClient.get("/routine-questions");

  const allQuestions = response.data.data;

  // Chỉ lấy SINGLE_CHOICE và MULTIPLE_CHOICE
  const filteredQuestions = allQuestions.filter(
    (q) => q.type === "SINGLE_CHOICE" || q.type === "MULTIPLE_CHOICE"
  );

  return filteredQuestions;
}

// ==============================
// API: Submit Routine Answers
// ==============================

export interface RoutineProfileAnswer {
  questionId: string;
  answers: string | string[];
}

export async function submitRoutineProfileAnswers(
  answers: RoutineProfileAnswer[]
): Promise<void> {
  await apiClient.post("/routine-questions/suggestions", { answers });
}
