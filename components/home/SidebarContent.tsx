import { Input } from "@/components/ui/input";
import BuildingFilters from "@/components/home/BuildingFilters";
import RankingTable from "@/components/home/RankingTable";
import { Building, PriorityFilter } from "@/types/building";
import { Search } from "lucide-react";

interface SidebarContentProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filter: PriorityFilter;
  setFilter: (value: PriorityFilter) => void;
  filteredBuildings: Building[];
  handleBuildingClick: (building: Building) => void;
}

export default function SidebarContent({ 
  searchQuery, 
  setSearchQuery, 
  filter, 
  setFilter, 
  filteredBuildings, 
  handleBuildingClick 
}: SidebarContentProps) {
  return (
    <>
      {/* Header */}
      <div className="p-4 border-b bg-card">
        <h1 className="text-lg md:text-xl font-bold">
          SPK Prioritas Perawatan Gedung
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          Fakultas Teknik UNNES
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Search Bar */}
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

        {/* Filters */}
        <div className="p-4 border-b">
          <h2 className="text-sm font-semibold mb-3">Filter Prioritas</h2>
          <BuildingFilters activeFilter={filter} onFilterChange={setFilter} />
        </div>

        {/* Ranking Table */}
        <div className="p-4">
          <h2 className="text-sm font-semibold mb-3">Daftar Peringkat</h2>
          <RankingTable buildings={filteredBuildings} onBuildingClick={handleBuildingClick} />
        </div>
      </div>
    </>
  );
}