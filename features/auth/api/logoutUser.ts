import backendClient from "@/lib/api/server";
import "server-only";
import type { LogoutResponse } from "../types/apiResponses";

// import backendClient from '@/lib/api/server';

export const logoutUser = async () => {
  await backendClient.delete<LogoutResponse>("/auth/session");
  // console.log("Mock login with:", credentials);
  // await new Promise((resolve) => setTimeout(resolve, 1000));
};
