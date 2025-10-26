import { Input } from "@/components/ui/input";
import { Building, PriorityFilter } from "@/types/building";
import { Search } from "lucide-react";
import { BuildingFilters } from "./BuildingFilters";
import { RankingTable } from "./RankingTable";

interface SidebarContentProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filter: PriorityFilter;
  setFilter: (value: PriorityFilter) => void;
  filteredBuildings: Building[];
  handleBuildingClick: (building: Building) => void;
  isLoading: boolean;
  error: Error | null;
}

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

interface SidebarSearchProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export const SidebarSearch = ({
  searchQuery,
  setSearchQuery,
}: SidebarSearchProps) => (
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

interface SidebarFiltersProps {
  filter: PriorityFilter;
  setFilter: (value: PriorityFilter) => void;
}

export const SidebarFilters = ({ filter, setFilter }: SidebarFiltersProps) => (
  <div className="p-4 border-b">
    <h2 className="text-sm font-semibold mb-3">Filter Prioritas</h2>
    <BuildingFilters activeFilter={filter} onFilterChange={setFilter} />
  </div>
);

export function SidebarContent(props: SidebarContentProps) {
  const { searchQuery, setSearchQuery, filter, setFilter, ...rankingProps } =
    props;
  return (
    <>
      <SidebarHeader />
      <SidebarSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <SidebarFilters filter={filter} setFilter={setFilter} />
      <div className="p-4">
        <h2 className="text-sm font-semibold mb-3">Daftar Peringkat</h2>
        <RankingTable
          {...rankingProps}
          buildings={rankingProps.filteredBuildings}
        />
      </div>
    </>
  );
}
