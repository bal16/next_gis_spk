"use server";

import { cookies } from "next/headers";
import axios from "axios";

import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "../types/authSchema";
import type { ActionResponse } from "../types/action";
import { changePassword } from "../api/changePassword";

export async function changePasswordAction(
  formData: ChangePasswordFormData
): Promise<ActionResponse<{ redirectUrl: string }>> {
  const validatedFields = changePasswordSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      status: "error",
      message: "Data input ganti password tidak valid.",
    };
  }

  try {
    const { currentPassword, newPassword } = validatedFields.data;

    await changePassword({ currentPassword, newPassword });

    // Update local session cookie so user no longer has mustChangePassword: true
    const cookieStore = await cookies();
    const sessionRaw = cookieStore.get("spk.session")?.value;

    let redirectUrl = "/admin";
    if (sessionRaw) {
      try {
        const sessionUser = JSON.parse(sessionRaw);
        sessionUser.mustChangePassword = false;
        cookieStore.set("spk.session", JSON.stringify(sessionUser), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
          sameSite: "lax",
        });

        redirectUrl = sessionUser.isAdmin ? "/admin" : "/";
      } catch (err) {
        console.error("Failed to parse/update session cookie", err);
      }
    }

    return {
      status: "success",
      message: "Password berhasil diubah. Mengarahkan...",
      data: { redirectUrl },
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data;
      const errorMessage =
        typeof errorData?.message === "string"
          ? errorData.message
          : errorData?.message?.message || "Gagal mengubah password.";

      const localizedMessages: Record<string, string> = {
        "Invalid current password": "Password saat ini salah.",
        "Current password does not match": "Password saat ini salah.",
        "Unauthorized": "Sesi tidak valid. Silakan login kembali.",
      };

      return {
        status: "error",
        message: localizedMessages[errorMessage] || errorMessage,
      };
    }

    return {
      status: "error",
      message: "Terjadi kesalahan saat memproses perubahan password.",
    };
  }
}
