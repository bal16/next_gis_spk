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
    const { username, email, password, invitationToken } = validatedFields.data;

    await registerUser({ username, email, password, invitationToken });

    return {
      status: "success",
      message: "Registrasi berhasil! Mengarahkan ke login...",
    };
  } catch (error) {
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
          "Invalid or expired invitation token":
            "Token undangan tidak valid atau sudah kedaluwarsa.",
          "Invalid invitation token": "Token undangan tidak valid.",
          "Invitation token expired": "Token undangan sudah kedaluwarsa.",
          "Invitation token already used":
            "Token undangan sudah pernah digunakan.",
          "Invitation token not found":
            "Token undangan tidak ditemukan atau tidak valid.",
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
      message: "Registrasi gagal. Pastikan token dan data yang diisi benar.",
    };
  }
}
