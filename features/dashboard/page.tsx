import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { SiteHeader } from "./components/header";
import { getLastResults } from "../home/api/get-last-results";
import { MapWidget } from "./components/MapWidget";
import { Button } from "@/components/ui/button";

export default async function OverviewPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["buildings"],
    queryFn: getLastResults,
  });

  return (
    <div>
      <SiteHeader name="Overview" />
      <main className="container max-w-7xl mx-auto p-4">
        <HydrationBoundary state={dehydrate(queryClient)}>
          {/* Stats card section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard title="Total Users" value="1,234" />
            <StatCard title="Active Sessions" value="567" />
            <StatCard title="Server Uptime" value="99.9%" />
          </section>

          {/* Map section */}
          <MapWidget />
          {/* Quick Action section */}
          <section>
            <div className="mt-8 p-4 border border-muted rounded-2xl">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="">Add New Building</Button>
                <Button className="">Generate Report</Button>
                <Button className="">Manage Users</Button>
              </div>
            </div>
          </section>
        </HydrationBoundary>
      </main>
    </div>
  );
}

const StatCard = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="px-4 py-6  border border-muted rounded-2xl">
      <h3 className="text-sm text-muted-foreground">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};
