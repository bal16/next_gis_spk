import "server-only";

import type { JWTPayload } from "jose";

import { mockUsers } from "@/lib/mock/auth";
// import backendClient from '@/lib/api/server';
import type { LoginFormData } from "../types/authSchema";
import { signJwt } from "@/lib/jwt";

export const loginUser = async (credentials: LoginFormData) => {
  // return backendClient.post<LoginResponse>(`/auth/login`, credentials, {useToken: false});
  // console.log("Mock login with:", credentials);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const user = mockUsers.find(
    (user) =>
      user.email === credentials.email && user.password === credentials.password
  );

  const token = await signJwt(user as JWTPayload);

  if (user) {
    return Promise.resolve({
      data: {
        token,
        refreshToken: `mock-refresh-token-for-${user.email}`,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  }

  return Promise.reject({
    response: { data: { message: "Email atau password salah." } },
  });
};
