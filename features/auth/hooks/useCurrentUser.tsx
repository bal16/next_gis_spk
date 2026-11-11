"use client";

import bffClient from "@/lib/api/client";
import { useQuery } from "@tanstack/react-query";
import type { User } from "../types/user";

type AuthMeResponse = {
  data?: User;
} & Partial<User>;

export const loadCurrentUser = async (): Promise<User> => {
  try {
    const { data } = await bffClient.get<AuthMeResponse>("/auth/me");
    const user = data?.data ?? data;

    if (!user || !user.id) {
      throw new Error("User not authenticated");
    }

    return {
      id: user.id,
      name: user.name ?? "",
      email: user.email ?? "",
      avatarUrl: user.avatarUrl,
      isAdmin: Boolean(user.isAdmin),
      mustChangePassword: Boolean(user.mustChangePassword),
    };
  } catch {
    throw new Error("User not authenticated");
  }
};

export const useCurrentUser = () => {
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["currentUser"],
    queryFn: loadCurrentUser,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  return {
    user: data,
    isLoading,
    isError,
    isAuthenticated: isSuccess && Boolean(data?.id),
  };
};
