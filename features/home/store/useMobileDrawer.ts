import { create } from "zustand";

interface MobileDrawerStore {
  isOpen: boolean;
  isTourActive: boolean;
  setOpen: (open: boolean) => void;
  setTourActive: (active: boolean) => void;
}

export const useMobileDrawerStore = create<MobileDrawerStore>((set) => ({
  isOpen: false,
  isTourActive: false,
  setOpen: (isOpen) => set({ isOpen }),
  setTourActive: (isTourActive) => set({ isTourActive }),
}));
