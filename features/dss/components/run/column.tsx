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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createSortableHeader } from "@/components/admin/AdminDataTable";
import { ShortId } from "@/components/admin/ShortId";

export type RunDetail = TGetResultsResponse["sawRunDetails"][0] & {
  rank?: number;
};

const ActionCell = ({ runDetail }: { runDetail: RunDetail }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { mutateAsync: deleteRunDetail, isPending } = useDeleteRunDetail(
    runDetail.sawRunId
  );

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
    accessorKey: "rank",
    header: createSortableHeader("#"),
    cell: (info) => {
      const rank = info.row.original.rank ?? info.row.index + 1;
      return <span className="font-medium">#{rank}</span>;
    },
  },
  {
    accessorKey: "id",
    header: createSortableHeader("ID"),
    cell: (info) => <ShortId id={info.getValue() as string} />,
  },
  {
    accessorKey: "score",
    sortingFn: "basic",
    header: ({ column }) => {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              aria-label="Sort by Skor Terakhir"
            >
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
    cell: (info) => {
      const val = info.getValue() as number | undefined;
      return typeof val === "number" ? val.toFixed(2) : "N/A";
    },
  },
  {
    accessorKey: "priority",
    header: createSortableHeader("Priority"),
    cell: (info) => {
      const val = info.getValue() as number | string;
      const num = Number(val);
      if (num === 1 || val === "Prioritas Tinggi") {
        return (
          <span className="bg-destructive/10 text-destructive inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold">
            Prioritas Tinggi
          </span>
        );
      }
      if (num === 2 || val === "Prioritas Sedang") {
        return (
          <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
            Prioritas Sedang
          </span>
        );
      }
      if (num === 3 || val === "Prioritas Rendah") {
        return (
          <span className="bg-muted text-muted-foreground inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold">
            Prioritas Rendah
          </span>
        );
      }
      return String(val ?? "-");
    },
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
