import { type FC } from "react";
// import { TBuilding } from "@/types/building";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/animate-ui/primitives/radix/collapsible";
import { ChevronsUpDown } from "lucide-react";
import type { TBuilding } from "@/features/buildings/type";

interface Props {
  building: TBuilding;
  onClose: () => void;
  getPriorityColor?: (priority: string) => string;
}

export const BuildingPopup: FC<Props> = ({
  building,
  onClose,
  getPriorityColor,
}) => {
  return (
    <Card className="bg-background/95 relative min-w-[300px] backdrop-blur-md">
      <CardHeader>
        <CardAction>
          <Button
            onClick={onClose}
            className="hover:bg-muted absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full transition-colors"
            aria-label="Close"
            variant={"ghost"}
          >
            <span className="text-muted-foreground text-xl font-light">×</span>
          </Button>
        </CardAction>

        <CardTitle>
          <h3 className="text-xl font-bold">{building.name}</h3>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Collapsible>
          <CollapsibleTrigger asChild>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-muted-foreground text-sm capitalize">
                Building Info
              </span>
              <Button variant="ghost" size="icon" className="size-8">
                <ChevronsUpDown />
                <span className="sr-only">Toggle</span>
              </Button>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {/* beri fallback ketika null (belum di ada history run) */}
            {Object.entries(building.criterias).map(([key, value]) => (
              <div key={key} className="mb-2 flex items-center justify-between">
                <span className="text-muted-foreground text-sm capitalize">
                  {key.replace(/_/g, " ")}
                </span>
                <span className="text-foreground text-sm font-medium">
                  {value instanceof Date
                    ? value.toLocaleDateString()
                    : value === null || value === undefined
                      ? "N/A"
                      : String(value)}
                </span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm font-medium">
            Skor Akhir
          </span>
          <span className="text-foreground text-2xl font-bold">
            {building.score?.toFixed(2) || "N/A"}
          </span>
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="justify-between">
        <span className="text-muted-foreground text-sm font-medium">
          Status Prioritas
        </span>
        <Tooltip>
          <TooltipTrigger>
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-bold text-white ${
                getPriorityColor?.(building.priority) ?? "bg-muted"
              }`}
            >
              {building.priority} <small>?</small>
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {building.priority === "Prioritas Tinggi" && (
              <p>
                Prioritas Tinggi: Gedung ini memerlukan perhatian segera untuk
                perbaikan atau pemeliharaan.
              </p>
            )}
            {building.priority === "Prioritas Sedang" && (
              <p>
                Prioritas Sedang: Gedung ini perlu diperhatikan dalam waktu
                dekat.
              </p>
            )}
            {building.priority === "Prioritas Rendah" && (
              <p>
                Prioritas Rendah: Gedung ini dalam kondisi baik, namun tetap
                perlu pemantauan rutin.
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </CardFooter>
    </Card>
  );
};

export default BuildingPopup;
