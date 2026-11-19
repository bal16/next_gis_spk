"use client";

import { useState } from "react";
import Link from "next/link";
import { useQueries, useQuery } from "@tanstack/react-query";
import { ArrowRight, Check } from "lucide-react";

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
import { useBuildings } from "@/features/buildings/hooks/useBuildings";
import { getLastRunDatas } from "@/features/dss/api/get-last-run";
import { getWeights } from "@/features/weights/api/get-weights";
import { queryKeys } from "@/lib/queryKeys";

const WEIGHT_TOLERANCE = 0.001;

type ChecklistItem = {
  title: string;
  description: string;
  href?: string;
  opensBuildingDialog?: boolean;
  done: boolean;
};

export const FirstRunChecklist = () => {
  const [buildingDialogOpen, setBuildingDialogOpen] = useState(false);

  const { data: buildings = [], isLoading: isLoadingBuildings } =
    useBuildings();
  const { data: weights = [], isLoading: isLoadingWeights } = useQuery({
    queryKey: queryKeys.weights.all(),
    queryFn: getWeights,
  });
  const { data: latestRun, isLoading: isLoadingRun } = useQuery({
    queryKey: queryKeys.dss.latest(),
    queryFn: getLastRunDatas,
    staleTime: Infinity,
  });

  const assessmentQueries = useQueries({
    queries: buildings.map((building) => ({
      queryKey: ["building-assessments", building.code],
      queryFn: () => getBuildingAssessmentsDatas(building.code),
      staleTime: Infinity,
    })),
  });

  if (
    isLoadingBuildings ||
    isLoadingWeights ||
    isLoadingRun ||
    assessmentQueries.some((query) => query.isLoading)
  ) {
    return null;
  }

  if (latestRun) return null;

  const mainWeights = weights.filter((weight) => !weight.subWeightFrom);
  const totalWeight = mainWeights.reduce(
    (sum, weight) => sum + weight.value,
    0
  );
  const isWeightsReady =
    mainWeights.length > 0 && Math.abs(totalWeight - 1) < WEIGHT_TOLERANCE;
  const hasBuildings = buildings.length > 0;

  const pendingBuildings = buildings.filter(
    (_, index) =>
      (assessmentQueries[index]?.data?.assessments?.length ?? 0) === 0
  );
  const hasAssessments = hasBuildings && pendingBuildings.length === 0;
  const pendingBuildingCode = pendingBuildings[0]?.code;
  const setupIncomplete = !hasBuildings || !hasAssessments || !isWeightsReady;

  if (!setupIncomplete) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Siap Menjalankan SAW</CardTitle>
          <CardDescription>
            Data gedung, penilaian, dan bobot sudah lengkap. Jalankan
            perhitungan untuk melihat peringkat.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/admin/dss">
              Jalankan Perhitungan SAW
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const items: ChecklistItem[] = [
    {
      title: "Tambah Gedung",
      description: "Daftarkan minimal satu gedung yang akan dinilai.",
      opensBuildingDialog: true,
      done: hasBuildings,
    },
    {
      title: "Isi Penilaian",
      description: "Isi kriteria penilaian untuk semua gedung yang terdaftar.",
      href: pendingBuildingCode
        ? `/admin/buildings/${pendingBuildingCode}/assessments?create=true`
        : "/admin/buildings",
      done: hasAssessments,
    },
    {
      title: "Atur Bobot",
      description: "Pastikan total bobot kriteria utama tepat 100%.",
      href: "/admin/weights",
      done: isWeightsReady,
    },
    {
      title: "Jalankan SAW",
      description: "Hitung peringkat setelah semua data siap.",
      href: "/admin/dss",
      done: false,
    },
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Mulai dari Sini</CardTitle>
        <CardDescription>
          Ikuti langkah berikut sebelum menjalankan perhitungan SAW.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {items.map((item, index) => (
            <li
              key={item.title}
              className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center"
            >
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  item.done
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {item.done ? <Check className="size-4" /> : index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{item.title}</p>
                  {item.done && <Badge variant="secondary">Selesai</Badge>}
                </div>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </div>
              {item.opensBuildingDialog ? (
                <Button
                  variant={item.done ? "outline" : "default"}
                  size="sm"
                  className="shrink-0"
                  onClick={() => setBuildingDialogOpen(true)}
                >
                  Buka
                  <ArrowRight data-icon="inline-end" />
                </Button>
              ) : (
                <Button
                  asChild
                  variant={item.done ? "outline" : "default"}
                  size="sm"
                  className="shrink-0"
                >
                  <Link href={item.href ?? "/admin/dss"}>
                    Buka
                    <ArrowRight data-icon="inline-end" />
                  </Link>
                </Button>
              )}
            </li>
          ))}
        </ol>
      </CardContent>

      <BuildingDialog
        open={buildingDialogOpen}
        onOpenChange={setBuildingDialogOpen}
      />
    </Card>
  );
};
