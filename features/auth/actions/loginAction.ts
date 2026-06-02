"use server";

import { cookies } from "next/headers";

import axios from "axios";

import { loginSchema, type LoginFormData } from "../types/authSchema";
import type { ActionResponse } from "../types/action";

import { loginUser } from "../api/loginUser";

export async function loginAction(
  formData: LoginFormData,
): Promise<ActionResponse> {
  const validatedFields = loginSchema.safeParse(formData);

  if (!validatedFields.success)
    return {
      status: "error",
      message: "Data yang dikirim tidak valid.",
    };

  try {
    const { email, password } = validatedFields.data;
    const { data } = await loginUser({ email, password });
    if (!data)
      return {
        status: "error",
        message: "Login gagal, token tidak diterima.",
      };

    const { accessToken: token, refreshToken, username, isAdmin, id } = data;
    const cookieStore = await cookies();

    const user = { id, username, isAdmin };

    cookieStore.set("spk.session", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/", // Berlaku di seluruh situs
      maxAge: 60 * 60 * 24 * 7, // Contoh: 7 hari
      // sameSite: 'lax'
    });

    cookieStore.set("spk.access-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/", // Berlaku di seluruh situs
      maxAge: 60 * 60 * 24 * 7, // Contoh: 7 hari
      // sameSite: 'lax'
    });

    if (refreshToken)
      cookieStore.set("spk.refresh-token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // Expire lebih lama
      });

    return {
      status: "success",
      message: "Login berhasil! Mengarahkan ke dashboard...",
    };
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        const nestMessage = error.response.data.message.message;

        // Localize backend error messages to Indonesian
        const localizedMessages: Record<string, string> = {
          "Invalid credentials": "Username atau Password salah",
          "Unauthorized": "Sesi Anda telah habis atau Anda tidak memiliki akses.",
        };

        return {
          status: "error",
          message:
            localizedMessages[nestMessage] ||
            nestMessage ||
            "Sesi Anda telah habis atau Anda tidak memiliki akses.",
        };
      }

      if (error.response?.status && error.response?.status >= 500) {
        return {
          status: "error",
          message: "Terjadi kesalahan pada server. Silakan coba lagi nanti.",
        };
      }
    }

    // Fallback untuk error lain (network error, timeout, atau error non-axios)
    return {
      status: "error",
      message: "Terjadi kesalahan tidak diketahui.",
    };
  }
}
