"use client";

import { ReactNode } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useHome } from "../providers/HomeContext";
// import { useHome } from "@/context/HomeContext";

interface HomeLayoutProps {
  mapSlot: ReactNode;
  sidebarSlot: ReactNode;
  userNavSlot: ReactNode;
}

export function HomeLayout({
  mapSlot,
  sidebarSlot,
  userNavSlot,
}: HomeLayoutProps) {
  const { isSidebarOpen, setIsSidebarOpen } = useHome();

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <section className="absolute inset-0 z-0">{mapSlot}</section>

      <section className="md:hidden">
        <Drawer open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <DrawerTrigger asChild>
            <Button
              variant="default"
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 shadow-2xl px-6"
            >
              <Search className="h-4 w-4 mr-2" />
              Lihat Daftar
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[90vh]">{sidebarSlot}</DrawerContent>
        </Drawer>
      </section>

      <section className="absolute top-4 right-4 z-20 flex items-center gap-3">
        {userNavSlot}
      </section>

      <section className="absolute top-4 left-4 z-10 w-[380px] max-h-[calc(100vh-2rem)] bg-background rounded-lg shadow-xl overflow-hidden flex-col hidden md:flex">
        <div className="flex flex-col flex-1 min-h-0">{sidebarSlot}</div>
      </section>
    </main>
  );
}
