"use client";

import { useRef, useCallback } from "react";
import { MapRef } from "react-map-gl/maplibre";
import { INITIAL_VIEW } from "@/lib/config";
import { Building } from "@/types/building";

export const useMapController = () => {
  const mapRef = useRef<MapRef>(null);

  // Gunakan useCallback agar function identity stabil
  const flyToBuilding = useCallback((building: Building) => {
    mapRef.current?.flyTo({
      center: [building.location.lng, building.location.lat],
      zoom: 18,
      duration: 1000,
      essential: true,
    });
  }, []);

  const resetView = useCallback(() => {
    mapRef.current?.flyTo({
      center: [INITIAL_VIEW.longitude, INITIAL_VIEW.latitude],
      zoom: INITIAL_VIEW.zoom,
      duration: 1500,
      essential: true,
    });
  }, []);

  return {
    mapRef,
    flyToBuilding,
    resetView,
  };
};
