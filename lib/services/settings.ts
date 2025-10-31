import { weightData } from "@/lib/mock/weights";
import { type Weights } from "@/lib/validators/settings";

// Simulate initial weights data from a server
let currentWeights = weightData;

/**
 * Simulates fetching weights from an API.
 */
export const getWeights = async (): Promise<Weights> => {
  // console.log("Fetching weights...");
  await new Promise((resolve) => setTimeout(resolve, 500));
  return currentWeights;
};

/**
 * Simulates updating weights on the server.
 */
export const updateWeights = async (newWeights: Weights): Promise<Weights> => {
  // console.log("Updating weights...", newWeights);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const total = Object.values(newWeights).reduce(
    (sum, value) => sum + (Number(value) || 0),
    0
  );
  if (Math.round(total) !== 100) {
    throw new Error(`Total bobot harus 100%. Saat ini: ${total}%`);
  }

  currentWeights = newWeights;
  return currentWeights;
};