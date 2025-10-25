import { Button } from "@/components/ui/button";
import { PriorityFilter } from "@/types/building";

interface BuildingFiltersProps {
  activeFilter: PriorityFilter;
  onFilterChange: (filter: PriorityFilter) => void;
}

export const BuildingFilters = ({ activeFilter, onFilterChange }: BuildingFiltersProps) => {
  const filters: PriorityFilter[] = ["Semua", "Prioritas Tinggi", "Prioritas Sedang", "Prioritas Rendah"];

  const getFilterVariant = (filter: PriorityFilter) => {
    return activeFilter === filter ? "default" : "outline";
  };

  return (
    <div className="flex flex-col gap-1.5">
      {filters.map((filter) => (
        <Button
          key={filter}
          variant={getFilterVariant(filter)}
          onClick={() => onFilterChange(filter)}
          size="sm"
          className="w-full justify-start"
        >
          {filter}
        </Button>
      ))}
    </div>
  );
};