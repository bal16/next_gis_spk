"use client";

import { useState, useMemo } from "react";
import { useBuildings } from "@/features/buildings/hooks/useBuildings";
import { PriorityFilter } from "@/types/building";

export const useBuildingFilters = () => {
  const { data: buildings, isLoading, error } = useBuildings();
  const [filter, setFilter] = useState<PriorityFilter>("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBuildings = useMemo(() => {
    if (!buildings) return [];
    return buildings
      .filter((building) => {
        const matchesFilter =
          filter === "Semua" || building.priority === filter;
        const matchesSearch =
          building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          building.code.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => b.score - a.score);
  }, [buildings, filter, searchQuery]);

  return {
    buildings: filteredBuildings, // Hasil akhir
    isLoading,
    error,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
  };
};
