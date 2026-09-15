"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { useTour } from "./provider";

const STORAGE_KEY_PUBLIC = "spk-tour-completed-public";
const STORAGE_KEY_ADMIN = "spk-tour-completed-admin";

export function TourTriggers({ page }: { page: "public" | "admin" }) {
  const { startPublicTour, startAdminTour } = useTour();

  useEffect(() => {
    const key = page === "public" ? STORAGE_KEY_PUBLIC : STORAGE_KEY_ADMIN;
    const completed = localStorage.getItem(key) === "true";
    if (!completed) {
      const timer = setTimeout(() => {
        if (page === "public") {
          startPublicTour();
        } else {
          startAdminTour();
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [page, startPublicTour, startAdminTour]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={page === "public" ? startPublicTour : startAdminTour}
      title="Lihat panduan"
      aria-label="Lihat panduan penggunaan"
    >
      <HelpCircle className="size-4" />
    </Button>
  );
}
