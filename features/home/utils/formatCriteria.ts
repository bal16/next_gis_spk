import { SCORE_LABELS } from "@/features/assessments/constants";

export const CRITERIA_METADATA: Record<
  string,
  { label: string; order: number }
> = {
  structure: { label: "Struktur", order: 1 },
  architecture: { label: "Arsitektur", order: 2 },
  mep: { label: "MEP", order: 3 },
  utility: { label: "Utilitas", order: 4 },
  damage: { label: "Kerusakan", order: 5 },
  age: { label: "Umur Bangunan", order: 6 },
  lastMaintenance: { label: "Pemeliharaan Terakhir", order: 7 },
};

export function formatCriteriaLabel(key: string): string {
  if (CRITERIA_METADATA[key]) {
    return CRITERIA_METADATA[key].label;
  }
  return key.replace(/_/g, " ");
}

export function formatCriteriaValue(key: string, value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (["structure", "architecture", "mep", "utility", "damage"].includes(key)) {
    const num = Number(value);
    if (SCORE_LABELS[num]) {
      return SCORE_LABELS[num];
    }
    return String(value);
  }

  if (key === "age") {
    return `${value} Tahun`;
  }

  if (key === "lastMaintenance") {
    try {
      const date = new Date(value as string | number | Date);
      if (isNaN(date.getTime())) return "-";
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  }

  if (value instanceof Date) {
    return value.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return String(value);
}
