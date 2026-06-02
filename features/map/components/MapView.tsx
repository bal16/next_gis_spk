"use client";

import { useCallback, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { useShallow } from "zustand/react/shallow";

import Map, {
  Marker,
  Popup,
  NavigationControl,
  AttributionControl,
  type MapRef,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

import { AlertCircle, AlertTriangle, CheckCircle, Home, HelpCircle } from "lucide-react";

// import { TBuilding } from "@/types/building";
import { INITIAL_VIEW } from "@/lib/config";
import { cn } from "@/lib/utils";

import { useMapStore } from "@/features/map/store/useMap";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import BuildingPopup from "@/features/home/components/BuildingPopup";
import { useSelectedBuildingStore } from "@/features/home/store/useSelectedBuilding";
import type { TBuilding } from "@/features/buildings/type";

interface MapViewProps {
  buildings: TBuilding[];
}

export const MapView = ({ buildings }: MapViewProps) => {
  const { resolvedTheme } = useTheme();
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef<MapRef>(null);
  const [setMapRef, handleResetMap, handleBuildingClick] = useMapStore(
    useShallow((state) => [
      state.setMapRef,
      state.resetView,
      state.flyToBuilding,
    ]),
  );

  const [selectedBuilding, setSelectedBuilding] = useSelectedBuildingStore(
    useShallow((state) => [state.building, state.setSelectedBuilding]),
  );

  const onMapLoad = useCallback(() => {
    if (mapRef.current) {
      setMapRef(mapRef.current);
    }
    setIsMapLoaded(true);
  }, [setMapRef]);

  const mapStyle =
    resolvedTheme === "dark"
      ? "/styles/liberty-custom-dark.json"
      : "/styles/liberty-custom.json";

  return (
    <div className="w-full h-full relative">
      {!isMapLoaded && (
        <Skeleton className="absolute inset-0 z-50 w-full h-full rounded-none" />
      )}
      <Map
        ref={mapRef}
        initialViewState={INITIAL_VIEW}
        mapStyle={mapStyle}
        onLoad={onMapLoad}
        attributionControl={false}
      >
        <AttributionControl position="bottom-right" compact />

        {/* Horizontal Control Group - Bottom Right */}
        <div className="absolute bottom-10 right-4 z-10 flex items-stretch gap-0 bg-background rounded-lg shadow-lg overflow-hidden border border-border ">
          {/* Reset View Button - Left */}
          <Button
            size="icon"
            variant="ghost"
            className="h-[29px] w-10 rounded-none hover:bg-accent border-r border-border"
            onClick={() => {
              handleResetMap();
              setSelectedBuilding(null);
            }}
            title="Reset View"
          >
            <Home className="h-4 w-4" />
          </Button>

          {/* Navigation Controls - Right (Vertical) */}
          <NavigationControl
            showCompass
            visualizePitch
            position="bottom-right"
          />
        </div>

        {buildings.map((building) => (
          <Marker
            key={building.id}
            longitude={building.longitude}
            latitude={building.latitude}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              handleBuildingClick(building);
              setSelectedBuilding(building);
            }}
          >
            <div className="cursor-pointer transform hover:scale-110 transition-transform">
              {getPriorityIcon(building.priority)}
            </div>
          </Marker>
        ))}

        {selectedBuilding && (
          <Popup
            longitude={selectedBuilding.longitude}
            latitude={selectedBuilding.latitude}
            anchor="top"
            onClose={() => setSelectedBuilding(null)}
            closeButton={false}
            closeOnClick={false}
            className="custom-popup"
            maxWidth="none"
          >
            <BuildingPopup
              building={selectedBuilding}
              onClose={() => setSelectedBuilding(null)}
              getPriorityColor={getPriorityColor}
            />
          </Popup>
        )}
      </Map>
    </div>
  );
};

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "Prioritas Tinggi":
      return (
        <AlertCircle className="w-8 h-8 text-destructive drop-shadow-lg" />
      );
    case "Prioritas Sedang":
      return (
        <AlertTriangle className="w-8 h-8 text-yellow-500 drop-shadow-lg" />
      );
    case "Prioritas Rendah":
      return <CheckCircle className="w-8 h-8 text-green-500 drop-shadow-lg" />;
    case "Belum Dihitung":
    default:
      return <HelpCircle className="w-8 h-8 text-muted-foreground drop-shadow-lg" />;
  }
};

const getPriorityColor = (priority: string) => {
  return cn(
    priority === "Prioritas Tinggi" && "bg-destructive",
    priority === "Prioritas Sedang" && "bg-yellow-500",
    priority === "Prioritas Rendah" && "bg-green-500",
    !["Prioritas Tinggi", "Prioritas Sedang", "Prioritas Rendah"].includes(
      priority,
    ) && "bg-muted",
  );
};

MapView.displayName = "MapView";
