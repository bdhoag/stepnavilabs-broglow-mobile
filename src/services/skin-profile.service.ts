import { APIResponse } from "@/src/data/types";
import { apiClient } from "../lib/instance";

// ==============================
// Types
// ==============================

export type QuestionType = "SINGLE_CHOICE" | "MULTIPLE_CHOICE";

export interface Option {
  _id: string;
  value: string;
  label: string;
  description: string;
}

export interface SkinProfileQuestion {
  _id: string;
  question: string;
  description: string;
  type: QuestionType;
  options: Option[];
  order: number;
  isActive: boolean;
  isRequired: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface FetchQuestionsResponse {
  data: SkinProfileQuestion[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ==============================
// API: Fetch Questions
// ==============================

export async function fetchSkinProfileQuestions(): Promise<
  SkinProfileQuestion[]
> {
  const response: APIResponse<FetchQuestionsResponse> = await apiClient.get(
    "/skin-profile/questions"
  );

  const allQuestions = response.data.data;

  // Chỉ giữ lại SINGLE_CHOICE và MULTIPLE_CHOICE
  const filteredQuestions = allQuestions.filter(
    (q) => q.type === "SINGLE_CHOICE" || q.type === "MULTIPLE_CHOICE"
  );

  return filteredQuestions;
}

// ==============================
// API: Submit Answers
// ==============================

export interface SkinProfileAnswer {
  questionId: string;
  answer: string | string[];
}

export async function submitSkinProfileAnswers(
  answers: SkinProfileAnswer[]
): Promise<void> {
  await apiClient.post("/skin-profile", { answers });
}
