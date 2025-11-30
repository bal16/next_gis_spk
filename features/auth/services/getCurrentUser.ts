import "server-only";

import { cookies } from "next/headers";

// import axios from "axios";
import { mockUsers } from "@/lib/mock/auth";
import { verifyJwt } from "@/lib/jwt";
// import backendClient from "@/lib/api/server";
// import type { User } from "../types/user";

export const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("session-token")?.value;

  if (!token) {
    throw new Error("No token found");
  }

  const { payload } = await verifyJwt(token);

  const response = {
    data: mockUsers.find((user) => user.id === Number(payload.sub)),
  };
  // const response = await backendClient.get<User>("/auth/me");
  // Penting jika backend Anda mengirim cookie juga
  // withCredentials: true,
  // console.log("Mock current user with:", response.data);
  // console.log(  "Authorization:", `Bearer ${token}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return Promise.resolve({
    data: { message: "Current User didapatkan!", data: response.data },
  });
  // return response.data;
};
