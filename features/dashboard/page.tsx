import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { SiteHeader } from "./components/header";
import { MainContent } from "./components/MainContent";
import { getLastRunDatas } from "../dss/api/get-last-run";
import { getBuildingsDatas } from "../buildings/api/get-all-buildings";
import { getWeights } from "../weights/api/get-weights";
import { queryKeys } from "@/lib/queryKeys";
// import { MapWidget } from "./components/MapWidget";
// import { Button } from "@/components/ui/button";
// import { MainContent } from "./components/MainContent";

export default async function OverviewPage() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.dss.latest(),
      queryFn: getLastRunDatas,
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.buildings.all(),
      queryFn: getBuildingsDatas,
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.weights.all(),
      queryFn: getWeights,
    }),
  ]);

  return (
    <div>
      <SiteHeader page="Overview" />
      <main className="container mx-auto max-w-7xl p-4">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <MainContent />
        </HydrationBoundary>
      </main>
    </div>
  );
}
