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
    <section className="border-muted mt-4 h-96 w-full overflow-hidden rounded-2xl border">
      <MapView buildings={buildings ?? []} />
    </section>
  );
};
