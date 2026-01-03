import { useQuery } from "@tanstack/react-query";
import { getBuildings } from "../actions/get-buildings";
import { useMapStore } from "@/features/map/store/useMap";
import { useSelectedBuildingStore } from "@/features/home/store/useSelectedBuilding";
import { useFilterStore } from "../store/useFilter";
import { useSearchStore } from "../store/useSearch";
import { useMemo } from "react";
import type { TBuilding } from "@/types/building";

export const useFilteredBuildings = () => {
  const { data: buildings } = useQuery({
    queryKey: ["buildings"],
    queryFn: getBuildings,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  const flyToBuilding = useMapStore((state) => state.flyToBuilding);
  const setSelectedBuilding = useSelectedBuildingStore(
    (state) => state.setSelectedBuilding
  );
  const filter = useFilterStore((state) => state.filter);
  const searchQuery = useSearchStore((state) => state.query);

  const filteredBuildings = useMemo(() => {
    if (!buildings) return [];
    const filteredBuildings = buildings
      .filter((building) => {
        const matchesFilter =
          filter === "Semua" || building.priority === filter;
        const matchesSearch =
          building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          building.code.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => b.score - a.score);

    if (filteredBuildings.length === 1) flyToBuilding(filteredBuildings[0]);

    return filteredBuildings;
  }, [buildings, filter, searchQuery, flyToBuilding]);

  const handleBuildingClick = (building: TBuilding) => {
    flyToBuilding(building);
    setSelectedBuilding(building);
  };

  return {
    filteredBuildings,
    handleBuildingClick,
  };
};
