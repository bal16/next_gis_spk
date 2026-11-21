import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      {/* SiteHeader Placeholder */}
      <div className="border-b px-6 py-4">
        <div className="bg-muted h-6 w-32 animate-pulse rounded" />
      </div>
      <main className="container mx-auto max-w-7xl p-4">
        <div className="space-y-8 pb-[160px]">
          <div className="grid grid-cols-1 gap-6 md:grid-flow-dense md:grid-cols-2">
            {/* Large Card with subweights (md:col-span-2) */}
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-28" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-9 w-full" />
                </div>
                <div className="space-y-3 rounded-lg border p-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regular Weight Cards (1 col each) */}
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Floating Footer Skeleton */}
          <div className="bg-background/80 fixed bottom-6 left-1/2 z-40 w-[90%] max-w-4xl -translate-x-1/2 rounded-2xl border p-4 shadow-2xl backdrop-blur-md md:bottom-10">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-44" />
              </div>
              <div className="flex w-full gap-3 md:w-auto">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-32" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
