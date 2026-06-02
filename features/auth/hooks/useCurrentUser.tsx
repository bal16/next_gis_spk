"use client";

// import axios from "axios";
import bffClient from "@/lib/api/client";
import { useQuery } from "@tanstack/react-query";

export const loadCurrentUser = async () => {
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

    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  return {
    user: data,
    isLoading,
    isError,

    isAuthenticated: isSuccess && data.status !== 401,
  };
};
