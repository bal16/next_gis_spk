"use client";

import { useEffect, useMemo } from "react";
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useUpdateWeights } from "../hooks/useWeights";

// 1. Zod Schema Dinamis
// Karena jumlah kriteria bisa berubah, kita gunakan record
const weightsSchema = z.record(
  z.string(),
  z.number("Harus berupa angka").min(0, "Minimal 0").max(1, "Maksimal 1"),
);

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

  const {
    control,
    reset,
    handleSubmit,
  } = form;

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

  // Kalkulasi validasi total 100%
  const mainTotal = useMemo(() => {
    if (!data) return 0;
    return data.reduce((sum, m) => sum + (Number(formValues[m.key]) || 0), 0);
  }, [data, formValues]);

  const isMainTotalValid = Math.abs(mainTotal - 1.0) < 0.001;

  const onSubmit = async (formData: z.infer<typeof weightsSchema>) => {
    if (!isMainTotalValid) {
      toast.error("Gagal", { description: "Total bobot utama harus 100%" });
      return;
    }

    const payload = {
      weights:
        data?.map((main) => ({
          ...main,
          value: formData[main.key],
        })) || [],
    };

    try {
      await updateWeightsMutation(payload);
    } catch (error) {
      // Error handled by hook
    }
  };

  if (isLoading)
    return <div className="p-10 text-center">Memuat konfigurasi...</div>;

  return (
    <form
      id="weights-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 pb-20"
    >
      {/* Visual Status (Sticky) */}
      <div className="sticky top-4 z-20 flex items-center justify-between rounded-xl border bg-background/95 p-4 shadow-sm backdrop-blur-md">
        <div className="flex flex-col gap-1 w-3/4">
          <h2 className="font-bold">Total Bobot Utama</h2>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={cn(
                "h-full transition-all",
                isMainTotalValid ? "bg-green-500" : "bg-yellow-500",
              )}
              style={{ width: `${Math.min(mainTotal * 100, 100)}%` }}
            />
          </div>
        </div>
        <Badge
          variant={isMainTotalValid ? "default" : "destructive"}
          className={cn(isMainTotalValid && "bg-green-600")}
        >
          {(mainTotal * 100).toFixed(0)}% / 100%
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:grid-flow-dense">
        {data?.map((main) => {
          const subTotal =
            main.subWeights?.reduce(
              (sum, s) => sum + (Number(formValues[s.key]) || 0),
              0,
            ) || 0;
          const isSubValid = Math.abs(subTotal - 1.0) < 0.001;

          return (
            <Card
              key={main.key}
              className={cn(main.subWeights?.length > 0 && "md:col-span-2")}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between ">
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
                        <div className="flex gap-4">
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            type="number"
                            step="0.01"
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                            aria-invalid={fieldState.invalid}
                            disabled={isPending}
                          />
                          <div className="flex w-12 items-center font-bold text-muted-foreground">
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
                    <div className="mt-4 space-y-4 rounded-lg bg-muted/40 p-4">
                      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <span>Sub-Kriteria</span>
                        <span
                          className={cn(
                            isSubValid ? "text-green-600" : "text-destructive",
                          )}
                        >
                          Total: {(subTotal * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {main.subWeights?.map((sub) => (
                          <Controller
                            key={sub.key}
                            name={sub.key}
                            control={control}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="text-xs">
                                  {sub.name}
                                </FieldLabel>
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
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    {((Number(field.value) || 0) * 100).toFixed(
                                      0,
                                    )}
                                    %
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
        })}
      </div>

      {/* Floating Footer Control */}
      <div className="fixed bottom-6 left-1/2 z-40 w-[90%] -translate-x-1/2 max-w-4xl rounded-2xl border bg-background/80 p-4 shadow-2xl backdrop-blur-md md:bottom-10">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-sm">
            <p className="font-medium text-muted-foreground">
              Status Konfigurasi
            </p>
            <p
              className={cn(
                "font-bold",
                isMainTotalValid ? "text-green-600" : "text-destructive",
              )}
            >
              {isMainTotalValid
                ? "Siap untuk disimpan"
                : "Total bobot utama belum 100%"}
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => reset()}
              disabled={isPending}
            >
              Reset
            </Button>
            <Button
              type="submit"
              form="weights-form"
              disabled={!isMainTotalValid || isPending}
              className="flex-1 md:min-w-[150px]"
            >
              {isPending ? "Menyimpan..." : "Simpan Bobot"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
