// import "server-only";

// import axios from "axios";
import { z } from "zod";

// import backendClient from '@/lib/api/server';
import { registerSchema } from "../types/authSchema";
import { publicClient } from "@/lib/api/public";

// Tipe data untuk registrasi, tanpa confirmPassword
type RegistrationData = Omit<z.infer<typeof registerSchema>, "confirmPassword">;

export const registerUser = async (data: RegistrationData) => {
  // console.log("Registering user with data:", data);
  await publicClient.post("/auth/register", data);

  return {
    status: "success",
    message: "Registrasi berhasil! Mengarahkan ke login...",
  };
  // console.log("Mock register with:", data);
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  // return Promise.resolve({
  //   statusCode: 201,
  //   success: true,
  //   message: "Registration successfull",
  //   data: { id: "", email: "" },
  // });
};
