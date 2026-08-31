// WHY: Admin truth is mutation-driven, not time-driven.
// Overview latest-run uses staleTime: Infinity + explicit invalidation
// on DSS writers (Run / Delete Run / Delete RunDetail).
// See P0-4 §7 — central seam so client + server + invalidation share one truth.
export const queryKeys = {
  dss: {
    all: () => ["dss"] as const,
    list: () => ["dss", "list"] as const,
    latest: () => ["dss", "latest"] as const, // canonical — replaces legacy typo key
    details: (runId: string) => ["dss", "details", runId] as const,
  },
  buildings: {
    all: () => ["buildings"] as const,
    details: (code: string) => ["buildings", "details", code] as const,
  },
  weights: {
    all: () => ["weights"] as const,
  },
} as const;
