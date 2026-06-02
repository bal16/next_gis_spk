"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, MoreHorizontalIcon } from "lucide-react";
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

type RunDetail = TGetResultsResponse["sawRunDetails"][0];

const ActionCell = ({ runDetail }: { runDetail: RunDetail }) => {
  const { mutateAsync: deleteRunDetail } = useDeleteRunDetail(runDetail.sawRunId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <ConfirmationDialog
            title="Delete Run History"
            description="Are you sure you want to delete this run history?"
            callback={async () => {
              await deleteRunDetail(runDetail.id);
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

export const columns: ColumnDef<RunDetail>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          id
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    //transform data nya tofixed(2)
    accessorKey: "score",
    accessorFn: (row) => row.score?.toFixed(2) || "N/A",
    header: ({ column }) => {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Skor Terakhir
              <ArrowUpDownIcon className="ml-2 h-4 w-4" />
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Priority
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "building.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Building
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionCell runDetail={row.original} />,
  },
];
