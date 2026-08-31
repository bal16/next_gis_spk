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
import { ConfirmationDialog } from "@/features/dashboard/components/ConfirmationDialog";
import type { TGetResultsResponse } from "../../api/get-results";
import { useDeleteRunDetail } from "../../hooks/useDSS";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { createSortableHeader } from "@/components/admin/AdminDataTable";

type RunDetail = TGetResultsResponse["sawRunDetails"][0];

const ActionCell = ({ runDetail }: { runDetail: RunDetail }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { mutateAsync: deleteRunDetail, isPending } = useDeleteRunDetail(runDetail.sawRunId);

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
        title="Hapus Detail Riwayat?"
        description={`Hapus detail riwayat untuk ${runDetail.building?.name ?? runDetail.buildingId}? Tindakan tidak dapat dibatalkan.`}
        onConfirm={async () => {
          await deleteRunDetail(runDetail.id);
        }}
        isPending={isPending}
      />
    </>
  );
};

export const columns: ColumnDef<RunDetail>[] = [
  {
    accessorKey: "id",
    header: createSortableHeader("id"),
  },
  {
    //transform data nya tofixed(2)
    accessorKey: "score",
    accessorFn: (row) => row.score?.toFixed(2) || "N/A",
    header: ({ column }) => {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} aria-label="Sort by Skor Terakhir">
              Skor Terakhir
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">
              Skor akhir dari hasil penilaian terakhir. Semakin tinggi skornya,
              semakin urgen untuk dilakukan maintenance.
            </p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "priority",
    header: createSortableHeader("Priority"),
  },
  {
    accessorKey: "building.name",
    header: createSortableHeader("Building"),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionCell runDetail={row.original} />,
  },
];
