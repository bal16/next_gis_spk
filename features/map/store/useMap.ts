import { create } from "zustand";
import { MapRef } from "react-map-gl/maplibre";
import { TBuilding } from "@/types/building";
import { INITIAL_VIEW } from "@/lib/config";

interface MapStore {
  mapRef: MapRef | null;
  setMapRef: (ref: MapRef | null) => void;
  flyToBuilding: (building: TBuilding) => void;
  resetView: () => void;
}

export const useMapStore = create<MapStore>((set, get) => ({
  mapRef: null,

  setMapRef: (ref) => set({ mapRef: ref }),

  flyToBuilding: (building) => {
    const map = get().mapRef;
    if (!map) return;

    map.flyTo({
      center: [building.location.lng, building.location.lat],
      zoom: 18,
      duration: 1000,
      essential: true,
    });
  },

  resetView: () => {
    const map = get().mapRef;
    if (!map) return;

    map.flyTo({
      center: [INITIAL_VIEW.longitude, INITIAL_VIEW.latitude],
      zoom: INITIAL_VIEW.zoom,
      duration: 1500,
      essential: true,
    });
  },
}));
