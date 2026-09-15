"use client";

import { memo, useEffect, useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import * as z from "zod";

import { getWeights } from "../api/get-weights";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpdateWeights } from "../hooks/useWeights";
import type { TWeight } from "../api/get-weights";

// 1. Zod Schema Dinamis
// Karena jumlah kriteria bisa berubah, kita gunakan record
const weightsSchema = z.record(
  z.string(),
  z.number("Harus berupa angka").min(0, "Minimal 0").max(1, "Maksimal 1")
);

const EPSILON = 0.001;

export function WeightsUpdateSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["weights"],
    queryFn: getWeights,
    staleTime: Infinity,
  });

  const { mutateAsync: updateWeightsMutation, isPending } = useUpdateWeights();

  const form = useForm<z.infer<typeof weightsSchema>>({
    resolver: zodResolver(weightsSchema),
    defaultValues: {},
  });

  const { control, reset, handleSubmit } = form;

  const formValues = useWatch({ control });

  useEffect(() => {
    if (data) {
      const defaults: Record<string, number> = {};
      data.forEach((main) => {
        defaults[main.key] = main.value;
        main.subWeights?.forEach((sub) => {
          defaults[sub.key] = sub.value;
        });
      });
      reset(defaults);
    }
  }, [data, reset]);

  // Kalkulasi validasi total 100% — parent still watches for sticky/footer gates; per-card isolates via WeightCard
  const mainTotal = useMemo(() => {
    if (!data) return 0;
    return data.reduce(
      (sum, m) =>
        sum + (Number((formValues as Record<string, number>)[m.key]) || 0),
      0
    );
  }, [data, formValues]);

  const isMainTotalValid = Math.abs(mainTotal - 1.0) < EPSILON;

  // Global sub-group validity — all sub groups must sum to 1.0; mains without subs skip
  const allSubsValid = useMemo(() => {
    if (!data) return true;
    const fv = formValues as Record<string, number>;
    return data.every((main) => {
      if (!main.subWeights?.length) return true;
      const subTotal = main.subWeights.reduce(
        (s, sv) => s + (Number(fv[sv.key]) || 0),
        0
      );
      return Math.abs(subTotal - 1.0) < EPSILON;
    });
  }, [data, formValues]);

  const onSubmit = async (formData: z.infer<typeof weightsSchema>) => {
    if (!isMainTotalValid) {
      toast.error("Gagal", { description: "Total bobot utama harus 100%" });
      return;
    }
    if (!allSubsValid) {
      toast.error("Gagal", {
        description: "Total sub bobot harus 100% di setiap kelompok",
      });
      return;
    }

    const payload = {
      weights:
        data?.map((main) => ({
          ...main,
          value: formData[main.key],
          subWeights: main.subWeights?.map((sub) => ({
            ...sub,
            value: formData[sub.key] ?? sub.value,
          })),
        })) || [],
    };

    try {
      await updateWeightsMutation(payload);
    } catch (error) {
      // Error handled by hook
      console.error(error);
    }
  };

  if (isLoading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full rounded-xl" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );

  return (
    <form
      id="weights-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 pb-[160px]"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-flow-dense md:grid-cols-2">
        {data?.map((main) => (
          <WeightCard
            key={main.key}
            main={main}
            control={control}
            isPending={isPending}
          />
        ))}
      </div>

      {/* Floating Footer Control */}
      <div className="bg-background/80 fixed bottom-6 left-1/2 z-40 w-[90%] max-w-4xl -translate-x-1/2 rounded-2xl border p-4 shadow-2xl backdrop-blur-md md:bottom-10">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-sm">
            <p className="text-muted-foreground font-medium">
              Status Konfigurasi
            </p>
            <p
              className={cn(
                "font-bold",
                isMainTotalValid && allSubsValid
                  ? "text-green-600"
                  : "text-destructive"
              )}
            >
              {!isMainTotalValid
                ? "Total bobot utama belum 100%"
                : !allSubsValid
                  ? "Total sub bobot belum 100% di setiap kelompok"
                  : "Siap untuk disimpan"}
            </p>
          </div>
          <div className="flex w-full gap-3 md:w-auto">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  disabled={isPending}
                >
                  Reset
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset weights?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Reset all weights to last saved values? Unsaved changes will
                    be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => reset()}>
                    Reset
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              type="submit"
              form="weights-form"
              disabled={!isMainTotalValid || !allSubsValid || isPending}
              className="flex-1 md:min-w-[150px]"
              aria-busy={isPending}
            >
              {isPending && (
                <LoaderCircle
                  data-icon="inline-start"
                  className="animate-spin"
                />
              )}
              {isPending ? "Menyimpan..." : "Simpan Bobot"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

type WeightCardProps = {
  main: TWeight;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  isPending: boolean;
};

const WeightCard = memo(function WeightCard({
  main,
  control,
  isPending,
}: WeightCardProps) {
  const subKeys = main.subWeights?.map((s) => s.key) ?? [];
  // Isolated subscription: only re-renders when this card's sub values change
  const watchedSubValues = useWatch({
    control,
    name: subKeys as unknown as string,
  }) as unknown as number[] | number | undefined;
  const subTotal = useMemo(() => {
    if (!main.subWeights?.length) return 0;
    if (Array.isArray(watchedSubValues)) {
      return watchedSubValues.reduce((s, v) => s + (Number(v) || 0), 0);
    }
    if (subKeys.length === 1 && typeof watchedSubValues === "number") {
      return Number(watchedSubValues) || 0;
    }
    // Fallback: read directly if useWatch returns undefined before mount
    return 0;
  }, [main.subWeights, subKeys.length, watchedSubValues]);

  // Fallback to form watch for initial defaults when useWatch array not yet hydrated
  const fallbackSubTotal = useMemo(() => {
    // If watchedSubValues is undefined/empty but form has defaults, subTotal will be 0; caller will show Total from actual formValues via parent gate
    // We keep watched path primary; fallback is via parent allSubsValid gate
    return subTotal;
  }, [subTotal]);

  const isSubValid =
    !main.subWeights?.length ||
    watchedSubValues === undefined ||
    (Array.isArray(watchedSubValues) &&
      watchedSubValues.every((v) => v === undefined)) ||
    Math.abs(fallbackSubTotal - 1.0) < EPSILON;

  return (
    <Card className={cn(main.subWeights?.length > 0 && "md:col-span-2")}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {main.name}
          <Badge variant="outline" className="text-[10px] uppercase">
            {main.type}
          </Badge>
        </CardTitle>
        <CardDescription>Kode: {main.key}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FieldGroup>
          <Controller
            name={main.key}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Bobot Utama</FieldLabel>
                <FieldDescription className="text-xs">
                  Nilai 0.00–1.00
                </FieldDescription>
                <div className="flex gap-4">
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    type="number"
                    step="0.01"
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    aria-invalid={fieldState.invalid}
                    disabled={isPending}
                  />
                  <div className="text-muted-foreground flex w-12 items-center font-bold">
                    {((Number(field.value) || 0) * 100).toFixed(0)}%
                  </div>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {main.subWeights?.length > 0 && (
            <div className="bg-muted/40 mt-4 space-y-4 rounded-lg p-4">
              <div className="text-muted-foreground flex items-center justify-between text-xs font-semibold tracking-wider uppercase">
                <span>Sub-Kriteria</span>
                <span
                  className={cn(
                    isSubValid ? "text-green-600" : "text-destructive"
                  )}
                >
                  Total: {(fallbackSubTotal * 100).toFixed(0)}%
                </span>
              </div>
              {!isSubValid && (
                <FieldDescription className="text-destructive text-xs">
                  Sub bobot harus total 100%
                </FieldDescription>
              )}
              <Separator />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {main.subWeights?.map((sub) => (
                  <Controller
                    key={sub.key}
                    name={sub.key}
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-xs">{sub.name}</FieldLabel>
                        <div className="flex gap-3">
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            type="number"
                            step="0.01"
                            className="h-9 text-sm"
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                            disabled={isPending}
                          />
                          <div className="text-muted-foreground flex items-center text-xs">
                            {((Number(field.value) || 0) * 100).toFixed(0)}%
                          </div>
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                ))}
              </div>
            </div>
          )}
        </FieldGroup>
      </CardContent>
    </Card>
  );
});
