"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { OctagonXIcon, InfoIcon } from "lucide-react";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const REASON_MAP: Record<string, { title: string; description: string; variant: "destructive" | "default" }> = {
  unauthenticated: {
    title: "Sesi habis",
    description: "Silakan login kembali. Anda akan diarahkan ke dashboard setelah login.",
    variant: "destructive",
  },
  forbidden: {
    title: "Akses ditolak",
    description: "Akun Anda tidak memiliki hak admin. Hubungi administrator.",
    variant: "destructive",
  },
  unavailable: {
    title: "Layanan tidak tersedia",
    description: "Server auth tidak tersedia atau timeout. Coba lagi nanti.",
    variant: "destructive",
  },
};

export function AuthReasonAlert({
  reason: propReason,
}: {
  reason?: string;
  next?: string;
}) {
  const searchParams = useSearchParams();
  const reason = propReason ?? searchParams.get("reason");

  useEffect(() => {
    if (!reason) return;
    const cfg = REASON_MAP[reason];
    if (!cfg) return;
    toast.error(cfg.title, { description: cfg.description });
  }, [reason]);

  if (!reason) return null;
  const cfg = REASON_MAP[reason] ?? {
    title: "Pemberitahuan",
    description: reason,
    variant: "default" as const,
  };

  const Icon = cfg.variant === "destructive" ? OctagonXIcon : InfoIcon;

  return (
    <Alert variant={cfg.variant} className="mb-4">
      <Icon />
      <AlertTitle>{cfg.title}</AlertTitle>
      <AlertDescription>{cfg.description}</AlertDescription>
    </Alert>
  );
}
