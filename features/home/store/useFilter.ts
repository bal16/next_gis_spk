import type { PriorityFilter } from "@/types/building";
import { create } from "zustand";

interface FilterStore {
  filter: PriorityFilter;
  setFilter: (filter: PriorityFilter) => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  filter: "Semua",

  setFilter: (filter) => set({ filter }),
}));
