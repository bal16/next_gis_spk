import backendClient from "@/lib/api/server";
import "server-only";
import type { LogoutResponse } from "../types/apiResponses";

export const logoutUser = async () => {
  await backendClient.delete<LogoutResponse>("/auth/session");
};
