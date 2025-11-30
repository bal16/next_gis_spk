import type { SuccessResponse } from "@/types/apiResponse";

export interface LoginData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  role: string;
}

export interface RegistrationData {
  id: string;
  email: string;
}

export interface RefreshData {
  accessToken: string;
  refreshToken: string;
}

export type LoginResponse = SuccessResponse<LoginData>;
export type RegistrationResponse = SuccessResponse<RegistrationData>;
export type RefreshResponse = SuccessResponse<RefreshData>;
export type LogoutResponse = SuccessResponse<null>;
