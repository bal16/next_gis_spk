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

import { TBuilding } from "@/features/buildings/type";

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
          className="fixed bottom-6 left-1/2 z-20 -translate-x-1/2 px-6 shadow-2xl"
        >
          <Search className="mr-2 h-4 w-4" />
          Lihat Daftar
        </Button>
      </DrawerTrigger>
      <DrawerDescription className="hidden">
        Mobile Drawer as Table of Buildings
      </DrawerDescription>
      <DrawerContent className="max-h-[90vh]">
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <DrawerTitle>
            <SidebarHeader />
          </DrawerTitle>
          <SidebarSearch />
          <SidebarFilters />
          <div className="p-4">
            <h2 className="mb-3 text-sm font-semibold">Daftar Peringkat</h2>
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
