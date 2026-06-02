"use server";
import { publicClient } from "@/lib/api/public";
import type { TBuilding, TGetBuildingsResponse } from "../type";
import type { SuccessResponse } from "@/types/apiResponse";
// import { buildingsData } from "@/lib/mock/buildings";

export const getBuildingsDatas = async (): Promise<TBuilding[]> => {
  // await new Promise((resolve) => setTimeout(resolve, 500));
  const response =
    await publicClient.get<SuccessResponse<TGetBuildingsResponse[]>>(
      "/buildings",
    );
  const data = response.data;
  const { data: buildings } = data;
  // di BE building.assessments di fe diubah menjadi building.criterias
  return buildings.map((b) => ({
    ...b,
    criterias: {
      age: b.sawRunDetails?.[0]?.assessment.age,
      structure: b.sawRunDetails?.[0]?.assessment.structure,
      architecture: b.sawRunDetails?.[0]?.assessment.architecture,
      mep: b.sawRunDetails?.[0]?.assessment.mep,
      utility: b.sawRunDetails?.[0]?.assessment.utility,
      damage: b.sawRunDetails?.[0]?.assessment.damage,
      lastMaintenance: b.sawRunDetails?.[0]?.assessment.lastMaintenance,
    },
    priority:
      b.sawRunDetails?.[0]?.priority === 1
        ? "Prioritas Rendah"
        : b.sawRunDetails?.[0]?.priority === 2
          ? "Prioritas Sedang"
          : b.sawRunDetails?.[0]?.priority === 3
            ? "Prioritas Tinggi"
            : "Belum Dihitung",
    score: b.sawRunDetails?.[0]?.score,
  }));
};
