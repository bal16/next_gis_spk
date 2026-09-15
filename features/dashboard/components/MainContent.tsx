"use client";

// import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { columns } from "@/features/dss/components/run/column";
import { MapView } from "@/features/map/components/MapView";
import { getLastRunDatas } from "@/features/dss/api/get-last-run";
import { queryKeys } from "@/lib/queryKeys";
import { Badge } from "@/components/ui/badge";
import { WeightsPieChart } from "./WeightsPieChart";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export const MainContent = () => {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.dss.latest(),
    queryFn: getLastRunDatas,
    staleTime: Infinity,
  });

  if (!isLoading && !data) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4 text-center">
        <AlertCircle className="text-muted-foreground h-16 w-16" />
        <h2 className="text-muted-foreground text-2xl font-bold">
          Belum Ada Riwayat Kalkulasi DSS
        </h2>
        <p className="text-muted-foreground max-w-md">
          Sistem belum memiliki data hasil perhitungan SAW. Silahkan jalankan
          kalkulasi terlebih dahulu di menu SAW Calculation untuk melihat
          statistik.
        </p>
        <Link href="/admin/dss">
          <Button variant="default">Jalankan Perhitungan SAW</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Summary */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Last Run Overview</h1>
          <p className="text-muted-foreground text-sm">
            ID Run: {data?.id} | {/* make ddmmyy */}
            {data?.date
              ? new Date(data.date).toLocaleDateString("en-GB")
              : "N/A"}
          </p>
        </div>
        <Badge variant="outline" className="px-4 py-2 text-lg">
          Avg Score: {data?.averageScore.toFixed(2)}
        </Badge>
      </div>

      {/* 2. Statistik Visual */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Snapshot Weights Visualization */}
        <WeightsPieChart weights={data?.snapshotWeights ?? []} />
        {/* Map Preview */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Sebaran Prioritas Gedung</CardTitle>
          </CardHeader>
          <CardContent className="bg-muted flex h-full items-center justify-center rounded-md">
            <MapView
              buildings={
                data?.sawRunDetails.map((detail) => ({
                  id: detail.building.id,
                  code: detail.building.code,
                  name: detail.building.name,
                  longitude: detail.building.longitude,
                  latitude: detail.building.latitude,
                  score: detail.score,
                  // ...detail.building,
                  priority:
                    detail.priority === 1
                      ? "Prioritas Tinggi"
                      : detail.priority === 2
                        ? "Prioritas Sedang"
                        : "Prioritas Rendah",
                  // ...detail.assessment,
                  criterias: {
                    age: detail.assessment.age,
                    structure: detail.assessment.structure,
                    architecture: detail.assessment.architecture,
                    mep: detail.assessment.mep,
                    utility: detail.assessment.utility,
                    damage: detail.assessment.damage,
                    lastMaintenance: detail.assessment.lastMaintenance,
                  },
                })) ?? []
              }
            />
          </CardContent>
        </Card>
      </div>

      {/* 3. Main Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Hasil Perangkingan SAW</CardTitle>
          <CardDescription>
            Daftar gedung diurutkan berdasarkan skor tertinggi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminDataTable
            columns={columns}
            data={data?.sawRunDetails ?? []}
            isLoading={isLoading}
            initialSorting={[{ id: "score", desc: true }]}
            empty={{
              title: "Belum ada perangkingan",
              description: "Belum ada gedung yang diranking pada run terbaru.",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};
