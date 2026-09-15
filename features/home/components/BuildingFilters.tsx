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
                className="border-accent w-full justify-start rounded-lg border px-2 py-2 text-start"
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
