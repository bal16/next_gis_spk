import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      <div className="border-b px-6 py-4">
        <div className="bg-muted h-6 w-32 animate-pulse rounded" />
      </div>
      <main className="container mx-auto max-w-7xl p-4">
        <div className="space-y-6">
          {/* Header Action */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-4 w-96 max-w-full" />
            </div>
            <Skeleton className="h-9 w-44 rounded-md" />
          </div>

          {/* Table Card */}
          <Card>
            <CardHeader className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-72" />
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="space-y-3">
                  {/* Table Header */}
                  <div className="bg-muted/40 flex items-center gap-4 border-b px-4 py-3">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                    <div className="ml-auto">
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                  {/* Table Rows */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 border-b px-4 py-3.5"
                    >
                      <Skeleton className="h-5 w-32 font-mono" />
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-36" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                      <div className="ml-auto">
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
