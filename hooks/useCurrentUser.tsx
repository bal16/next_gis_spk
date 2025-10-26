"use client";

import { useQuery } from "@tanstack/react-query";
import { loadCurrentUser } from "@/lib/services/auth";

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
