"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { createSortableHeader } from "@/components/admin/AdminDataTable";
import type { TAssessment } from "@/features/buildings/type";
import { ConfirmationDialog } from "@/features/dashboard/components/ConfirmationDialog";
import { useDeleteAssessment } from "../hooks/useAssessments";
import { SCORE_LABELS } from "../constants";
import { EditDialog } from "./EditDialog";

const ActionCell = ({
  assessment,
  buildingCode,
}: {
  assessment: TAssessment;
  buildingCode: string;
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { mutateAsync: deleteAssessment, isPending } = useDeleteAssessment();

  return (
    <div className="flex items-center justify-end gap-1">
      <EditDialog
        buildingCode={buildingCode}
        assessment={assessment}
        trigger={
          <Button variant="outline" size="sm">
            Edit
          </Button>
        }
      />
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setConfirmOpen(true)}
      >
        Hapus
      </Button>
      <ConfirmationDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Hapus Assessment?"
        description="Hapus assessment ini? Tindakan tidak dapat dibatalkan."
        onConfirm={async () => {
          await deleteAssessment(assessment.id);
        }}
        isPending={isPending}
      />
    </div>
  );
};

export const getColumns = (buildingCode: string): ColumnDef<TAssessment>[] => [
  {
    accessorKey: "age",
    header: createSortableHeader("Umur"),
  },
  {
    accessorKey: "structure",
    header: createSortableHeader("Struktur"),
    cell: (info) => SCORE_LABELS[Number(info.getValue())] ?? "-",
  },
  {
    accessorKey: "architecture",
    header: createSortableHeader("Arsitektur"),
    cell: (info) => SCORE_LABELS[Number(info.getValue())] ?? "-",
  },
  {
    accessorKey: "mep",
    header: createSortableHeader("MEP"),
    cell: (info) => SCORE_LABELS[Number(info.getValue())] ?? "-",
  },
  {
    accessorKey: "utility",
    header: createSortableHeader("Utilitas"),
    cell: (info) => SCORE_LABELS[Number(info.getValue())] ?? "-",
  },
  {
    accessorKey: "damage",
    header: createSortableHeader("Kerusakan"),
    cell: (info) => SCORE_LABELS[Number(info.getValue())] ?? "-",
  },
  {
    accessorKey: "lastMaintenance",
    header: createSortableHeader("Pemeliharaan Terakhir"),
    cell: (info) => {
      const value = info.getValue() as string | Date | null | undefined;
      if (!value) return "-";
      return new Date(value).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },
  },
  {
    accessorKey: "createdAt",
    header: createSortableHeader("Dibuat"),
    cell: (info) => {
      const value = info.getValue() as string | Date | undefined;
      if (!value) return "-";
      return new Date(value).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <ActionCell assessment={row.original} buildingCode={buildingCode} />
    ),
  },
];
