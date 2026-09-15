import { useQuery } from "@tanstack/react-query";
import { getBuildingsDatas } from "../../buildings/api/get-all-buildings";
import { useMapStore } from "@/features/map/store/useMap";
import { useSelectedBuildingStore } from "@/features/home/store/useSelectedBuilding";
import { useFilterStore } from "../store/useFilter";
import { useSearchStore } from "../store/useSearch";
import { useEffect, useMemo } from "react";
import type { TBuilding } from "@/features/buildings/type";
import { useDebounce } from "@/hooks/useDebounce";

export const useFilteredBuildings = () => {
  const { data: buildings } = useQuery({
    queryKey: ["buildings"],
    queryFn: getBuildingsDatas,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  const flyToBuilding = useMapStore((state) => state.flyToBuilding);
  const setSelectedBuilding = useSelectedBuildingStore(
    (state) => state.setSelectedBuilding
  );
  const filter = useFilterStore((state) => state.filter);
  const rawSearchQuery = useSearchStore((state) => state.query);

  const searchQuery = useDebounce(rawSearchQuery, 500);

  const getFilteredBuildings = (
    buildings: TBuilding[],
    filter: string,
    searchQuery: string
  ) => {
    return buildings
      .filter((building) => {
        const matchesFilter =
          filter === "Semua" || building.priority === filter;
        const matchesSearch =
          building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          building.code.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  };

  const filteredBuildings = useMemo(() => {
    if (!buildings) return [];
    return getFilteredBuildings(buildings, filter, searchQuery);
  }, [buildings, filter, searchQuery]);

  useEffect(() => {
    if (searchQuery && filteredBuildings.length === 1) {
      flyToBuilding(filteredBuildings[0]);
    }
  }, [filteredBuildings, searchQuery, flyToBuilding]);

  const handleBuildingClick = (building: TBuilding) => {
    flyToBuilding(building);
    setSelectedBuilding(building);
  };

  return {
    filteredBuildings,
    handleBuildingClick,
  };
};
