"use client";

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
import { DataTable } from "./data-table";
import { columns } from "./column";
// import { Progress } from "@/components/ui/progress";
import { MapView } from "@/features/map/components/MapView";
import { WeightsPieChart } from "@/features/dashboard/components/WeightsPieChart";

export const MainContent = ({ runId }: { runId: string }) => {
  const { data } = useQuery({
    queryKey: ["dss-details", runId],
    queryFn: () => getRunDetailsDatas(runId),
    staleTime: Infinity,
  });
  return (
    <div className="space-y-6">
      {/* 1. Header Summary */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Detail Run DSS</h1>
          <p className="text-muted-foreground text-sm">ID Run: {data?.id}</p>
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
