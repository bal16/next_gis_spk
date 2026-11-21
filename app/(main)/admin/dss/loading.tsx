import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      {/* SiteHeader Placeholder */}
      <div className="border-b px-6 py-4">
        <div className="bg-muted h-6 w-32 animate-pulse rounded" />
      </div>
      <main className="container mx-auto max-w-7xl p-4">
        <div className="space-y-4">
          {/* Action Bar */}
          <div className="flex items-center justify-end">
            <Skeleton className="h-9 w-48 rounded-md" />
          </div>

          {/* Table Outline */}
          <div className="overflow-hidden rounded-md border">
            {/* Table Header */}
            <div className="bg-muted/40 grid grid-cols-6 items-center gap-4 border-b px-4 py-3">
              <Skeleton className="h-4 w-6" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <div className="ml-auto">
                <Skeleton className="h-4 w-14" />
              </div>
            </div>
            {/* Table Body */}
            <div className="divide-y">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-6 items-center gap-4 px-4 py-3.5"
                >
                  <Skeleton className="h-4 w-6" />
                  <Skeleton className="h-5 w-20 font-mono" />
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="h-4 w-10" />
                  <div className="ml-auto">
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between py-2">
            <Skeleton className="h-4 w-32" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
