"use client";

import { useQuery } from "@tanstack/react-query";
import { columns, type Results } from "./column";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { Button } from "@/components/ui/button";
import { getResultDatas } from "../api/get-results";
import { ConfirmationDialog } from "@/features/dashboard/components/ConfirmationDialog";
import { useRunCalculation } from "../hooks/useDSS";

export const TableSection = () => {
  const { data: dssResults, isLoading } = useQuery({
    queryKey: ["dss"],
    queryFn: getResultDatas,
    staleTime: Infinity,
  });
  const { mutateAsync: runCalculation, isPending } = useRunCalculation();

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
          <ConfirmationDialog
            trigger={<Button disabled={isPending}>{isPending ? "Calculating..." : "Run SAW Calculation"}</Button>}
            title="Confirm Calculation"
            description="Are you sure you want to perform this calculation?"
            callback={async () => {
              await runCalculation();
            }}
          />
        }
      />
    </div>
  );
};
