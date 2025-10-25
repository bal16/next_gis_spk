"use client";

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
import { Building } from "@/types/building";
import { Pencil, Trash2, Plus } from "lucide-react";
import { deleteBuilding } from "@/api/buildings";
import { toast } from "sonner";

interface DashboardSectionProps {
  buildings: Building[];
  onAddNew: () => void;
  onEdit: (building: Building) => void;
}

export const DashboardSection = ({ buildings, onAddNew, onEdit }: DashboardSectionProps) => {
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

  const handleDelete = async (building: Building) => {
    const promise = deleteBuilding(building.id);
    toast.promise(promise, {
      loading: `Menghapus ${building.nama_gedung}...`,
      success: `${building.nama_gedung} berhasil dihapus.`,
      error: `Gagal menghapus ${building.nama_gedung}.`,
    });
    // Di sini Anda mungkin ingin memuat ulang data setelah berhasil
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Manajemen Gedung</h2>
          <p className="text-muted-foreground mt-1">Kelola data gedung dan status prioritas</p>
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
              <TableHead className="w-[100px]">Kode</TableHead>
              <TableHead>Nama Gedung</TableHead>
              <TableHead>Status Prioritas</TableHead>
              <TableHead className="text-right">Skor</TableHead>
              <TableHead className="hidden md:table-cell">Tanggal Update</TableHead>
              <TableHead className="text-right w-[120px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {buildings.map((building) => (
              <TableRow key={building.id}>
                <TableCell className="font-medium">{building.kode_gedung}</TableCell>
                <TableCell className="font-medium">{building.nama_gedung}</TableCell>
                <TableCell>
                  <Badge variant={getPriorityBadgeVariant(building.status_prioritas)}>{building.status_prioritas}</Badge>
                </TableCell>
                <TableCell className="text-right font-semibold">{building.skor_akhir}</TableCell>
                <TableCell className="text-muted-foreground hidden md:table-cell">23 Okt 2025</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(building)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(building)}><Trash2 className="h-4 w-4" /></Button>
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
