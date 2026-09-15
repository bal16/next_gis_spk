"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type HeaderContext,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpDownIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

// ---------------------------------------------------------------------------
// Deep module: AdminDataTable
// Small interface, lots hidden: sorting + filtering + client pagination (10 + 10/25/50) + empty + skeleton
// ---------------------------------------------------------------------------

export type AdminDataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterKey?: string;
  filterPlaceholder?: string;
  renderAction?: ReactNode;
  empty?: {
    title: string;
    description?: string;
    action?: ReactNode;
  };
  isLoading?: boolean;
  /** @internal initial sort, e.g. [{id:"score", desc:true}] */
  initialSorting?: SortingState;
};

export function AdminDataTable<TData, TValue>({
  columns,
  data,
  filterKey,
  filterPlaceholder,
  renderAction,
  empty,
  isLoading,
  initialSorting,
}: AdminDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting ?? []);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 8 });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    initialState: initialSorting ? { sorting: initialSorting } : undefined,
  });

  const hasFilter = Boolean(filterKey && table.getColumn(filterKey!));

  return (
    <div className="flex flex-col gap-4">
      {(hasFilter || renderAction) && (
        <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            {hasFilter ? (
              <Input
                placeholder={filterPlaceholder ?? `Filter ${filterKey}...`}
                value={
                  (table.getColumn(filterKey!)?.getFilterValue() as string) ??
                  ""
                }
                onChange={(event) =>
                  table
                    .getColumn(filterKey!)
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
            ) : (
              <div />
            )}
          </div>
          {renderAction && <div className="shrink-0">{renderAction}</div>}
        </section>
      )}

      <section className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    aria-sort={
                      header.column.getIsSorted() === "asc"
                        ? "ascending"
                        : header.column.getIsSorted() === "desc"
                          ? "descending"
                          : header.column.getCanSort()
                            ? "none"
                            : undefined
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, rowIdx) => (
                <TableRow key={`skeleton-${rowIdx}`}>
                  {Array.from({ length: columns.length }).map((__, cellIdx) => (
                    <TableCell key={cellIdx}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  {empty ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-6">
                      <p className="text-sm font-medium">{empty.title}</p>
                      {empty.description && (
                        <p className="text-muted-foreground max-w-sm text-sm">
                          {empty.description}
                        </p>
                      )}
                      {empty.action && (
                        <div className="pt-2">{empty.action}</div>
                      )}
                    </div>
                  ) : (
                    "No results."
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>

      {!isLoading &&
        table.getRowModel().rows.length > 0 &&
        table.getPageCount() > 1 && (
          <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <span>
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>
              <span>·</span>
              <span>{table.getFilteredRowModel().rows.length} row(s)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground hidden text-sm sm:inline">
                  Rows per page
                </span>
                <NativeSelect
                  value={String(table.getState().pagination.pageSize)}
                  onChange={(e) => table.setPageSize(Number(e.target.value))}
                  className="h-8 w-[70px]"
                >
                  <NativeSelectOption value="8">8</NativeSelectOption>
                  <NativeSelectOption value="10">10</NativeSelectOption>
                  <NativeSelectOption value="25">25</NativeSelectOption>
                  <NativeSelectOption value="50">50</NativeSelectOption>
                </NativeSelect>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          </section>
        )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pure helper co-located with the module (locality): fixes D2/D8 (size-*, data-icon) + aria-sort in one place
// ---------------------------------------------------------------------------

export function createSortableHeader<TData, TValue>(
  label: string,
  opts?: { tooltip?: string }
): (ctx: HeaderContext<TData, TValue>) => ReactNode {
  const SortableHeader = ({ column }: HeaderContext<TData, TValue>) => {
    const sorted = column.getIsSorted();
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        aria-label={
          opts?.tooltip ? `${label} — ${opts.tooltip}` : `Sort by ${label}`
        }
      >
        <span>{label}</span>
        {sorted === "asc" ? (
          <ArrowUpIcon data-icon="inline-end" />
        ) : sorted === "desc" ? (
          <ArrowDownIcon data-icon="inline-end" />
        ) : (
          <ArrowUpDownIcon data-icon="inline-end" />
        )}
      </Button>
    );
  };

  SortableHeader.displayName = `SortableHeader(${label})`;

  return SortableHeader;
}
