import { buildingsData } from "@/lib/data/gedung";
import type { BuildingFormData } from "@/lib/validators/building";
import { Building } from "@/types/building";

/**
 * Mensimulasikan pengambilan semua data gedung dari API.
 * @returns Promise<Building[]> - Daftar semua gedung.
 */
export const getBuildings = async (): Promise<Building[]> => {
  console.log("Fetching all buildings...");
  // Simulasi penundaan jaringan
  await new Promise(resolve => setTimeout(resolve, 500));
  // Di aplikasi nyata, ini akan menjadi:
  // const response = await fetch('/api/buildings');
  // const data = await response.json();
  // return data;
  return buildingsData;
};

/**
 * Mensimulasikan penambahan gedung baru.
 * @param buildingData - Data gedung baru.
 * @returns Promise<{ success: boolean }>
 */
export const addBuilding = async (buildingData: BuildingFormData): Promise<{ success: boolean }> => {
    // Mengubah data dari form (datar) menjadi struktur data Building (nested)
    const newBuilding: Partial<Building> = {
      nama_gedung: buildingData.nama_gedung,
      kode_gedung: buildingData.kode_gedung,
      kriteria: {
        C1_Usia: buildingData.C1_Usia,
        C2_Kondisi_Struktur: buildingData.C2_Kondisi_Struktur,
        C2_Kondisi_Arsitektural: buildingData.C2_Kondisi_Arsitektural,
        C2_Kondisi_MEP: buildingData.C2_Kondisi_MEP,
        C3_Utilitas: buildingData.C3_Utilitas,
        C4_Dampak: buildingData.C4_Dampak,
      },
      lokasi: {
        lat: buildingData.lat,
        lng: buildingData.lng,
      },
    };
    console.log("Adding new building:", newBuilding);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Logika untuk menambahkan ke `buildingsData` bisa ditambahkan di sini jika perlu
    return { success: true };
};

/**
 * Mensimulasikan pembaruan data gedung.
 * @param buildingId - ID gedung yang akan diperbarui.
 * @param buildingData - Data gedung yang diperbarui dari form.
 * @returns Promise<{ success: boolean }>
 */
export const updateBuilding = async (buildingId: number, buildingData: BuildingFormData): Promise<{ success: boolean }> => {
    const updatedBuilding: Partial<Building> = {
      nama_gedung: buildingData.nama_gedung,
      kode_gedung: buildingData.kode_gedung,
      kriteria: {
        C1_Usia: buildingData.C1_Usia,
        C2_Kondisi_Struktur: buildingData.C2_Kondisi_Struktur,
        C2_Kondisi_Arsitektural: buildingData.C2_Kondisi_Arsitektural,
        C2_Kondisi_MEP: buildingData.C2_Kondisi_MEP,
        C3_Utilitas: buildingData.C3_Utilitas,
        C4_Dampak: buildingData.C4_Dampak,
      },
      lokasi: {
        lat: buildingData.lat,
        lng: buildingData.lng,
      },
    };
    console.log(`Updating building ${buildingId}:`, updatedBuilding);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
};

/**
 * Mensimulasikan penghapusan gedung.
 * @param buildingId - ID gedung yang akan dihapus.
 * @returns Promise<{ success: boolean }>
 */
export const deleteBuilding = async (buildingId: number): Promise<{ success: boolean }> => {
    console.log(`Deleting building ${buildingId}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
};