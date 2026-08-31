"use client";

import Link from "next/link";
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
  const { mutateAsync: deleteRun } = useDeleteRun();

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
        <DropdownMenuItem asChild>
          <Link href={`/admin/dss/${run.id}`}>See Details</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <ConfirmationDialog
            title="Delete Run"
            description="Are you sure you want to delete this Run?"
            callback={async () => {
              await deleteRun(run.id);
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
