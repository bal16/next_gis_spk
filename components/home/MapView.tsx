import { useRef, useState, useImperativeHandle, forwardRef } from "react";

import { useTheme } from "next-themes";

import Map, {
  Marker,
  Popup,
  NavigationControl,
  MapRef,
} from "react-map-gl/maplibre";

import "maplibre-gl/dist/maplibre-gl.css";

import { Building } from "@/types/building";

import { AlertCircle, AlertTriangle, CheckCircle, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

import { INITIAL_VIEW } from "@/lib/config";

import BuildingPopup from "./BuildingPopup";

interface MapViewProps {
  buildings: Building[];
}

export interface MapViewRef {
  flyToBuilding: (building: Building) => void;
  resetView: () => void;
}

export const MapView = forwardRef<MapViewRef, MapViewProps>(
  ({ buildings }, ref) => {
    const mapRef = useRef<MapRef>(null);
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
      null
    );
    const { resolvedTheme } = useTheme();

    useImperativeHandle(ref, () => ({
      flyToBuilding: (building: Building) => {
        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [building.lokasi.lng, building.lokasi.lat],
            zoom: 18,
            duration: 1000,
            essential: true,
          });
          setTimeout(() => {
            setSelectedBuilding(building);
          }, 1000);
        }
      },
      resetView: () => {
        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [INITIAL_VIEW.longitude, INITIAL_VIEW.latitude],
            zoom: INITIAL_VIEW.zoom,
            duration: 1500,
            essential: true,
          });
          setSelectedBuilding(null);
        }
      },
    }));

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
          return (
            <CheckCircle className="w-8 h-8 text-green-500 drop-shadow-lg" />
          );
        default:
          return <CheckCircle className="w-8 h-8 drop-shadow-lg" />;
      }
    };

    // priority color helper passed to BuildingPopup
    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case "Prioritas Tinggi":
          return "bg-destructive";
        case "Prioritas Sedang":
          return "bg-yellow-500";
        case "Prioritas Rendah":
          return "bg-green-500";
        default:
          return "bg-muted";
      }
    };

    const mapStyle =
      resolvedTheme === "dark"
        ? "/styles/liberty-custom-dark.json"
        : "/styles/liberty-custom.json";

    return (
      <div className="w-full h-full relative">
        <Map
          ref={mapRef}
          initialViewState={INITIAL_VIEW}
          mapStyle={mapStyle}
          attributionControl={{ compact: true }}
        >
          {/* Horizontal Control Group - Bottom Right */}
          <div className="absolute bottom-10 right-4 z-10 flex items-stretch gap-0 bg-background rounded-lg shadow-lg overflow-hidden border border-border">
            {/* Reset View Button - Left */}
            <Button
              size="icon"
              variant="ghost"
              className="h-[29px] w-10 rounded-none hover:bg-accent border-r border-border"
              onClick={() => {
                if (mapRef.current) {
                  mapRef.current.flyTo({
                    center: [INITIAL_VIEW.longitude, INITIAL_VIEW.latitude],
                    zoom: INITIAL_VIEW.zoom,
                    duration: 1000,
                    essential: true,
                  });
                  setSelectedBuilding(null);
                }
              }}
              title="Reset View"
            >
              <Home className="h-4 w-4" />
            </Button>

            {/* Navigation Controls - Right (Vertical) */}
            {/* <div className="maplibregl-ctrl-group"> */}
            <NavigationControl
              showCompass
              visualizePitch
              style={{
                color: "yellow",
              }}
              position="bottom-right"
            />
            {/* </div> */}
          </div>

          {buildings.map((building) => (
            <Marker
              key={building.id}
              longitude={building.lokasi.lng}
              latitude={building.lokasi.lat}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedBuilding(building);
              }}
            >
              <div className="cursor-pointer transform hover:scale-110 transition-transform">
                {getPriorityIcon(building.status_prioritas)}
              </div>
            </Marker>
          ))}

          {selectedBuilding && (
            <Popup
              longitude={selectedBuilding.lokasi.lng}
              latitude={selectedBuilding.lokasi.lat}
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
  }
);

MapView.displayName = "MapView";
