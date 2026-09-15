"use client";

import { Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export type TWeightSnapshot = {
  key: string;
  name: string;
  value: number;
  subWeights?: TWeightSnapshot[];
};

export function WeightsPieChart({ weights }: { weights: TWeightSnapshot[] }) {
  // 1. Data untuk Lingkaran Dalam (Parent Weights)
  const innerChartData = weights.map((w) => ({
    key: w.key,
    name: w.name,
    value: Number((w.value * 100).toFixed(2)),
    fill: `var(--color-${w.key})`,
  }));

  // 2. Data untuk Lingkaran Luar (Accumulated SubWeights)
  const hasSubweight = weights.filter(
    (w) => w.subWeights && w.subWeights.length > 0
  );

  const hasNotSubweight = weights.filter(
    (w) => !w.subWeights || w.subWeights.length === 0
  );

  const accumulatedWeights = [
    ...hasNotSubweight,
    ...hasSubweight.flatMap((w) =>
      w.subWeights!.map((sw) => ({
        ...sw,
        value: w.value * sw.value, // Akumulasi value seperti sebelumnya
      }))
    ),
  ];

  const outerChartData = accumulatedWeights
    .map((w) => ({
      key: w.key,
      name: w.name,
      value: Number((w.value * 100).toFixed(2)),
      fill: `var(--color-${w.key})`,
    }))
    .sort((a, b) => a.key.localeCompare(b.key));

  // 3. Build chart config untuk mewarnai Inner dan Outer pie
  const chartConfig = {
    value: {
      label: "Bobot (%)",
    },
  } as ChartConfig;

  const allUniqueItems = [...weights, ...accumulatedWeights].filter(
    (item, index, self) => index === self.findIndex((t) => t.key === item.key)
  ); // Mengambil semua item unik berdasarkan key

  allUniqueItems.forEach((w, index) => {
    chartConfig[w.key] = {
      label: w.name, // Menggunakan name agar muncul nama kategori di tooltip
      color: `var(--chart-${(index % 5) + 1})`,
    };
  });

  return (
    <Card className="flex flex-col md:col-span-1">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-sm">Bobot yang Digunakan</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {weights.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[300px] w-full pb-0"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />

              {/* Pie Dalam: Kategori Utama (Parent) */}
              <Pie
                data={innerChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60} // Menentukan ketebalan pie dalam
              />

              {/* Pie Luar: Sub Kategori (Children) */}
              <Pie
                data={outerChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70} // Diberi jarak 10px dari outerRadius pie pertama
                outerRadius={100} // Batas luar chart
                label={({ payload }) =>
                  (payload.key as string).toUpperCase() +
                  " - " +
                  payload.value +
                  "%"
                }
              />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="text-muted-foreground flex h-[200px] items-center justify-center text-sm">
            Belum ada data bobot
          </div>
        )}
      </CardContent>
    </Card>
  );
}
