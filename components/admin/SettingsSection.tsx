"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { useWeights, useUpdateWeights } from "@/hooks/useSettings";
import { weightsSchema, type Weights } from "@/lib/validators/settings";

export const SettingsSection = () => {
  const { data: initialWeights, isLoading: isLoadingWeights } = useWeights();
  const updateWeightsMutation = useUpdateWeights();

  const {
    control,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors },
  } = useForm<Weights>({
    resolver: zodResolver(weightsSchema),
    // Pastikan defaultValues selalu memiliki struktur yang benar,
    // bahkan saat data dari API belum siap.
    defaultValues: initialWeights || {
      c1: 0,
      c2: 0,
      c3: 0,
      c4: 0,
    },
  });

  useEffect(() => {
    if (initialWeights) {
      reset(initialWeights);
    }
  }, [initialWeights, reset]);

  // !WARNING
  // eslint-disable-next-line react-hooks/incompatible-library
  const weights = watch();
  const totalWeights = Object.values(weights).reduce(
    (sum, value) => sum + (Number(value) || 0),
    0
  );

  const onSubmit = (data: Weights) => {
    // Pengecekan manual sebelum submit untuk UX yang lebih baik
    if (Math.round(totalWeights) !== 100) {
      setError("root", {
        type: "manual",
        message: "Total bobot harus 100%",
      });
    } else {
      updateWeightsMutation.mutate(data);
    }
  };

  const isSubmitting = isLoadingWeights || updateWeightsMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Pengaturan SPK
        </h2>
        <p className="text-muted-foreground mt-1">
          Kelola bobot kriteria dan kalkulasi prioritas
        </p>
      </div>

      <div className="space-y-8 max-w-2xl">
        {/* Section 1: Bobot */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold">
            1. Pengelolaan Bobot Kriteria (SAW)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="c1"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Bobot C1 (Usia)</FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    max="100"
                    disabled={isSubmitting}
                    className="max-w-[150px]"
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="c2"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Bobot C2 (Kondisi Fisik)</FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    max="100"
                    disabled={isSubmitting}
                    className="max-w-[150px]"
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="c3"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Bobot C3 (Tingkat Utilitas)</FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    max="100"
                    disabled={isSubmitting}
                    className="max-w-[150px]"
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="c4"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Bobot C4 (Dampak Kerusakan)</FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    max="100"
                    disabled={isSubmitting}
                    className="max-w-[150px]"
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </div>

        {/* Section 2: Kalkulasi */}
        <FieldGroup>
          <h3 className="text-xl font-bold">2. Aksi</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between pt-4 border-t">
              <div
                className={cn(
                  "text-sm text-muted-foreground transition-colors",
                  totalWeights !== 100 && "text-destructive"
                )}
              >
                Total Bobot:{" "}
                <span
                  className={cn(
                    "font-semibold text-foreground transition-colors",
                    totalWeights !== 100 && "text-destructive"
                  )}
                >
                  {totalWeights}%
                </span>
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {updateWeightsMutation.isPending
                  ? "Menyimpan..."
                  : "Simpan Bobot & Hitung Ulang Prioritas"}
              </Button>
            </div>
            {errors.root && (
              <p className="text-sm font-medium text-destructive text-right -mt-2">
                {errors.root.message}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Kalkulasi terakhir dilakukan pada:{" "}
              <span className="font-medium">23 Oktober 2025, 14:30</span> oleh{" "}
              <span className="font-medium">Admin</span>
            </p>
          </div>
        </FieldGroup>
      </div>
    </form>
  );
};
