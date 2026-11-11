// import "server-only";

// import axios from "axios";
import { z } from "zod";

// import backendClient from '@/lib/api/server';
import { registerSchema } from "../types/authSchema";
import { publicClient } from "@/lib/api/public";

// Tipe data untuk registrasi, tanpa confirmPassword
type RegistrationData = Omit<z.infer<typeof registerSchema>, "confirmPassword">;

export const registerUser = async (data: RegistrationData) => {
  // Support both token and invitationToken keys for compatibility with backend DTO
  const payload = {
    username: data.username,
    email: data.email,
    password: data.password,
    token: data.invitationToken,
    invitationToken: data.invitationToken,
  };

  await publicClient.post("/auth/register", payload);

  return {
    status: "success",
    message: "Registrasi berhasil! Mengarahkan ke login...",
  };
};
