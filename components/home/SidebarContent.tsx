"use client";

import { Input } from "@/components/ui/input";
// import { PriorityFilter } from "@/types/building";
import { Search } from "lucide-react";
import { BuildingFilters } from "./BuildingFilters";
import { RankingTable } from "./RankingTable";
import { useHome } from "../providers/HomeContext";
// import { useHome } from "@/context/HomeContext";

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
  const { searchQuery, setSearchQuery } = useHome();
  return (
    <div className="p-4 border-b">
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
  const { filter, setFilter } = useHome();
  return (
    <div className="p-4 border-b">
      <h2 className="text-sm font-semibold mb-3">Filter Prioritas</h2>
      <BuildingFilters activeFilter={filter} onFilterChange={setFilter} />
    </div>
  );
};

export function SidebarContent() {
  const { buildings, handleBuildingClick, isLoading, error } = useHome();
  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
      <SidebarHeader />
      <SidebarSearch />
      <SidebarFilters />
      <div className="p-4">
        <h2 className="text-sm font-semibold mb-3">Daftar Peringkat</h2>
        <RankingTable
          buildings={buildings}
          onBuildingClick={handleBuildingClick}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}
