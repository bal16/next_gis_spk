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
import { DataTable } from "@/features/dss/components/run/data-table";
import { columns } from "@/features/dss/components/run/column";
import { MapView } from "@/features/map/components/MapView";
import { getLastRunDatas } from "@/features/dss/api/get-last-run";
import { Badge } from "@/components/ui/badge";
import { WeightsPieChart } from "./WeightsPieChart";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export const MainContent = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["lastest-run"],
    queryFn: getLastRunDatas,
    staleTime: Infinity,
  });

  if (!isLoading && !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
        <AlertCircle className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-bold text-muted-foreground">Belum Ada Riwayat Kalkulasi DSS</h2>
        <p className="text-muted-foreground max-w-md">
          Sistem belum memiliki data hasil perhitungan SAW. Silahkan jalankan kalkulasi terlebih dahulu di menu SAW Calculation untuk melihat statistik.
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
        <Badge variant="outline" className="text-lg px-4 py-2">
          Avg Score: {data?.averageScore.toFixed(2)}
        </Badge>
      </div>

      {/* 2. Statistik Visual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Snapshot Weights Visualization */}
        <WeightsPieChart weights={data?.snapshotWeights ?? []} />
        {/* Map Preview */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Sebaran Prioritas Gedung</CardTitle>
          </CardHeader>
          <CardContent className="h-full bg-muted flex items-center justify-center rounded-md">
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
          <DataTable columns={columns} data={data?.sawRunDetails ?? []} />
        </CardContent>
      </Card>
    </div>
  );
};
