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
    const { name, email, password } = validatedFields.data;

    await registerUser({ name, email, password });
    // console.log("Mendaftarkan pengguna (server):", { name, email });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      status: "success",
      message: "Registrasi berhasil! Mengarahkan ke login...",
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
      message: "Email ini mungkin sudah terdaftar.", // Ganti dengan pesan error asli
    };
  }
}
