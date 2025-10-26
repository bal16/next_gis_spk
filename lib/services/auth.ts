// import axios from "axios";
import { z } from "zod";
import { LoginFormData, registerSchema } from "../validators/auth";
import { mockUsers } from "@/lib/mock/auth";
import type { User } from "@/types/user";
import axios from "axios";

// Praktik terbaik adalah menyimpan URL API di environment variable
// const API_URL =
//   process.env.NEXT_PUBLIC_API_URL || "https://api.backend-eksternal.com";


// Tipe data untuk registrasi, tanpa confirmPassword
type RegistrationData = Omit<
  z.infer<typeof registerSchema>,
  "confirmPassword"
>;

export const loginUser = async (credentials: LoginFormData) => {
  
  // return axios.post(`${API_URL}/login`, credentials);
  console.log("Mock login with:", credentials);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const user = mockUsers.find(
    (user) =>
      user.email === credentials.email && user.password === credentials.password,
  );

  if (user) {
    return Promise.resolve({
      data: {
        token: `mock-session-token-for-${user.email}`,
        refreshToken: `mock-refresh-token-for-${user.email}`,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      },
    });
  }

  return Promise.reject({
    response: { data: { message: "Email atau password salah." } },
  });
};

export const registerUser = async (data: RegistrationData) => {
  // return axios.post(`${API_URL}/register`, data);
  console.log("Mock register with:", data);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return Promise.resolve({ data: { message: "Registrasi berhasil!" } });
};

export const getCurrentUser = async (token: string) => {
  const response = {data: mockUsers[0]}
  // const response =  await axios.get<User>('https://api.backend-eksternal.com/me', {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  // Penting jika backend Anda mengirim cookie juga
  // withCredentials: true, 
  console.log("Mock current user with:", response.data);
  console.log(  "Authorization:", `Bearer ${token}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return Promise.resolve({ data: { message: "Current User didapatkan!" } });
};



export const loadCurrentUser = async (): Promise<User> => {
  try {
    const { data } = await axios.get('/api/auth/me');
    return data;
  } catch {
    throw new Error('User not authenticated');
  }
};