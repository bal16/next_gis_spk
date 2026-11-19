export const dynamic = "force-dynamic";

"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";

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
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.location.href = `/admin/buildings/${assessment.code}/assessments/${assessment.id}`}>
        Lihat
      </Button>
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
    header: "Dibuat",
    cell: info => {
      if (!info.getRow().original.createdAt) return "-";
      return new Date(info.getRow().original.createdAt).toLocaleDateString("id-ID");
    },
  },
  {
    accessorKey: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      return (
        <>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setConfirmOpen(true)}
          >
            Hapus
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = `/admin/buildings/${row.original.code}/assessments/${row.original.id}`}>
            Lihat
          </Button>
        </>
      );
    },
  },
];