import "server-only";

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
  timeout: 5000,
});

// =================================================================
// REQUEST INTERCEPTOR
// =================================================================
backendClient.interceptors.request.use(async (config) => {
  const useToken = config.useToken ?? true;

  if (useToken) {
    const cookieStore = await cookies();
    const tokenValue = cookieStore.get("spk.access-token")?.value;

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
        const refreshToken = cookieStore.get("spk.refresh-token")?.value;

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Use raw axios to prevent request interceptor from overriding the Auth header
        const refreshResponse = await axios.post<RefreshResponse>(
          `${process.env.NEST_API_URL}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        );

        const { accessToken, refreshToken: newRefreshToken } =
          refreshResponse.data.data;

        cookieStore.set("spk.access-token", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
        });

        // Update refresh token jika ada rotasi
        if (newRefreshToken) {
          cookieStore.set("spk.refresh-token", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 30,
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
        cookieStore.delete("spk.access-token");
        cookieStore.delete("spk.refresh-token");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default backendClient;
