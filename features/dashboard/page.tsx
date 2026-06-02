import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { SiteHeader } from "./components/header";
import { MainContent } from "./components/MainContent";
import { getLastRunDatas } from "../dss/api/get-last-run";
// import { MapWidget } from "./components/MapWidget";
// import { Button } from "@/components/ui/button";
// import { MainContent } from "./components/MainContent";

export default async function OverviewPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["lastest-run"],
    queryFn: getLastRunDatas,
  });

  return (
    <div>
      <SiteHeader page="Overview" />
      <main className="container max-w-7xl mx-auto p-4">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <MainContent />
        </HydrationBoundary>
      </main>
    </div>
  );
}
