import "server-only";

import backendClient from "@/lib/api/server";
import type { SuccessResponse } from "@/types/apiResponse";
import type { User } from "../types/user";

export const getCurrentUser = async (): Promise<SuccessResponse<User>> => {
  const response = await backendClient.get<SuccessResponse<User>>("/auth/me", {
    headers: { "Cache-Control": "no-store" },
  } as never);

  return response.data;
};
