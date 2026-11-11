"use client";

import { useSyncExternalStore, useState, useCallback } from "react";
import { Sparkles, X } from "lucide-react";

const STORAGE_KEY = "spk_demo_banner_dismissed";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  if (typeof window === "undefined") return true;
  return sessionStorage.getItem(STORAGE_KEY) === "true";
}

function getServerSnapshot() {
  return true;
}

export function DemoBanner() {
  const isStoredDismissed = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const [manuallyDismissed, setManuallyDismissed] = useState(false);

  const handleDismiss = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore
    }
    setManuallyDismissed(true);
  }, []);

  if (isStoredDismissed || manuallyDismissed) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Portfolio Demo"
      className="relative z-50 flex w-full items-center justify-between gap-3 border-b border-primary/20 bg-primary/5 px-4 py-2 text-xs text-foreground backdrop-blur-xs md:text-sm"
    >
      <div className="mx-auto flex flex-wrap items-center justify-center gap-2 text-center">
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 font-semibold text-[11px] text-primary">
          <Sparkles className="h-3 w-3" /> Portfolio Showcase
        </span>
        <span className="text-muted-foreground">
          Sistem Pendukung Keputusan Prioritas Perawatan Gedung FT UNNES (GIS &amp; SAW Method).
        </span>
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        className="rounded p-1 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground cursor-pointer"
        title="Tutup informasi"
        aria-label="Tutup banner demo"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
