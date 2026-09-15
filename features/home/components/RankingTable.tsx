import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TBuilding } from "@/features/buildings/type";
import { Badge } from "@/components/ui/badge";
import { Activity } from "react";

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
    <div className="overflow-hidden rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">No</TableHead>
              <TableHead className="min-w-[140px]">Gedung</TableHead>
              <TableHead className="w-16 text-right">Skor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedBuildings.map((building, index) => (
              <TableRow
                key={building.id}
                className={
                  onBuildingClick ? "hover:bg-muted/50 cursor-pointer" : ""
                }
                onClick={() => onBuildingClick?.(building)}
              >
                <TableCell className="font-medium">#{index + 1}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">{building.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">
                        {building.code}
                      </span>
                      <Badge
                        variant={getPriorityBadgeVariant(building.priority)}
                        className="px-1.5 py-0 text-[10px]"
                      >
                        {building.priority.replace("Prioritas ", "")}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {building.score?.toFixed(2) || "N/A"}
                </TableCell>
              </TableRow>
            ))}
            <Activity mode={sortedBuildings.length == 0 ? "visible" : "hidden"}>
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-muted-foreground py-4 text-center"
                >
                  <span>Not found</span>
                </TableCell>
              </TableRow>
            </Activity>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
