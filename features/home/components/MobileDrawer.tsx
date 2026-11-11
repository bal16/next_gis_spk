"use client";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { TBuilding } from "@/features/buildings/type";

import { useFilteredBuildings } from "../hooks/useFIlteredBuildings";
import { useMobileDrawerStore } from "../store/useMobileDrawer";
import { SidebarFilters, SidebarHeader, SidebarSearch } from "./SidebarContent";
import { RankingTable } from "./RankingTable";

const MobileDrawer = () => {
  const isOpen = useMobileDrawerStore((state) => state.isOpen);
  const setOpen = useMobileDrawerStore((state) => state.setOpen);
  const isTourActive = useMobileDrawerStore((state) => state.isTourActive);

  const {
    filteredBuildings,
    handleBuildingClick: handleFilteredBuildingsClick,
  } = useFilteredBuildings();

  const handleBuildingClick = (building: TBuilding) => {
    handleFilteredBuildingsClick(building);
    setOpen(false);
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={setOpen}
      modal={!isTourActive}
      dismissible={!isTourActive}
    >
      <DrawerTrigger asChild>
        <Button
          variant="default"
          data-tour="mobile-drawer-trigger"
          className="fixed bottom-6 left-1/2 z-20 -translate-x-1/2 px-6 shadow-2xl"
        >
          <Search className="mr-2 h-4 w-4" />
          Lihat Daftar
        </Button>
      </DrawerTrigger>
      <DrawerDescription className="hidden">
        Mobile Drawer as Table of Buildings
      </DrawerDescription>
      <DrawerContent
        className="max-h-[85vh]"
        data-tour="mobile-drawer-content"
        onInteractOutside={isTourActive ? (e) => e.preventDefault() : undefined}
        onEscapeKeyDown={isTourActive ? (e) => e.preventDefault() : undefined}
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <DrawerTitle>
            <SidebarHeader />
          </DrawerTitle>
          <div data-tour="mobile-search-input">
            <SidebarSearch />
          </div>
          <div data-tour="mobile-priority-filters">
            <SidebarFilters />
          </div>
          <div className="p-4">
            <h2
              className="mb-3 inline-block text-sm font-semibold"
              data-tour="mobile-ranking-table"
            >
              Daftar Peringkat
            </h2>
            <RankingTable
              buildings={filteredBuildings}
              onBuildingClick={handleBuildingClick}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileDrawer;
