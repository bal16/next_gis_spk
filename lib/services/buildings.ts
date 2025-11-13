import { buildingsData } from "@/lib/mock/buildings";
import { buildingResDTO } from "@/lib/dto";
import { BuildingFormData } from "@/lib/validators/building";
import { Building } from "@/types/building";




/**
 * Mensimulasikan pengambilan semua data gedung dari API.
 * @returns Promise<Building[]> - Daftar semua gedung.
 */
export const getBuildings = async (): Promise<Building[]> => {
  // console.log("Fetching all buildings...");
  // Simulasi penundaan jaringan
  await new Promise(resolve => setTimeout(resolve, 500));
  // Di aplikasi nyata, ini akan menjadi:
  // const response = await fetch('/api/buildings');
  // const data = await response.json();
  // return data;
  return buildingsData;
};


export const getBuildingById = async (id: number): Promise<Building | undefined> => {
  // console.log(`Fetching building with ID ${id}...`);
  await new Promise(resolve => setTimeout(resolve, 500));
  return buildingsData.find(building => building.id === id);
};


/**
 * Mensimulasikan penambahan gedung baru.
 * @param buildingData - Data gedung baru.
 * @returns Promise<{ success: boolean }>
 */
export const addBuilding = async (buildingData: BuildingFormData): Promise<Building> => {
    // Mengubah data dari form (datar) menjadi struktur data Building (nested)
    const newBuildingData: Omit<Building, 'id' | 'score' | 'priority'> = buildingResDTO(buildingData);
    
    // Simulasi penambahan ke database
    const newId = Math.max(...buildingsData.map(b => b.id)) + 1;
    const newBuildingWithId: Building = {
      ...newBuildingData,
      id: newId,
      // Skor dan status akan dihitung di backend pada aplikasi nyata
      score: Math.random() * 100, 
      priority: "Prioritas Sedang",
    };

    // console.log("Adding new building:", newBuildingWithId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // buildingsData.push(newBuildingWithId); // Uncomment untuk memodifikasi data di memori
    return newBuildingWithId;
};

/**
 * Mensimulasikan pembaruan data gedung.
 * @param buildingId - ID gedung yang akan diperbarui.
 * @param buildingData - Data gedung yang diperbarui dari form.
 * @returns Promise<{ success: boolean }>
 */
export const updateBuilding = async (buildingId: number, buildingData: BuildingFormData): Promise<Building> => {
    const updatedBuildingData: Omit<Building, 'id' | 'score' | 'priority'> = buildingResDTO(buildingData);
    
    const existingBuilding = buildingsData.find(b => b.id === buildingId);
    if (!existingBuilding) {
      throw new Error("Building not found");
    }

    const updatedBuilding = { ...existingBuilding, ...updatedBuildingData };
    // console.log(`Updating building ${buildingId}:`, updatedBuildingData);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return updatedBuilding;
};

/**
 * Mensimulasikan penghapusan gedung.
 * @param buildingId - ID gedung yang akan dihapus.
 * @returns Promise<{ success: boolean }>
 */
export const deleteBuilding = async (buildingId: number): Promise<{ success: boolean }> => {
    // console.log(`Deleting building ${buildingId}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
};
