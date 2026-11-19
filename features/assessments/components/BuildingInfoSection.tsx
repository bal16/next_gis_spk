"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getBuildingAssessmentsDatas } from "@/features/buildings/api/get-building-assessments";
import { BuildingDialog } from "@/features/buildings/components/BuildingDialog";
import { useDeleteBuilding } from "@/features/buildings/hooks/useBuildings";
import { ConfirmationDialog } from "@/features/dashboard/components/ConfirmationDialog";

export function BuildingInfoSection({ code }: { code: string }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data: building, isLoading } = useQuery({
    queryKey: ["building-assessments", code],
    queryFn: () => getBuildingAssessmentsDatas(code),
    staleTime: Infinity,
  });

  const { mutateAsync: deleteBuilding, isPending } = useDeleteBuilding(() => {
    router.push("/admin/buildings");
  });

  if (isLoading || !building) return null;

  const assessmentCount = building.assessments?.length ?? 0;
  const mapsUrl = `https://www.google.com/maps?q=${building.latitude},${building.longitude}`;

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="flex flex-wrap items-center gap-2">
            {building.name}
            <Badge variant="outline">{building.code}</Badge>
          </CardTitle>
          <CardDescription>
            Ringkasan gedung dan status penilaiannya.
          </CardDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil data-icon="inline-start" />
            Edit Gedung
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 data-icon="inline-start" />
            Hapus Gedung
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm md:grid-cols-4">
          <div>
            <dt className="text-muted-foreground">Kode</dt>
            <dd className="mt-1 font-medium">{building.code}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Nama</dt>
            <dd className="mt-1 font-medium">{building.name}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Koordinat</dt>
            <dd className="mt-1 font-medium">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 underline underline-offset-4"
              >
                {building.latitude}, {building.longitude}
                <ExternalLink className="size-3" />
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Status Assessment</dt>
            <dd className="mt-1">
              <Badge
                variant={assessmentCount > 0 ? "secondary" : "destructive"}
                className={
                  assessmentCount > 0
                    ? undefined
                    : "border-transparent bg-amber-500 text-white hover:bg-amber-600"
                }
              >
                {assessmentCount > 0
                  ? `${assessmentCount} penilaian`
                  : "Belum dinilai"}
              </Badge>
            </dd>
          </div>
        </dl>
      </CardContent>

      <BuildingDialog
        variant="edit"
        initialData={building}
        buildingId={building.id}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
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
    </Card>
  );
}
