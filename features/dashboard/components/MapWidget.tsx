"use client";

import { getBuildingsDatas } from "@/features/buildings/api/get-all-buildings";
import { MapView } from "@/features/map/components/MapView";
import { useQuery } from "@tanstack/react-query";

export const MapWidget = () => {
  const { data: buildings } = useQuery({
    queryKey: ["buildings"],
    queryFn: getBuildingsDatas,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <section className="border border-muted rounded-2xl w-full h-96 overflow-hidden mt-4">
      <MapView buildings={buildings ?? []} />
    </section>
  );
};
