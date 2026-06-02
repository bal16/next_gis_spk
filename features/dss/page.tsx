import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { SiteHeader } from "@/features/dashboard/components/header";
// import { Button } from "@/components/ui/button";
import { TableSection } from "./components/TableSection";
import { getResultDatas } from "./api/get-results";

export default async function DSSPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["dss"],
    queryFn: getResultDatas,
  });

  return (
    <div>
      <SiteHeader page="DSS" />
      <main className="container max-w-7xl mx-auto p-4">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <TableSection />
        </HydrationBoundary>
      </main>
    </div>
  );
}
