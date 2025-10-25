import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building } from "@/types/building";
import { Badge } from "@/components/ui/badge";

interface RankingTableProps {
  buildings: Building[];
  isLoading: boolean;
  error: Error | null;
  onBuildingClick?: (building: Building) => void;
}

export const RankingTable = ({
  buildings,
  isLoading,
  error,
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

  const sortedBuildings = [...buildings].sort(
    (a, b) => b.skor_akhir - a.skor_akhir
  );

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
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-24">
                  Memuat data...
                </TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center h-24 text-destructive"
                >
                  Gagal memuat data: {error.message}
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              !error &&
              sortedBuildings.map((building, index) => (
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
                      <span className="font-medium text-sm">
                        {building.nama_gedung}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {building.kode_gedung}
                        </span>
                        <Badge
                          variant={getPriorityBadgeVariant(
                            building.status_prioritas
                          )}
                          className="text-[10px] px-1.5 py-0"
                        >
                          {building.status_prioritas.replace("Prioritas ", "")}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {building.skor_akhir}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};


