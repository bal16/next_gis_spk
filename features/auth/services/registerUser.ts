import "server-only";

// import axios from "axios";
import { z } from "zod";

// import backendClient from '@/lib/api/server';
import { registerSchema } from "../types/authSchema";

// Tipe data untuk registrasi, tanpa confirmPassword
type RegistrationData = Omit<z.infer<typeof registerSchema>, "confirmPassword">;

export const registerUser = async (data: RegistrationData) => {
  // return backendClient.post<RegisterResponse>(`/auth/login`, data, {useToken: false});
  // console.log("Mock register with:", data);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return Promise.resolve({ data: { message: "Registrasi berhasil!" } });
};
