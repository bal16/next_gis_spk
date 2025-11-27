import 'server-only'

// import axios from "axios";
import { jwtVerify } from "jose";

import { mockUsers } from "@/lib/mock/auth";
import { getJwtSecretKey } from "@/lib/utils";
// import type { User } from "@/types/user";

export const getCurrentUser = async (token: string) => {
  const { payload } = await jwtVerify(token, getJwtSecretKey());

  const response = { data: mockUsers.find((user) => user.id === payload.id) };
  // const response =  await axios.get<User>('https://api.backend-eksternal.com/me', {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  // Penting jika backend Anda mengirim cookie juga
  // withCredentials: true,
  // console.log("Mock current user with:", response.data);
  // console.log(  "Authorization:", `Bearer ${token}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return Promise.resolve({
    data: { message: "Current User didapatkan!", data: response.data },
  });
};
