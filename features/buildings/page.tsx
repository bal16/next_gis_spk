import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { SiteHeader } from "@/features/dashboard/components/header";
import { getBuildingsDatas } from "./api/get-all-buildings";
import { TableSection } from "./components/TableSection";

export default async function BuildingsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["buildings"],
    queryFn: getBuildingsDatas,
  });

  return (
    <div>
      <SiteHeader page="Buildings" />
      <main className="container max-w-7xl mx-auto p-4">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <TableSection />
        </HydrationBoundary>
      </main>
    </div>
  );
}
