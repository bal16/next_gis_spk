import { create } from "zustand";
import { TBuilding } from "@/types/building";

interface SelectedBuildingStore {
  building: TBuilding | null;
  setSelectedBuilding: (building: TBuilding | null) => void;
}

export const useSelectedBuildingStore = create<SelectedBuildingStore>(
  (set) => ({
    building: null,
    setSelectedBuilding: (building) => set({ building }),
  })
);
