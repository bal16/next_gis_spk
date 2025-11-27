"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import axios from "axios";

import {
  loginSchema,
  registerSchema,
  type LoginFormData,
  type RegisterFormData,
} from "@/features/auth/types/authSchema";

import { loginUser } from "../services/loginUser";
import { registerUser } from "@/features/auth/services/registerUser";

export async function loginAction(formData: LoginFormData) {
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

type ActionResponse = {
  status: "success" | "error";
  message: string;
};

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

export async function logoutAction() {
  (await cookies()).delete("session-token");
  (await cookies()).delete("refresh-token");
  // toast.success("Logout berhasil!");

  revalidatePath("/"); // Opsional: bersihkan cache jika perlu
  redirect("/auth?message=logout-success");
}
