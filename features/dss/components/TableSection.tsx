"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { columns, type Results } from "./column";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getResultDatas } from "../api/get-results";
import { useRunCalculation } from "../hooks/useDSS";

export const TableSection = () => {
  const {
    data: dssResults,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dss"],
    queryFn: getResultDatas,
    staleTime: Infinity,
  });
  const { mutateAsync: runCalculation, isPending } = useRunCalculation();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isError) {
    return (
      <div className="container mx-auto space-y-4">
        <div className="rounded-md border p-4">
          <p className="text-destructive text-sm">
            {(error as Error)?.message || "Failed to load SAW runs."}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => (refetch as unknown as () => void)?.()}
            className="mt-3"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const handleConfirm = async () => {
    try {
      await runCalculation();
      setConfirmOpen(false);
    } catch {
      // keep open on error — hook toasts
    }
  };

  return (
    <div className="container mx-auto">
      <AdminDataTable
        columns={columns}
        data={(dssResults as unknown as Results[]) ?? []}
        isLoading={isLoading}
        empty={{
          title: "No calculation history",
          description: "Run SAW calculation to see history here.",
        }}
        renderAction={
          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogTrigger asChild>
              <Button disabled={isPending}>
                {isPending && (
                  <LoaderCircle
                    data-icon="inline-start"
                    className="animate-spin"
                  />
                )}
                {isPending ? "Menghitung..." : "Jalankan Perhitungan SAW"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Konfirmasi Perhitungan</DialogTitle>
                <DialogDescription>
                  Jalankan perhitungan SAW sekarang? Hasil akan disimpan sebagai
                  riwayat baru.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setConfirmOpen(false)}
                  disabled={isPending}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={isPending}
                  aria-busy={isPending}
                >
                  {isPending && (
                    <LoaderCircle
                      data-icon="inline-start"
                      className="animate-spin"
                    />
                  )}
                  Konfirmasi
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
    </div>
  );
};
