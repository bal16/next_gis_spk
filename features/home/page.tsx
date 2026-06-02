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

export default async function HomePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["buildings"],
    queryFn: getBuildingsDatas,
  });

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <section className="absolute inset-0 z-0">
          <MapSection />
        </section>

        <section className="md:hidden">
          <MobileDrawer />
        </section>

        <section className="absolute top-4 right-4 z-20 flex items-center gap-3">
          <UserNav adminLink />
        </section>

        <section className="absolute top-4 left-4 z-10 w-[380px] max-h-[calc(100vh-2rem)] bg-background rounded-lg shadow-xl overflow-hidden flex-col hidden md:flex">
          <Sidebar />
        </section>
      </HydrationBoundary>
    </main>
  );
}
