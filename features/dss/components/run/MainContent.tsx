"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getRunDetailsDatas } from "../../api/get-run-details";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { ShortId } from "@/components/admin/ShortId";
import { columns } from "./column";
// import { Progress } from "@/components/ui/progress";
import { MapView } from "@/features/map/components/MapView";
import { WeightsPieChart } from "@/features/dashboard/components/WeightsPieChart";
import { OverviewSkeleton } from "@/features/dashboard/components/OverviewSkeleton";

export const MainContent = ({ runId }: { runId: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["dss-details", runId],
    queryFn: () => getRunDetailsDatas(runId),
    staleTime: Infinity,
  });

  const rankedRunDetails = useMemo(() => {
    if (!data?.sawRunDetails) return [];
    return [...data.sawRunDetails]
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .map((detail, index) => ({
        ...detail,
        rank: index + 1,
      }));
  }, [data]);

  if (isLoading) {
    return <OverviewSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Summary */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Detail Run DSS</h1>
          <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
            <span>ID Run:</span>
            <ShortId id={data?.id} />
          </div>
        </div>
        <Badge variant="outline" className="px-4 py-2 text-lg">
          Avg Score: {data?.averageScore ? data.averageScore.toFixed(2) : "N/A"}
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
            data={rankedRunDetails}
            isLoading={isLoading}
            initialSorting={[{ id: "score", desc: true }]}
            empty={{
              title: "Belum ada detail",
              description: "Run ini belum memiliki detail perangkingan gedung.",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};
