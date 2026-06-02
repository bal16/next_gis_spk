"use client";

import { useQuery } from "@tanstack/react-query";
import { columns } from "./column";
import { DataTable } from "./data-table";
import { getBuildingsDatas } from "@/features/buildings/api/get-all-buildings";
// import { Button } from "@/components/ui/button";
import { BuildingDialog } from "./BuildingDialog";

export const TableSection = () => {
  const { data: buildings } = useQuery({
    queryKey: ["buildings"],
    queryFn: getBuildingsDatas,
    staleTime: Infinity,
  });
  return (
    <div className="container mx-auto">
      <DataTable
        columns={columns}
        data={buildings ?? []}
        renderButton={<BuildingDialog />}
      />
    </div>
  );
};
