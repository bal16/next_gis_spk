import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TBuilding } from "@/types/building";
import { Badge } from "@/components/ui/badge";

interface RankingTableProps {
  buildings: TBuilding[];
  onBuildingClick?: (building: TBuilding) => void;
}

export const RankingTable = ({
  buildings,
  onBuildingClick,
}: RankingTableProps) => {
  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "Prioritas Tinggi":
        return "destructive";
      case "Prioritas Sedang":
        return "default";
      case "Prioritas Rendah":
        return "secondary";
      default:
        return "default";
    }
  };

  const sortedBuildings = [...buildings].sort((a, b) => b.score - a.score);

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">No</TableHead>
              <TableHead className="min-w-[140px]">Gedung</TableHead>
              <TableHead className="text-right w-16">Skor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedBuildings.map((building, index) => (
              <TableRow
                key={building.id}
                className={
                  onBuildingClick ? "cursor-pointer hover:bg-muted/50" : ""
                }
                onClick={() => onBuildingClick?.(building)}
              >
                <TableCell className="font-medium">#{index + 1}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-sm">{building.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {building.code}
                      </span>
                      <Badge
                        variant={getPriorityBadgeVariant(building.priority)}
                        className="text-[10px] px-1.5 py-0"
                      >
                        {building.priority.replace("Prioritas ", "")}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {building.score}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
