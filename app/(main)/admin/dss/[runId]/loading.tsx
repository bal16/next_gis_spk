import { OverviewSkeleton } from "@/features/dashboard/components/OverviewSkeleton";

export default function Loading() {
  return (
    <div>
      <div className="border-b px-6 py-4">
        <div className="bg-muted h-6 w-32 animate-pulse rounded" />
      </div>
      <main className="container mx-auto max-w-7xl p-4">
        <OverviewSkeleton />
      </main>
    </div>
  );
}
