import { APIClient } from "./client";

export const apiClient = new APIClient(
  process.env.EXPO_PUBLIC_API ||
    "https://stepnavilabs-broglow-production.up.railway.app/api"
);
