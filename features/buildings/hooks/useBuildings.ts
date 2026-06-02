"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getBuildingsDatas } from "../api/get-all-buildings";
import { createBuilding } from "../api/create-building";
import { updateBuilding } from "../api/update-building";
import { deleteBuilding } from "../api/delete-building";
import type { TBuilding, TCreateBuilding, TUpdateBuilding } from "../type";

export const useBuildings = () => {
  return useQuery({
    queryKey: ["buildings"],
    queryFn: getBuildingsDatas,
  });
};

export const useAddBuilding = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newBuilding: TCreateBuilding) => createBuilding(newBuilding),
    onMutate: async (newBuilding) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["buildings"] });

      // Snapshot the previous value
      const previousBuildings = queryClient.getQueryData<TBuilding[]>(["buildings"]);

      // Optimistically update to the new value
      if (previousBuildings) {
        queryClient.setQueryData<TBuilding[]>(["buildings"], [
          ...previousBuildings,
          {
            ...newBuilding,
            id: `temp-${Date.now()}`, // Temporary ID
            score: 0,
            priority: "Belum Dihitung",
            criterias: {
              age: 0,
              structure: 0,
              architecture: 0,
              mep: 0,
              utility: 0,
              damage: 0,
              lastMaintenance: null,
            },
          } as TBuilding,
        ]);
      }

      // Return a context object with the snapshotted value
      return { previousBuildings };
    },
    onError: (err, newBuilding, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousBuildings) {
        queryClient.setQueryData(["buildings"], context.previousBuildings);
      }
      toast.error(err.message || "Failed to create building");
    },
    onSuccess: () => {
      toast.success("Gedung baru berhasil ditambahkan.");
      onSuccessCallback?.();
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the correct server state
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
    },
  });
};

export const useUpdateBuilding = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TUpdateBuilding }) =>
      updateBuilding(data, id),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["buildings"] });
      const previousBuildings = queryClient.getQueryData<TBuilding[]>(["buildings"]);

      if (previousBuildings) {
        queryClient.setQueryData<TBuilding[]>(
          ["buildings"],
          previousBuildings.map((building) =>
            building.id === id ? { ...building, ...data } : building
          )
        );
      }
      return { previousBuildings };
    },
    onError: (err, variables, context) => {
      if (context?.previousBuildings) {
        queryClient.setQueryData(["buildings"], context.previousBuildings);
      }
      toast.error(err.message || "Failed to update building");
    },
    onSuccess: () => {
      toast.success("Data gedung berhasil diperbarui.");
      onSuccessCallback?.();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
    },
  });
};

export const useDeleteBuilding = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBuilding(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["buildings"] });
      const previousBuildings = queryClient.getQueryData<TBuilding[]>(["buildings"]);

      if (previousBuildings) {
        queryClient.setQueryData<TBuilding[]>(
          ["buildings"],
          previousBuildings.filter((building) => building.id !== id)
        );
      }
      return { previousBuildings };
    },
    onError: (err, id, context) => {
      if (context?.previousBuildings) {
        queryClient.setQueryData(["buildings"], context.previousBuildings);
      }
      toast.error(err.message || "Failed to delete building");
    },
    onSuccess: () => {
      toast.success("Data gedung berhasil dihapus.");
      onSuccessCallback?.();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
    },
  });
};