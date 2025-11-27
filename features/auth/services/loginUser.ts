import 'server-only'

import { SignJWT } from "jose";

import { mockUsers } from "@/lib/mock/auth";
import { getJwtSecretKey } from "@/lib/utils";
import type { LoginFormData } from "../types/authSchema";

export const loginUser = async (credentials: LoginFormData) => {
  // return axios.post(`${API_URL}/login`, credentials);
  // console.log("Mock login with:", credentials);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const user = mockUsers.find(
    (user) =>
      user.email === credentials.email && user.password === credentials.password
  );

  const token = await new SignJWT(user) // 'user' adalah payload Anda
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d") // Atur expired
    .sign(getJwtSecretKey()); // Tanda tangani dengan secret yang sama

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