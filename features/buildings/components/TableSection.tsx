"use client";

import { useQuery } from "@tanstack/react-query";
import { columns } from "./column";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { getBuildingsDatas } from "@/features/buildings/api/get-all-buildings";
import { BuildingDialog } from "./BuildingDialog";

export const TableSection = () => {
  const { data: buildings, isLoading } = useQuery({
    queryKey: ["buildings"],
    queryFn: getBuildingsDatas,
    staleTime: Infinity,
  });
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
          title: "Belum ada gedung",
          description: "Tambah gedung pertama untuk memulai penilaian SAW.",
          action: <BuildingDialog />,
        }}
      />
    </div>
  );
};
