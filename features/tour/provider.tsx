"use client";

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { driver, type Driver, type DriveStep } from "driver.js";
import { useMobileDrawerStore } from "@/features/home/store/useMobileDrawer";
import {
  publicTourSteps,
  publicMobileTourSteps,
  adminTourSteps,
  adminMobileTourSteps,
} from "./config";
import "./styles.css";

interface TourContextValue {
  startPublicTour: () => void;
  startAdminTour: () => void;
  resetTour: (type: "public" | "admin") => void;
}

const TourContext = createContext<TourContextValue | null>(null);

const STORAGE_KEY_PUBLIC = "spk-tour-completed-public";
const STORAGE_KEY_ADMIN = "spk-tour-completed-admin";

function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px)").matches;
}

function filterVisibleSteps(steps: DriveStep[]): DriveStep[] {
  if (typeof document === "undefined") return steps;
  return steps.filter((step) => {
    if (!step.element || step.data?.insideDrawer) return true;
    if (typeof step.element !== "string") return true;
    const el = document.querySelector(step.element);
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });
}

function cleanupMobileDrawerTourState() {
  const drawerStore = useMobileDrawerStore.getState();
  drawerStore.setOpen(false);
  drawerStore.setTourActive(false);
}

export function TourProvider({ children }: { children: React.ReactNode }) {
  const driverRef = useRef<Driver | null>(null);

  const destroyDriver = useCallback(() => {
    if (driverRef.current) {
      driverRef.current.destroy();
      driverRef.current = null;
    }
    cleanupMobileDrawerTourState();
  }, []);

  const createAndRunTour = useCallback(
    (steps: DriveStep[], storageKey: string) => {
      destroyDriver();

      const visibleSteps = filterVisibleSteps(steps);
      if (visibleSteps.length === 0) return;

      const mobile = isMobileViewport();
      useMobileDrawerStore.getState().setTourActive(true);

      const tour = driver({
        popoverClass: "spk-tour",
        showProgress: true,
        progressText: "{{current}} of {{total}}",
        nextBtnText: "Selanjutnya",
        prevBtnText: "Sebelumnya",
        doneBtnText: "Selesai",
        showButtons: ["next", "previous", "close"],
        allowClose: true,
        allowKeyboardControl: !mobile,
        skipMissingElement: true,
        stagePadding: mobile ? 6 : 10,
        popoverOffset: mobile ? 8 : 10,
        steps: visibleSteps,
        onDestroyStarted: () => {
          cleanupMobileDrawerTourState();
          tour.destroy();
          driverRef.current = null;
        },
        onDestroyed: () => {
          cleanupMobileDrawerTourState();
          localStorage.setItem(storageKey, "true");
          driverRef.current = null;
        },
      });

      driverRef.current = tour;
      tour.drive();
    },
    [destroyDriver]
  );

  const startPublicTour = useCallback(() => {
    const steps = isMobileViewport() ? publicMobileTourSteps : publicTourSteps;
    createAndRunTour(steps, STORAGE_KEY_PUBLIC);
  }, [createAndRunTour]);

  const startAdminTour = useCallback(() => {
    const steps = isMobileViewport() ? adminMobileTourSteps : adminTourSteps;
    createAndRunTour(steps, STORAGE_KEY_ADMIN);
  }, [createAndRunTour]);

  const resetTour = useCallback((type: "public" | "admin") => {
    const key = type === "public" ? STORAGE_KEY_PUBLIC : STORAGE_KEY_ADMIN;
    localStorage.removeItem(key);
  }, []);

  useEffect(() => {
    return () => {
      if (driverRef.current) {
        driverRef.current.destroy();
        driverRef.current = null;
      }
      cleanupMobileDrawerTourState();
    };
  }, []);

  return (
    <TourContext.Provider
      value={{ startPublicTour, startAdminTour, resetTour }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within TourProvider");
  return ctx;
}
