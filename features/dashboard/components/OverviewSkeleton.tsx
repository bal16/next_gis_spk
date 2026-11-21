import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      {/* 1. Header Summary Skeleton */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-36 rounded-full" />
      </div>

      {/* 2. Visual Stats Skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Pie Chart Skeleton */}
        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            <Skeleton className="size-48 rounded-full" />
          </CardContent>
        </Card>

        {/* Map Preview Skeleton */}
        <Card className="md:col-span-2">
          <CardHeader>
            <Skeleton className="h-5 w-48" />
          </CardHeader>
          <CardContent className="h-[280px]">
            <Skeleton className="h-full w-full rounded-md" />
          </CardContent>
        </Card>
      </div>

      {/* 3. Main Data Table Skeleton */}
      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-52" />
          <Skeleton className="h-4 w-80" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-9 w-64" />
          </div>
          <div className="space-y-2 rounded-md border p-3">
            <Skeleton className="h-10 w-full" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
