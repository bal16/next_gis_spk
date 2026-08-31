"use client";

import { useQuery } from "@tanstack/react-query";
import { columns } from "./column";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { getBuildingsDatas } from "@/features/buildings/api/get-all-buildings";
import { BuildingDialog } from "./BuildingDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export const TableSection = () => {
  const { data: buildings, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["buildings"],
    queryFn: getBuildingsDatas,
    staleTime: Infinity,
  });

  if (isError) {
    return (
      <div className="container mx-auto space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Failed to load buildings</AlertTitle>
          <AlertDescription className="flex flex-col gap-3">
            <span>{(error as Error)?.message || "Unable to load buildings."}</span>
            <Button variant="outline" size="sm" onClick={() => (refetch as unknown as () => void)?.()} className="w-fit">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <AdminDataTable
        columns={columns}
        data={buildings ?? []}
        filterKey="name"
        filterPlaceholder="Filter Buildings..."
        renderAction={<BuildingDialog />}
        isLoading={isLoading}
        empty={{
          title: "No buildings yet",
          description: "Add your first building to start SAW ranking.",
          action: <BuildingDialog />,
        }}
      />
    </div>
  );
};
