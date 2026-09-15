import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

import MapSection from "@/features/home/components/MapSection";
import MobileDrawer from "@/features/home/components/MobileDrawer";
import Sidebar from "@/features/home/components/Sidebar";

import { UserNav } from "@/components/UserNav";
import { getBuildingsDatas } from "@/features/buildings/api/get-all-buildings";
import { TourTriggers } from "@/features/tour/triggers";

export default async function HomePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["buildings"],
    queryFn: getBuildingsDatas,
  });

  return (
    <main className="relative h-screen w-full overflow-hidden">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <section className="absolute inset-0 z-0" data-tour="map">
          <MapSection />
        </section>

        <section className="md:hidden">
          <MobileDrawer />
        </section>

        <section className="absolute top-4 right-4 z-20 flex items-center gap-3">
          <TourTriggers page="public" />
          <UserNav adminLink />
        </section>

        <section className="bg-background absolute top-4 left-4 z-10 hidden max-h-[calc(100vh-2rem)] w-[380px] flex-col overflow-hidden rounded-lg shadow-xl md:flex">
          <Sidebar />
        </section>
      </HydrationBoundary>
    </main>
  );
}
