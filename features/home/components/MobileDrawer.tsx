"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import type { TBuilding } from "@/types/building";

import { useFilteredBuildings } from "../hooks/useFIlteredBuildings";
import { SidebarFilters, SidebarHeader, SidebarSearch } from "./SidebarContent";
import { RankingTable } from "./RankingTable";

const MobileDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    filteredBuildings,
    handleBuildingClick: handleFilteredBuildingsClick,
  } = useFilteredBuildings();

  const handleBuildingClick = (building: TBuilding) => {
    handleFilteredBuildingsClick(building);
    setIsOpen(false);
  };

  return (
    <Drawer defaultOpen={isOpen}>
      <DrawerTrigger asChild onClick={() => setIsOpen(true)}>
        <Button
          variant="default"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 shadow-2xl px-6"
        >
          <Search className="h-4 w-4 mr-2" />
          Lihat Daftar
        </Button>
      </DrawerTrigger>
      <DrawerDescription className="hidden">
        Mobile Drawer as Table of Buildings
      </DrawerDescription>
      <DrawerContent className="max-h-[90vh]">
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
          <DrawerTitle>
            <SidebarHeader />
          </DrawerTitle>
          <SidebarSearch />
          <SidebarFilters />
          <div className="p-4">
            <h2 className="text-sm font-semibold mb-3">Daftar Peringkat</h2>
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
