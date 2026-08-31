import "server-only";

import backendClient from "@/lib/api/server";

export const getCurrentUser = async () => {
  const response = await backendClient.get("/auth/me", {
    headers: { "Cache-Control": "no-store" },
  } as never);
  if (process.env.NODE_ENV !== "production") {
    console.log("Get current user response:", response.data);
  }
  // Penting jika backend Anda mengirim cookie juga
  // withCredentials: true,
  // console.log("Mock current user with:", response.data);
  // console.log(  "Authorization:", `Bearer ${token}`);
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  // return Promise.resolve({
  //   message: "Current User didapatkan!",
  //   data: response.data,
  // });
  return response.data;
};
