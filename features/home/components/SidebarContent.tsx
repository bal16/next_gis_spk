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
  <div className="p-4 border-b bg-card">
    <h1 className="text-lg md:text-xl font-bold">
      SPK Prioritas Perawatan Gedung
    </h1>
    <p className="text-xs md:text-sm text-muted-foreground">
      Fakultas Teknik UNNES
    </p>
  </div>
);

export const SidebarSearch = () => {
  const [searchQuery, setSearchQuery] = useSearchStore(
    useShallow((state) => [state.query, state.setQuery])
  );

  return (
    <div className="p-4 border-b" data-tour="search-input">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
    <div className="p-4 border-b" data-tour="priority-filters">
      <h2 className="text-sm font-semibold mb-3">Filter Prioritas</h2>
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
    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
      <SidebarHeader />
      <SidebarSearch />
      <SidebarFilters />
      <div className="p-4" data-tour="ranking-table">
        <h2 className="text-sm font-semibold mb-3">Daftar Peringkat</h2>
        <RankingTable
          buildings={buildings}
          onBuildingClick={handleBuildingClick}
        />
      </div>
    </div>
  );
}
