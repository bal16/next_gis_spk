import "server-only";

// import type { JWTPayload } from "jose";

// import { mockUsers } from "@/lib/mock/auth";
import type { LoginFormData } from "../types/authSchema";
import { publicClient } from "@/lib/api/public";
import type { LoginResponse } from "../types/apiResponses";

export const loginUser = async (credentials: LoginFormData) => {
  const { data } = await publicClient.post<LoginResponse>(
    `/auth/login`,
    credentials
  );

  console.log("Login response:", data);

  return data;
  // console.log("Mock login with:", credentials);
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  // const user = mockUsers.find(
  //   (user) =>
  //     user.email === credentials.email && user.password === credentials.password
  // );

  // const token = await signJwt(user as JWTPayload);

  // if (user) {
  //   return Promise.resolve({
  //     data: {
  //       token,
  //       refreshToken: `mock-refresh-token-for-${user.email}`,
  //       user: {
  //         id: user.id,
  //         name: user.name,
  //         email: user.email,
  //         role: user.role,
  //       },
  //     },
  //   });
  // }

  // return Promise.reject({
  //   response: { data: { message: "Email atau password salah." } },
  // });
};
