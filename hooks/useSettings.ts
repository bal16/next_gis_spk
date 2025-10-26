"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getWeights, updateWeights } from "@/lib/services/settings";
import { toast } from "sonner";
import type { Weights } from "@/types/weights";

export const useWeights = () => {
  return useQuery<Weights, Error>({
    queryKey: ["weights"],
    queryFn: getWeights,
  });
};

export const useUpdateWeights = () => {
  const queryClient = useQueryClient();

  return useMutation<Weights, Error, Weights>({
    mutationFn: updateWeights,
    onSuccess: (data) => {
      queryClient.setQueryData(["weights"], data);
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
      toast.success("Bobot Disimpan & Kalkulasi Selesai", {
        description: "Bobot baru telah disimpan dan prioritas dihitung ulang.",
      });
    },
    onError: (error) => {
      toast.error("Gagal menyimpan bobot", { description: error.message });
    },
  });
};