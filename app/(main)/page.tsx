import { HomeLayout } from "@/components/home/HomeLayout";
import { MapView, SidebarContent } from "@/components/home";
import { UserNav } from "@/components/UserNav";
import { HomeProvider } from "@/components/providers/HomeContext";

export default function Home() {
  return (
    <HomeProvider>
      <HomeLayout
        mapSlot={<MapView />}
        sidebarSlot={<SidebarContent />}
        userNavSlot={<UserNav adminLink />}
      />
    </HomeProvider>
  );
}
