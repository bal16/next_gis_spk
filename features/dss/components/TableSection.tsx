"use client";

import { useQuery } from "@tanstack/react-query";
import { columns, type Results } from "./column";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { getResultDatas } from "../api/get-results";
import { ConfirmationDialog } from "@/features/dashboard/components/ConfirmationDialog";
import { useRunCalculation } from "../hooks/useDSS";

export const TableSection = () => {
  const { data: dssResults } = useQuery({
    queryKey: ["dss"],
    queryFn: getResultDatas,
    staleTime: Infinity,
  });
  const { mutateAsync: runCalculation, isPending } = useRunCalculation();

  return (
    <div className="container mx-auto">
      <DataTable
        columns={columns}
        data={(dssResults as unknown as Results[]) ?? []}
        renderButton={
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
