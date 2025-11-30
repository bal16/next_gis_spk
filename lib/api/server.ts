// libs/api/server.ts
import "server-only"; // <--- WAJIB: Agar tidak bocor ke client

import axios from "axios";
import { cookies } from "next/headers";

import type { RefreshResponse } from "@/features/auth/types/apiResponses";

// Definisikan tipe tambahan agar TypeScript tidak merah
declare module "axios" {
  export interface AxiosRequestConfig {
    useToken?: boolean;
    _retry?: boolean;
  }
}

const backendClient = axios.create({
  baseURL: process.env.NEST_API_URL,
  headers: { "Content-Type": "application/json" },
});

// =================================================================
// REQUEST INTERCEPTOR
// =================================================================
backendClient.interceptors.request.use(async (config) => {
  const useToken = config.useToken ?? true;

  if (useToken) {
    const cookieStore = await cookies();
    const tokenValue = cookieStore.get("session-token")?.value;

    if (tokenValue) {
      config.headers.Authorization = `Bearer ${tokenValue}`;
    }
  }
  return config;
});

// =================================================================
// RESPONSE INTERCEPTOR
// =================================================================
backendClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refresh-token")?.value;

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const refreshResponse = await backendClient.post<RefreshResponse>(
          "/auth/refresh",
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        const { accessToken, refreshToken: newRefreshToken } =
          refreshResponse.data.data;

        cookieStore.set("session-token", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          sameSite: "lax",
        });

        // Update refresh token jika ada rotasi
        if (newRefreshToken) {
          cookieStore.set("refresh-token", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
          });
        }

        // Update header request lama dengan token BARU
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Ulangi request
        return backendClient(originalRequest);
      } catch (refreshError) {
        // Logout user jika gagal total
        const cookieStore = await cookies();

        // Hapus dengan nama yang konsisten
        cookieStore.delete("session-token");
        cookieStore.delete("refresh-token");

        // Opsional: Hapus session-token jika kamu pernah pakai nama itu sebelumnya
        // cookieStore.delete("session-token");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default backendClient;
