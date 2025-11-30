"use client";

import { useState } from "react";
import { Building } from "@/types/building";
import { useBuildingFilters } from "../features/buildings/hooks/useBuildingFilters";
import { useMapController } from "../features/map/hooks/useMapController";

export const useHomeLogic = () => {
  // 1. Panggil Logic Data
  const dataLogic = useBuildingFilters();
  
  // 2. Panggil Logic Map
  const mapLogic = useMapController();
  
  // 3. State UI lokal (Sidebar)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 4. Buat Action Gabungan (Glue Code)
  const handleBuildingClick = (building: Building) => {
    // Action A: Pindahkan Map
    mapLogic.flyToBuilding(building);
    // Action B: Update UI
    setIsSidebarOpen(false); 
  };

  const handleResetMap = () => {
    mapLogic.resetView();
    // Opsional: Reset filter atau search jika diinginkan
  };

  // 5. Return Unified API
  return {
    // Data Props
    buildings: dataLogic.buildings,
    isLoading: dataLogic.isLoading,
    error: dataLogic.error,
    filter: dataLogic.filter,
    setFilter: dataLogic.setFilter,
    searchQuery: dataLogic.searchQuery,
    setSearchQuery: dataLogic.setSearchQuery,

    // Map Props
    mapRef: mapLogic.mapRef,
    
    // UI Props
    isSidebarOpen,
    setIsSidebarOpen,

    // Actions
    handleBuildingClick,
    handleResetMap,
  };
};