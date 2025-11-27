"use client";

import { useState, useRef, useMemo } from "react";
import { Search } from "lucide-react";
import { Building, PriorityFilter } from "@/types/building";

import { useBuildings } from "@/hooks/useBuildings";

import {
  MapView,
  SidebarFilters,
  SidebarHeader,
  SidebarSearch,
  RankingTable,
  type MapViewRef,
} from "@/components/home";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { UserNav } from "@/components/UserNav";

export default function Home() {
  const mapRef = useRef<MapViewRef>(null);
  const { data: buildings, isLoading, error } = useBuildings();
  const [filter, setFilter] = useState<PriorityFilter>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [, setIsSidebarOpen] = useState(false);

  const filteredBuildings = useMemo(() => {
    if (!buildings) return [];
    return buildings
      .filter((building) => {
        const matchesFilter =
          filter === "Semua" || building.priority === filter;
        const matchesSearch =
          building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          building.code.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => b.score - a.score);
  }, [buildings, filter, searchQuery]);

  const handleBuildingClick = (building: Building) => {
    mapRef.current?.flyToBuilding(building);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Fullscreen Map */}
      <div className="absolute inset-0 z-0">
        <MapView ref={mapRef} buildings={filteredBuildings} />
      </div>

      {/* Mobile Bottom Dock - Hidden on Desktop */}
      <div className="md:hidden">
        <Drawer>
          <DrawerTitle>
            <DrawerTrigger asChild>
              <Button
                variant="default"
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 shadow-2xl px-6"
              >
                <Search className="h-4 w-4 mr-2" />
                Lihat Daftar
              </Button>
            </DrawerTrigger>
          </DrawerTitle>
          <DrawerContent className="max-h-[90vh]">
            <div className="overflow-y-auto">
              <SidebarHeader />
              <SidebarSearch
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <SidebarFilters filter={filter} setFilter={setFilter} />
              <div className="p-4">
                <h2 className="text-sm font-semibold mb-3">Daftar Peringkat</h2>
                <RankingTable
                  buildings={filteredBuildings}
                  onBuildingClick={handleBuildingClick}
                  isLoading={isLoading}
                  error={error}
                />
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Admin & USER Controls - Top Right */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
        <UserNav adminLink />
      </div>

      {/* Desktop Floating Sidebar - Hidden on Mobile */}
      <div className="absolute top-4 left-4 z-10 w-[380px] max-h-[calc(100vh-2rem)] bg-background rounded-lg shadow-xl overflow-hidden flex-col hidden md:flex">
        <SidebarHeader />
        <div className="flex-1 overflow-y-auto">
          <SidebarSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <SidebarFilters filter={filter} setFilter={setFilter} />
          <div className="p-4">
            <h2 className="text-sm font-semibold mb-3">Daftar Peringkat</h2>
            <RankingTable
              buildings={filteredBuildings}
              onBuildingClick={handleBuildingClick}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
