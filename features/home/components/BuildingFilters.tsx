import {
  ToggleGroup,
  ToggleGroupHighlight,
  ToggleGroupHighlightItem,
  ToggleGroupItem,
} from "@/components/animate-ui/primitives/radix/toggle-group";
import { PriorityFilter } from "@/types/building";

interface BuildingFiltersProps {
  activeFilter: PriorityFilter;
  onFilterChange: (filter: PriorityFilter) => void;
}

export const BuildingFilters = ({
  activeFilter,
  onFilterChange,
}: BuildingFiltersProps) => {
  const filters: PriorityFilter[] = [
    "Semua",
    "Prioritas Tinggi",
    "Prioritas Sedang",
    "Prioritas Rendah",
  ];

  return (
    <ToggleGroup type="single" defaultValue={activeFilter}>
      <div className="flex flex-col gap-1.5">
        <ToggleGroupHighlight className="bg-accent rounded-lg">
          {filters.map((filter) => (
            <ToggleGroupHighlightItem key={filter} value={filter}>
              <ToggleGroupItem
                value={filter}
                onClick={() => onFilterChange(filter)}
                className="w-full justify-start rounded-lg py-2 text-start px-2 border-accent border"
              >
                {filter}
              </ToggleGroupItem>
            </ToggleGroupHighlightItem>
          ))}
        </ToggleGroupHighlight>
      </div>
    </ToggleGroup>
  );
};
