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
  const { data: dssResults, isLoading } = useQuery({
    queryKey: ["dss"],
    queryFn: getResultDatas,
    staleTime: Infinity,
  });
  const { mutateAsync: runCalculation, isPending } = useRunCalculation();
  const [confirmOpen, setConfirmOpen] = useState(false);

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
          title: "Belum ada riwayat kalkulasi",
          description: "Jalankan perhitungan SAW untuk melihat riwayat di sini.",
        }}
        renderAction={
          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogTrigger asChild>
              <Button disabled={isPending}>
                {isPending && <LoaderCircle data-icon="inline-start" className="animate-spin" />}
                {isPending ? "Menghitung..." : "Jalankan Perhitungan SAW"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Konfirmasi Perhitungan</DialogTitle>
                <DialogDescription>
                  Jalankan perhitungan SAW sekarang? Hasil akan disimpan sebagai riwayat baru.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={isPending}>
                  Batal
                </Button>
                <Button onClick={handleConfirm} disabled={isPending} aria-busy={isPending}>
                  {isPending && <LoaderCircle data-icon="inline-start" className="animate-spin" />}
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
