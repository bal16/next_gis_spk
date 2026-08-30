"use client";

import Link from "next/link";
import { useState } from "react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { BuildingDialog } from "./BuildingDialog";
import { ConfirmationDialog } from "@/features/dashboard/components/ConfirmationDialog";
import type { TBuilding } from "../type";
import { useDeleteBuilding } from "../hooks/useBuildings";

const ActionCell = ({ building }: { building: TBuilding }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { mutateAsync: deleteBuilding } = useDeleteBuilding();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={`/admin/buildings/${building.code}/assessments`}>
              See Assessments
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setIsEditOpen(true);
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <ConfirmationDialog
              title="Delete Building"
              description="Are you sure you want to delete this building?"
              callback={async () => {
                await deleteBuilding(building.id);
              }}
              trigger={
                <Button
                  variant="ghost"
                  className="w-full text-left justify-start px-2 font-normal"
                >
                  Delete
                </Button>
              }
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <BuildingDialog
        variant="edit"
        initialData={building}
        buildingId={building.id}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </>
  );
};

export const columns: ColumnDef<TBuilding>[] = [
  {
    accessorKey: "number",
    cell: (info) => info.row.index + 1,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          #
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "code",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Kode Bangunan
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama Bangunan
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "score",
    accessorFn: (row) => row?.score?.toFixed(2) || "N/A",
    sortDescFirst: true,
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
          Prioritas
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionCell building={row.original} />,
  },
];
