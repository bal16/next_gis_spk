"use client";

import { Search } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { Input } from "@/components/ui/input";
import { BuildingFilters } from "./BuildingFilters";
import { RankingTable } from "./RankingTable";
import { useSearchStore } from "@/features/home/store/useSearch";
import { useFilterStore } from "@/features/home/store/useFilter";
import type { TBuilding } from "@/features/buildings/type";

export const SidebarHeader = () => (
  <div className="bg-card border-b p-4">
    <h1 className="text-lg font-bold md:text-xl">
      SPK Prioritas Perawatan Gedung
    </h1>
    <p className="text-muted-foreground text-xs md:text-sm">
      Fakultas Teknik UNNES
    </p>
  </div>
);

export const SidebarSearch = () => {
  const [searchQuery, setSearchQuery] = useSearchStore(
    useShallow((state) => [state.query, state.setQuery])
  );

  return (
    <div className="border-b p-4" data-tour="search-input">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
        <Input
          type="text"
          placeholder="Cari gedung (nama/kode)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
};

export const SidebarFilters = () => {
  const [filter, setFilter] = useFilterStore(
    useShallow((state) => [state.filter, state.setFilter])
  );
  return (
    <div className="border-b p-4" data-tour="priority-filters">
      <h2 className="mb-3 text-sm font-semibold">Filter Prioritas</h2>
      <BuildingFilters activeFilter={filter} onFilterChange={setFilter} />
    </div>
  );
};

interface SidebarContentProps {
  buildings: TBuilding[];
  onBuildingSelect: (building: TBuilding) => void;
}
export function SidebarContent({
  buildings,
  onBuildingSelect: handleBuildingClick,
}: SidebarContentProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <SidebarHeader />
      <SidebarSearch />
      <SidebarFilters />
      <div className="p-4" data-tour="ranking-table">
        <h2 className="mb-3 text-sm font-semibold">Daftar Peringkat</h2>
        <RankingTable
          buildings={buildings}
          onBuildingClick={handleBuildingClick}
        />
      </div>
    </div>
  );
}
