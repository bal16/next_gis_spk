"use client";

import { useFilteredBuildings } from "../hooks/useFIlteredBuildings";
import { MapView } from "../../map/components/MapView";

const MapSection = () => {
  const { filteredBuildings } = useFilteredBuildings();

  return <MapView buildings={filteredBuildings} />;
};

export default MapSection;
