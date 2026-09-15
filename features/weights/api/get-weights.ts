"use server";
// import { publicClient } from "@/lib/api/public";
import backendClient from "@/lib/api/server";
import type { SuccessResponse } from "@/types/apiResponse";
// import { weightData } from "@/lib/mock/weights";
// import { type Weights } from "@/lib/validators/settings";

// Simulate initial weights data from a server
export type TWeight = {
  key: string;
  name: string;
  value: number;
  type: string;
  subWeightFrom?: string;
  subWeights: TWeight[];
};

// type TGetWeightsResponse = {
//   data: {

//   };
// };

/**
 * Simulates fetching weights from an API.
 */
// export const getWeights = async (): Promise<Weights> => {
export const getWeights = async () => {
  // console.log("Fetching weights...");
  // await new Promise((resolve) => setTimeout(resolve, 500));
  const response =
    await backendClient.get<SuccessResponse<TWeight[]>>("/dss/weights");
  const { data } = response.data;

  //transform data sehingga yang punya subWeight ditaruh di index terakhir
  // const hasSubWeights = data.filter((item) => item.subWeights.length > 0);
  // const mainWeights = data.filter((item) => item.subWeights.length === 0);
  // // console.log("Get weights response:", data);
  // const sortedData =
  //   hasSubWeights.length !== 0
  //     ? [
  //         ...mainWeights,
  //         ...hasSubWeights.sort((a, b) =>
  //           a.subWeightFrom!.localeCompare(b.subWeightFrom!),
  //         ),
  //       ]
  //     : mainWeights;

  // return weightData;
  // return { mainWeights, hasSubWeights, sortedData };
  return data;
};
