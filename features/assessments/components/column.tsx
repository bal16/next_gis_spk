"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontalIcon data-icon="inline-end" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setConfirmOpen(true);
            }}
          >
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
    accessorKey: "id",
    header: createSortableHeader("id"),
  },
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
    accessorKey: "lastMaintenance",
    // accessorFn: ,
    accessorFn: (row) =>
      row.lastMaintenance
        ? new Intl.DateTimeFormat("id-ID", {
            dateStyle: "long",
            timeStyle: "short",
          }).format(new Date(row.lastMaintenance as Date))
        : "N/A",
    header: createSortableHeader("Pemeliharaan Terakhir"),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionCell assessment={row.original} />,
  },
];
