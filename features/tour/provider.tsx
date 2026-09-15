"use client";

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from "react";
import { driver, type Driver, type DriveStep } from "driver.js";
import { publicTourSteps, adminTourSteps } from "./config";
import "./styles.css";

interface TourContextValue {
  startPublicTour: () => void;
  startAdminTour: () => void;
  resetTour: (type: "public" | "admin") => void;
}

const TourContext = createContext<TourContextValue | null>(null);

const STORAGE_KEY_PUBLIC = "spk-tour-completed-public";
const STORAGE_KEY_ADMIN = "spk-tour-completed-admin";

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [driverObj, setDriverObj] = useState<Driver | null>(null);

  const destroyDriver = useCallback(() => {
    if (driverObj) {
      driverObj.destroy();
      setDriverObj(null);
    }
  }, [driverObj]);

  const createAndRunTour = useCallback(
    (steps: DriveStep[], storageKey: string) => {
      destroyDriver();

      const tour = driver({
        popoverClass: "spk-tour",
        showProgress: true,
        progressText: "{{current}} of {{total}}",
        nextBtnText: "Selanjutnya",
        prevBtnText: "Sebelumnya",
        doneBtnText: "Selesai",
        showButtons: ["next", "previous", "close"],
        allowClose: true,
        steps,
        onDestroyStarted: () => {
          tour.destroy();
          setDriverObj(null);
        },
        onDestroyed: () => {
          localStorage.setItem(storageKey, "true");
          setDriverObj(null);
        },
      });

      setDriverObj(tour);
      tour.drive();
    },
    [destroyDriver],
  );

  const startPublicTour = useCallback(() => {
    createAndRunTour(publicTourSteps, STORAGE_KEY_PUBLIC);
  }, [createAndRunTour]);

  const startAdminTour = useCallback(() => {
    createAndRunTour(adminTourSteps, STORAGE_KEY_ADMIN);
  }, [createAndRunTour]);

  const resetTour = useCallback((type: "public" | "admin") => {
    const key = type === "public" ? STORAGE_KEY_PUBLIC : STORAGE_KEY_ADMIN;
    localStorage.removeItem(key);
  }, []);

  useEffect(() => {
    return () => {
      if (driverObj) {
        driverObj.destroy();
      }
    };
  }, [driverObj]);

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
