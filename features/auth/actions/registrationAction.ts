"use server";

import axios from "axios";

import { registerSchema, type RegisterFormData } from "../types/authSchema";
import type { ActionResponse } from "../types/action";

import { registerUser } from "../api/registerUser";

export async function registrationAction(
  formData: RegisterFormData
): Promise<ActionResponse> {
  const validatedFields = registerSchema.safeParse(formData);
  if (!validatedFields.success) {
    return {
      status: "error",
      message: "Data yang dikirim tidak valid.",
    };
  }

  try {
    const { username, email, password } = validatedFields.data;

    await registerUser({ username, email, password });
    // console.log("Mendaftarkan pengguna (server):", { name, email });
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      status: "success",
      message: "Registrasi berhasil! Mengarahkan ke login...",
    };
  } catch (error) {
    // console.error(error);
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data;
      const errorMessage =
        typeof errorData?.message === "string"
          ? errorData.message
          : errorData?.message?.message || "Terjadi kesalahan pada server.";

      if (
        error.response &&
        error.response?.status >= 400 &&
        error.response?.status < 500
      ) {
        const localizedMessages: Record<string, string> = {
          "Email already in use": "Email ini sudah terdaftar.",
        };

        return {
          status: "error",
          message: localizedMessages[errorMessage] || errorMessage,
        };
      }
      if (error.response && error.response?.status >= 500) {
        return {
          status: "error",
          message: "Terjadi kesalahan pada server. Silakan coba lagi nanti.",
        };
      }
    }
    return {
      status: "error",
      message: "Email ini mungkin sudah terdaftar.", // Ganti dengan pesan error asli
    };
  }
}
