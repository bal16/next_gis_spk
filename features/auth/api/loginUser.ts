import "server-only";

import type { LoginFormData } from "../types/authSchema";
import { publicClient } from "@/lib/api/public";
import type { LoginResponse } from "../types/apiResponses";

export const loginUser = async (credentials: LoginFormData) => {
  const { data } = await publicClient.post<LoginResponse>(
    `/auth/login`,
    credentials
  );

  return data;
};
