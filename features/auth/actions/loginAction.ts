"use server";

import { cookies } from "next/headers";

import axios from "axios";

import { loginSchema, type LoginFormData } from "../types/authSchema";
import type { ActionResponse } from "../types/action";

import { loginUser } from "../api/loginUser";

export async function loginAction(
  formData: LoginFormData
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

    const { token, refreshToken, user } = data;
    const cookieStore = await cookies();

    cookieStore.set("session", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/", // Berlaku di seluruh situs
      maxAge: 60 * 60 * 24 * 7, // Contoh: 7 hari
      // sameSite: 'lax'
    });

    cookieStore.set("access-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/", // Berlaku di seluruh situs
      maxAge: 60 * 60 * 24 * 7, // Contoh: 7 hari
      // sameSite: 'lax'
    });

    if (refreshToken)
      cookieStore.set("refresh-token", refreshToken, {
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
