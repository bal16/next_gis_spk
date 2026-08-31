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

import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/features/dashboard/components/ConfirmationDialog";
import { useDeleteRun } from "../hooks/useDSS";
import { createSortableHeader } from "@/components/admin/AdminDataTable";
// import { BuildingDialog } from "./BuildingDialog";

export type Results = {
  id: string;
  date: string;
  averageScore: number;
  totalBuildings: number;
};

const ActionCell = ({ run }: { run: Results }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { mutateAsync: deleteRun, isPending } = useDeleteRun();

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
            <Link href={`/admin/dss/${run.id}`}>Lihat Detail</Link>
          </DropdownMenuItem>
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
        title="Hapus Riwayat Kalkulasi?"
        description={`Hapus riwayat kalkulasi ${new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(run.date))}? Semua detail skor gedung dalam run ini akan hilang. Tindakan tidak dapat dibatalkan.`}
        onConfirm={async () => {
          await deleteRun(run.id);
        }}
        isPending={isPending}
      />
    </>
  );
};

export const columns: ColumnDef<Results>[] = [
  {
    accessorKey: "number",
    cell: (info) => info.row.index + 1,
    header: createSortableHeader("#"),
  },
  {
    accessorKey: "id",
    header: createSortableHeader("Id"),
  },
  {
    accessorKey: "date",
    accessorFn: (row) =>
      new Intl.DateTimeFormat("id-ID", {
        dateStyle: "long",
        timeStyle: "short",
      }).format(new Date(row.date)),
    header: createSortableHeader("Executed At"),
  },
  {
    accessorKey: "averageScore",
    accessorFn: (row) => row.averageScore.toFixed(2),
    header: createSortableHeader("Average Score"),
  },
  {
    accessorKey: "totalBuildings",
    header: createSortableHeader("Total Bangunan"),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionCell run={row.original} />,
  },
];
