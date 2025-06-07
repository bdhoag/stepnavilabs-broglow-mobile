import { APIClient } from "./client";

export const apiClient = new APIClient(
  process.env.EXPO_PUBLIC_API || "http://localhost:3001/api"
);
