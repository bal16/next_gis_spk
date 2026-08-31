"use client";

import Link from "next/link";
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
import { createSortableHeader } from "@/components/admin/AdminDataTable";

const ActionCell = ({ building }: { building: TBuilding }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { mutateAsync: deleteBuilding } = useDeleteBuilding();

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
    header: createSortableHeader("#"),
  },
  {
    accessorKey: "code",
    header: createSortableHeader("Kode Bangunan"),
  },
  {
    accessorKey: "name",
    header: createSortableHeader("Nama Bangunan"),
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
              size="sm"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
  },
  {
    accessorKey: "priority",
    header: createSortableHeader("Prioritas"),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionCell building={row.original} />,
  },
];
