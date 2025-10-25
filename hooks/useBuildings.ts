"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getBuildings,
  addBuilding,
  updateBuilding,
  deleteBuilding,
} from "@/api/buildings";
import { BuildingFormData } from "@/lib/validators/building";
import { toast } from "sonner";

export const useBuildings = () => {
  return useQuery({
    queryKey: ["buildings"],
    queryFn: getBuildings,
  });
};

export const useAddBuilding = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newBuilding: BuildingFormData) => addBuilding(newBuilding),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
      toast.success("Gedung baru berhasil ditambahkan.");
      onSuccessCallback?.();
    },
    onError: (error) => {
      toast.error(`Gagal menambahkan gedung: ${error.message}`);
    },
  });
};

export const useUpdateBuilding = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BuildingFormData }) =>
      updateBuilding(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
      queryClient.invalidateQueries({ queryKey: ["building", variables.id] });
      toast.success("Data gedung berhasil diperbarui.");
      onSuccessCallback?.();
    },
    onError: (error) => {
      toast.error(`Gagal memperbarui data: ${error.message}`);
    },
  });
};

// Hook untuk delete bisa ditambahkan di sini jika diperlukan
export const useDeleteBuilding = (onSuccessCallback?: () => void) => { 
    const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ( {id }: { id: number}) =>
      deleteBuilding(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
      queryClient.invalidateQueries({ queryKey: ["building", variables.id] });
      toast.success("Data gedung berhasil dihapus.");
      onSuccessCallback?.();
    },
    onError: (error) => {
      toast.error(`Gagal menghapus data: ${error.message}`);
    },
  });
 };