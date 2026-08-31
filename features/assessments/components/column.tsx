"use client";

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
  const { mutateAsync: deleteAssessment } = useDeleteAssessment();

  return (
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
        <DropdownMenuItem asChild>
          <ConfirmationDialog
            title="Delete Assessment"
            description="Are you sure you want to delete this assessment?"
            callback={async () => {
              await deleteAssessment(assessment.id);
            }}
            trigger={
              <Button variant="ghost" className="w-full text-left justify-start px-2 font-normal">
                Delete
              </Button>
            }
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
