import { type FC } from "react";
import { TBuilding } from "@/types/building";
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
    <Card className="relative min-w-[300px] bg-background/95 backdrop-blur-md">
      <CardHeader>
        <CardAction>
          <Button
            onClick={onClose}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            aria-label="Close"
            variant={"ghost"}
          >
            <span className="text-muted-foreground text-xl font-light">×</span>
          </Button>
        </CardAction>

        <CardTitle>
          <h3 className="font-bold text-xl">{building.name}</h3>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Collapsible>
          <CollapsibleTrigger asChild>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground capitalize">
                Building Info
              </span>
              <Button variant="ghost" size="icon" className="size-8">
                <ChevronsUpDown />
                <span className="sr-only">Toggle</span>
              </Button>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {Object.entries(building.criterias).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground capitalize">
                  {key.replace(/_/g, " ")}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {value}
                </span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">
            Skor Akhir
          </span>
          <span className="text-2xl font-bold text-foreground">
            {building.score}
          </span>
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Status Prioritas
        </span>
        <Tooltip>
          <TooltipTrigger>
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-bold text-white ${
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
