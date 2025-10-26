"use client";

import { Pencil, Trash2, Plus } from "lucide-react";
import { useBuildings, useDeleteBuilding } from "@/hooks/useBuildings";
import { Building } from "@/types/building";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DashboardSectionProps {
  onAddNew: () => void;
  onEdit: (building: Building) => void;
}

export const DashboardSection = ({
  onAddNew,
  onEdit,
}: DashboardSectionProps) => {
  const { data: buildings, isLoading, error } = useBuildings();
  const deleteBuildingMutation = useDeleteBuilding();
  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "Prioritas Tinggi":
        return "destructive";
      case "Prioritas Sedang":
        return "default";
      case "Prioritas Rendah":
        return "secondary";
      default:
        return "default";
    }
  };

  const handleDelete = (building: Building) => {
    deleteBuildingMutation.mutate({ id: building.id });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Manajemen Gedung
          </h2>
          <p className="text-muted-foreground mt-1">
            Kelola data gedung dan status prioritas
          </p>
        </div>
        <Button onClick={onAddNew} size="lg" className="w-full md:w-auto">
          <Plus className="mr-2 h-5 w-5" />
          Tambah Gedung Baru
        </Button>
      </div>

      <div className="border rounded-lg bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20 hidden sm:table-cell">Kode</TableHead>
              <TableHead>Nama Gedung</TableHead>
              <TableHead>Status Prioritas</TableHead>
              <TableHead className="text-right hidden sm:table-cell">
                Skor
              </TableHead>
              <TableHead className="hidden md:table-cell">
                Tanggal Update
              </TableHead>
              <TableHead className="text-right w-[120px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Memuat data gedung...
                </TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-destructive">
                  Gagal memuat data: {error.message}
                </TableCell>
              </TableRow>
            )}
            {buildings &&
              buildings.map((building) => (
                <TableRow key={building.id}>
                  <TableCell className="font-medium hidden sm:table-cell">
                    {building.kode_gedung}
                  </TableCell>
                  <TableCell className="font-medium">
                    {building.nama_gedung}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getPriorityBadgeVariant(
                        building.status_prioritas
                      )}
                    >
                      {building.status_prioritas}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold hidden sm:table-cell">
                    {building.skor_akhir}
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell">
                    23 Okt 2025
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(building)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={deleteBuildingMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Konfirmasi Hapus Gedung
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus gedung{" "}
                              <strong>{building.nama_gedung}</strong>? Tindakan
                              ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(building)}>
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
