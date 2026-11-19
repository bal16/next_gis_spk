"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import Map, {
  AttributionControl,
  Marker,
  NavigationControl,
  type MapRef,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { INITIAL_VIEW } from "@/lib/config";

type Coordinates = {
  latitude: number;
  longitude: number;
};

interface MapPickerProps {
  latitude?: number;
  longitude?: number;
  onChange: (coordinates: Coordinates) => void;
  disabled?: boolean;
}

export function MapPicker({
  latitude,
  longitude,
  onChange,
  disabled = false,
}: MapPickerProps) {
  const { resolvedTheme } = useTheme();
  const mapRef = useRef<MapRef>(null);
  const lastMapUpdate = useRef<Coordinates | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const hasCoordinates =
    latitude != null &&
    longitude != null &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  const updateFromMap = (coordinates: Coordinates) => {
    if (disabled) return;
    lastMapUpdate.current = coordinates;
    onChange(coordinates);
  };

  useEffect(() => {
    if (!hasCoordinates || !mapRef.current) return;

    const last = lastMapUpdate.current;
    if (
      last &&
      Math.abs(last.latitude - latitude!) < 1e-9 &&
      Math.abs(last.longitude - longitude!) < 1e-9
    ) {
      return;
    }

    lastMapUpdate.current = null;
    mapRef.current.easeTo({
      center: [longitude!, latitude!],
      zoom: Math.max(mapRef.current.getZoom(), 15),
      duration: 500,
      essential: true,
    });
  }, [hasCoordinates, latitude, longitude]);

  const mapStyle =
    resolvedTheme === "dark"
      ? "/styles/liberty-custom-dark.json"
      : "/styles/liberty-custom.json";

  const initialViewState = hasCoordinates
    ? { ...INITIAL_VIEW, latitude: latitude!, longitude: longitude!, zoom: 16 }
    : INITIAL_VIEW;

  return (
    <div className="relative h-64 w-full overflow-hidden rounded-md border sm:h-72">
      {!isLoaded && (
        <Skeleton className="absolute inset-0 z-50 h-full w-full rounded-none" />
      )}
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        mapStyle={mapStyle}
        onLoad={() => setIsLoaded(true)}
        onClick={(event) =>
          updateFromMap({
            latitude: event.lngLat.lat,
            longitude: event.lngLat.lng,
          })
        }
        attributionControl={false}
        interactive={!disabled}
      >
        <AttributionControl position="bottom-right" compact />
        <NavigationControl position="top-right" showCompass={false} />
        {hasCoordinates && (
          <Marker
            longitude={longitude!}
            latitude={latitude!}
            anchor="bottom"
            draggable={!disabled}
            onDragEnd={(event) =>
              updateFromMap({
                latitude: event.lngLat.lat,
                longitude: event.lngLat.lng,
              })
            }
          >
            <MapPin className="text-primary size-8 cursor-grab fill-current drop-shadow-lg active:cursor-grabbing" />
          </Marker>
        )}
      </Map>
    </div>
  );
}
