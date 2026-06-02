"use client";

import { useQuery } from "@tanstack/react-query";
import { columns } from "./column";
import { DataTable } from "./data-table";
import { getBuildingAssessmentsDatas } from "@/features/buildings/api/get-building-assessments";
import { CreateDialog } from "./CreateDialog";

export const TableSection = ({ code }: { code: string }) => {
  const { data: building } = useQuery({
    queryKey: ["building-assessments", code],
    queryFn: () => getBuildingAssessmentsDatas(code),
    staleTime: Infinity,
  });
  return (
    <div className="container mx-auto">
      <DataTable
        columns={columns}
        data={building?.assessments ?? []}
        renderButton={<CreateDialog buildingCode={building?.code} />}
      />
    </div>
  );
};
