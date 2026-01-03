import { buildingsData } from "@/lib/mock/buildings";
import type { TBuilding } from "@/types/building";

export const getBuildings = async (): Promise<TBuilding[]> => {
  // console.log("Fetching all buildings...");
  // Simulasi penundaan jaringan
  await new Promise((resolve) => setTimeout(resolve, 500));
  // Di aplikasi nyata, ini akan menjadi:
  // const response = await fetch('/api/buildings');
  // const data = await response.json();
  // return data;
  return buildingsData;
};
