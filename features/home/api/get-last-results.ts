import { buildingsData } from "@/lib/mock/buildings";
import type { TBuilding } from "@/types/building";

export const getLastResults = async (): Promise<TBuilding[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  // Di aplikasi nyata, ini akan menjadi:
  // const response = await publicClient.get("/dss/results");
  // const data = await response.data;
  // return data.data as TBuilding[];
  return buildingsData;
};
