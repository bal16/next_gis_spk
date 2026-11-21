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
import { Badge } from "@/components/ui/badge";

const ActionCell = ({ building }: { building: TBuilding }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { mutateAsync: deleteBuilding, isPending } = useDeleteBuilding();

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
              Lihat Assessment
            </Link>
          </DropdownMenuItem>
          {building.assessmentCount === 0 && (
            <DropdownMenuItem asChild>
              <Link
                href={`/admin/buildings/${building.code}/assessments?create=true`}
              >
                Isi Penilaian
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setIsEditOpen(true);
            }}
          >
            Edit
          </DropdownMenuItem>
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
        title="Hapus Gedung?"
        description={`Hapus Gedung ${building.code} — ${building.name}? Semua assessment dan riwayat SAW terkait gedung ini akan ikut terhapus. Tindakan tidak dapat dibatalkan.`}
        onConfirm={async () => {
          await deleteBuilding(building.id);
        }}
        isPending={isPending}
      />

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
  },
  {
    accessorKey: "priority",
    header: createSortableHeader("Prioritas"),
  },
  {
    accessorKey: "assessmentCount",
    header: createSortableHeader("Assessment"),
    cell: (info) => {
      const count = Number(info.getValue()) || 0;
      return (
        <Badge
          variant={count > 0 ? "secondary" : "destructive"}
          className={
            count > 0
              ? undefined
              : "border-transparent bg-amber-500 text-white hover:bg-amber-600"
          }
        >
          {count > 0 ? `${count} penilaian` : "Belum dinilai"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionCell building={row.original} />,
  },
];
