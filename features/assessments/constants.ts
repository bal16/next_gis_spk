export const SCORE_LABELS: Record<number, string> = {
  1: "Baik",
  2: "Rusak Ringan",
  3: "Rusak Berat",
};

export const SCORE_OPTIONS = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
] as const;

export const SCORE_CRITERIA = [
  { name: "structure", label: "Struktur" },
  { name: "architecture", label: "Arsitektur" },
  { name: "mep", label: "MEP" },
  { name: "utility", label: "Utilitas" },
  { name: "damage", label: "Kerusakan" },
] as const;
