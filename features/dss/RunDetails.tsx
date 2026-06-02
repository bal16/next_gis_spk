import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { SiteHeader } from "@/features/dashboard/components/header";
// import { Button } from "@/components/ui/button";
import { getRunDetailsDatas } from "./api/get-run-details";
import { MainContent } from "./components/run/MainContent";

export default async function RunDetailsPage({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const runId = (await params).runId;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["dss-details", runId],
    queryFn: () => getRunDetailsDatas(runId),
  });

  return (
    <div>
      <SiteHeader
        page={"Run Details"}
        path={[{ pageName: "DSS", url: "/admin/dss" }]}
      />
      <main className="container max-w-7xl mx-auto p-4">
        <HydrationBoundary state={dehydrate(queryClient)}>
          {/* <TableSection /> */}
          <MainContent runId={runId} />
        </HydrationBoundary>
      </main>
    </div>
  );
}
