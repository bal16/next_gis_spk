"use client";

// import axios from "axios";
import bffClient from "@/lib/api/client";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@/features/auth/types/user";

export const loadCurrentUser = async (): Promise<User> => {
  try {
    const { data } = await bffClient.get("/auth/me");
    return data;
  } catch {
    throw new Error("User not authenticated");
  }
};

export const useCurrentUser = () => {
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["currentUser"],
    queryFn: loadCurrentUser,

    retry: false, // Jangan coba lagi jika gagal (401 adalah gagal permanen)
    refetchOnWindowFocus: false, // Tidak perlu re-fetch setiap kali user ganti tab
    staleTime: 1000 * 60 * 5, // Anggap data user "fresh" selama 5 menit
  });

  return {
    user: data, // Akan berisi data User atau undefined
    isLoading, // 'true' saat pertama kali loading
    isError, // 'true' jika /api/auth/me mengembalikan 401 atau error lain

    isAuthenticated: isSuccess && !!data,
  };
};
