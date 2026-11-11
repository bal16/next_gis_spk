import "server-only";

import backendClient from "@/lib/api/server";
import type { SuccessResponse } from "@/types/apiResponse";

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const changePassword = async (payload: ChangePasswordPayload) => {
  const { data } = await backendClient.post<
    SuccessResponse<{ message?: string }>
  >("/auth/change-password", payload);
  return data;
};
