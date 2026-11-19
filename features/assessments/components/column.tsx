"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { createSortableHeader } from "@/components/admin/AdminDataTable";
import type { TAssessment } from "@/features/buildings/type";
import { ConfirmationDialog } from "@/features/dashboard/components/ConfirmationDialog";
import { useDeleteAssessment } from "../hooks/useAssessments";

const ActionCell = ({ assessment }: { assessment: TAssessment }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { mutateAsync: deleteAssessment, isPending } = useDeleteAssessment();

  return (
    <>
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
    </>
  );
};

export const columns: ColumnDef<TAssessment>[] = [
  {
    accessorKey: "age",
    header: createSortableHeader("Umur"),
  },
  {
    accessorKey: "structure",
    header: createSortableHeader("Struktur"),
  },
  {
    accessorKey: "architecture",
    header: createSortableHeader("Arsitektur"),
  },
  {
    accessorKey: "mep",
    header: createSortableHeader("MEP"),
  },
  {
    accessorKey: "utility",
    header: createSortableHeader("Utilitas"),
  },
  {
    accessorKey: "damage",
    header: createSortableHeader("Kerusakan"),
  },
  {
    accessorKey: "createdAt",
    header: createSortableHeader("Dibuat"),
    cell: (info) => {
      const value = info.getValue() as string | Date | undefined;
      if (!value) return "-";
      return new Date(value).toLocaleDateString("id-ID");
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => <ActionCell assessment={row.original} />,
  },
];
