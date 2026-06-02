import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { SiteHeader } from "@/features/dashboard/components/header";
// import { Button } from "@/components/ui/button";
import { getBuildingAssessmentsDatas } from "../buildings/api/get-building-assessments";
import { TableSection } from "./components/TableSection";

export default async function AssessmentsPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  // ambil url dari params
  // misal localhost:3000/admin/buildings/E11/assessments, ambil E11 nya
  const buildingCode = (await params).code;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["building-assessments", buildingCode],
    queryFn: () => getBuildingAssessmentsDatas(buildingCode),
  });

  return (
    <div>
      <SiteHeader
        page={`Assessments ${buildingCode}`}
        path={[{ pageName: "Buildings", url: "/admin/buildings" }]}
      />
      <main className="container max-w-7xl mx-auto p-4">
        <HydrationBoundary state={dehydrate(queryClient)}>
          {/* Action Section */}
          {/* <section className="flex justify-end">
          <Button>Add New Building</Button>
        </section> */}
          {/* <BuildingInfoSection /> */}

          {/* Table Section */}

          <TableSection code={buildingCode} />

          {/* <section>INI TABEL</section> */}
        </HydrationBoundary>
      </main>
    </div>
  );
}
