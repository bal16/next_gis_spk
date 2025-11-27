import 'server-only'

// import axios from "axios";
import { z } from "zod";

import { registerSchema } from "../types/authSchema";

// Praktik terbaik adalah menyimpan URL API di environment variable
// const API_URL =
//   process.env.NEXT_PUBLIC_API_URL || "https://api.backend-eksternal.com";

// Tipe data untuk registrasi, tanpa confirmPassword
type RegistrationData = Omit<z.infer<typeof registerSchema>, "confirmPassword">;

export const registerUser = async (data: RegistrationData) => {
  // return axios.post(`${API_URL}/register`, data);
  // console.log("Mock register with:", data);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return Promise.resolve({ data: { message: "Registrasi berhasil!" } });
};


