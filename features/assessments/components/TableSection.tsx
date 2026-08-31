"use client";

import { useQuery } from "@tanstack/react-query";
import { columns } from "./column";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { getBuildingAssessmentsDatas } from "@/features/buildings/api/get-building-assessments";
import { CreateDialog } from "./CreateDialog";

export const TableSection = ({ code }: { code: string }) => {
  const { data: building, isLoading } = useQuery({
    queryKey: ["building-assessments", code],
    queryFn: () => getBuildingAssessmentsDatas(code),
    staleTime: Infinity,
  });
  return (
    <div className="container mx-auto">
      <AdminDataTable
        columns={columns}
        data={building?.assessments ?? []}
        isLoading={isLoading}
        renderAction={<CreateDialog buildingCode={building?.code} />}
        empty={{
          title: "Belum ada penilaian",
          description: `Gedung ${code} belum memiliki riwayat penilaian. Tambah penilaian pertama.`,
          action: <CreateDialog buildingCode={building?.code} />,
        }}
      />
    </div>
  );
};
