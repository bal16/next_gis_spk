import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { SiteHeader } from "@/features/dashboard/components/header";
// import { TableSection } from "./components/TableSection";
import { getWeights } from "./api/get-weights";
import { WeightsUpdateSection } from "./components/WeightsUpdateSection";

export default async function OverviewPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["weights"],
    queryFn: getWeights,
  });

  return (
    <div>
      <SiteHeader page="Weights" />
      <main className="container max-w-7xl mx-auto p-4">
        <HydrationBoundary state={dehydrate(queryClient)}>
          {/* <TableSection /> */}
          <WeightsUpdateSection />
        </HydrationBoundary>
      </main>
    </div>
  );
}
