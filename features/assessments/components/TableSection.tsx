"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getColumns } from "./column";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { getBuildingAssessmentsDatas } from "@/features/buildings/api/get-building-assessments";
import { CreateDialog } from "./CreateDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export const TableSection = ({ code }: { code: string }) => {
  const {
    data: building,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["building-assessments", code],
    queryFn: () => getBuildingAssessmentsDatas(code),
    staleTime: Infinity,
  });

  const columns = useMemo(() => getColumns(code), [code]);

  if (isError) {
    return (
      <div className="container mx-auto space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Failed to load assessments</AlertTitle>
          <AlertDescription className="flex flex-col gap-3">
            <span>
              {(error as Error)?.message || "Unable to load assessments."}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (refetch as unknown as () => void)?.()}
              className="w-fit"
            >
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
        data={building?.assessments ?? []}
        isLoading={isLoading}
        initialSorting={[{ id: "createdAt", desc: true }]}
        renderAction={<CreateDialog buildingCode={code} />}
        empty={{
          title: "No assessments yet",
          description: `Building ${code} has no assessments. Add the first assessment.`,
          action: <CreateDialog buildingCode={code} />,
        }}
      />
    </div>
  );
};
