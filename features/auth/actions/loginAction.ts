"use server";

import { cookies } from "next/headers";

import axios from "axios";

import { loginSchema, type LoginFormData } from "../types/authSchema";
import type { ActionResponse } from "../types/action";

import { loginUser } from "../services/loginUser";

export async function loginAction(
  formData: LoginFormData
): Promise<ActionResponse> {
  const validatedFields = loginSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      status: "error",
      message: "Data yang dikirim tidak valid.",
    };
  }

  try {
    const { email, password } = validatedFields.data;
    const { data } = await loginUser({ email, password });
    if (!data) {
      return {
        status: "error",
        message: "Login gagal, token tidak diterima.",
      };
    }

    const { token, refreshToken } = data;

    (await cookies()).set("session-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Hanya HTTPS di produksi
      path: "/", // Berlaku di seluruh situs
      maxAge: 60 * 60 * 24 * 7, // Contoh: 7 hari
      // sameSite: 'lax' // Direkomendasikan
    });

    if (refreshToken) {
      (await cookies()).set("refresh-token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // Expire lebih lama
      });
    }

    return {
      status: "success",
      message: "Login berhasil! Mengarahkan ke dashboard...",
    };
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      return {
        status: "error",
        message: "Terjadi kesalahan server.",
      };
    }
    return {
      status: "error",
      message: "Terjadi kesalahan tidak diketahui.",
    };
  }
}
