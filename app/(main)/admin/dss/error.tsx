"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto max-w-7xl p-4">
      <Alert variant="destructive">
        <AlertTitle>Failed to load SAW runs</AlertTitle>
        <AlertDescription className="flex flex-col gap-3">
          <span>{error.message || "Unable to load calculation history."}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => reset()}
            className="w-fit"
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}
