import { BuildingFormData } from "@/lib/validators/building";
import type { Building } from "@/types/building";

export const buildingFormDTO = (building: Building) => ({
  name: building.name,
  code: building.code,
  age: `${building.criterias.age}`,
  structure: building.criterias.structure,
  architecture: building.criterias.architecture,
  MEP: building.criterias.MEP,
  utility: building.criterias.utility,
  damage: building.criterias.damage,
  lat: building.location.lat,
  lng: building.location.lng,
});

export const buildingResDTO = (building: BuildingFormData) => ({
  name: building.name,
  code: building.code,
  criterias: {
    age: building.age,
    structure: building.structure,
    architecture: building.architecture,
    MEP: building.MEP,
    utility: building.utility,
    damage: building.damage,
  },
  location: {
    lat: building.lat,
    lng: building.lng,
  },
});
