"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { TBuilding } from "@/features/buildings/type";
import { createAssessmentSchema, type TCreateAssessment } from "../type";
import { useCreateAssessment } from "../hooks/useAssessments";
import { LoaderCircle } from "lucide-react";

interface CreateDialogProps {
  trigger?: ReactNode;
  buildingCode?: TBuilding["code"];
}

const SCORE_OPTIONS = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
] as const;

export function CreateDialog({ trigger, buildingCode }: CreateDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: createAssessment, isPending } = useCreateAssessment(
    buildingCode || ""
  );

  const form = useForm<TCreateAssessment>({
    resolver: zodResolver(createAssessmentSchema),
    defaultValues: {
      age: undefined as unknown as number,
      structure: undefined as unknown as number,
      architecture: undefined as unknown as number,
      mep: undefined as unknown as number,
      utility: undefined as unknown as number,
      damage: undefined as unknown as number,
      lastMaintenance: undefined,
    },
  });

  async function onSubmit(data: TCreateAssessment) {
    if (!buildingCode) return;
    try {
      await createAssessment(data);
      form.reset({
        age: undefined as unknown as number,
        structure: undefined as unknown as number,
        architecture: undefined as unknown as number,
        mep: undefined as unknown as number,
        utility: undefined as unknown as number,
        damage: undefined as unknown as number,
        lastMaintenance: undefined,
      });
      setOpen(false);
    } catch {
      // Error handled by the hook
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="default">Add New Assessment</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Tambah Penilaian</DialogTitle>
            <DialogDescription>
              Isi detail penilaian gedung. Pilih 1–3 untuk kriteria (1 = buruk,
              3 = baik). Klik simpan saat selesai.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto py-4 pr-2">
            {/* Age — numeric Input, 0+ */}
            <Controller
              control={form.control}
              name="age"
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  data-disabled={isPending}
                >
                  <FieldLabel htmlFor={field.name}>Umur (tahun)</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.value ?? ""}
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    placeholder="Contoh 10"
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : e.target.valueAsNumber
                      )
                    }
                    disabled={isPending}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>
                    Umur bangunan dalam tahun, minimal 0.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Scored criteria 1-3 as ToggleGroup inside FieldSet */}
            <FieldSet>
              <FieldLegend variant="label">Kriteria Penilaian</FieldLegend>
              <FieldDescription>
                Pilih 1 = buruk, 2 = sedang, 3 = baik. Wajib diisi.
              </FieldDescription>
              <div className="mt-2 flex flex-col gap-4">
                {(
                  [
                    { name: "structure" as const, label: "Struktur" },
                    { name: "architecture" as const, label: "Arsitektur" },
                    { name: "mep" as const, label: "MEP" },
                    { name: "utility" as const, label: "Utilitas" },
                    { name: "damage" as const, label: "Kerusakan" },
                  ] as const
                ).map((item) => (
                  <Controller
                    key={item.name}
                    control={form.control}
                    name={item.name}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        data-disabled={isPending}
                      >
                        <FieldLabel id={`${item.name}-label`}>
                          {item.label}
                        </FieldLabel>
                        <ToggleGroup
                          type="single"
                          variant="outline"
                          spacing={1}
                          value={field.value != null ? String(field.value) : ""}
                          onValueChange={(val) =>
                            field.onChange(val ? Number(val) : undefined)
                          }
                          aria-labelledby={`${item.name}-label`}
                          aria-invalid={fieldState.invalid}
                          data-disabled={isPending}
                          disabled={isPending}
                        >
                          {SCORE_OPTIONS.map((opt) => (
                            <ToggleGroupItem
                              key={opt.value}
                              value={opt.value}
                              aria-label={`${item.label} ${opt.label}`}
                            >
                              {opt.label}
                            </ToggleGroupItem>
                          ))}
                        </ToggleGroup>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                ))}
              </div>
            </FieldSet>

            <Controller
              control={form.control}
              name="lastMaintenance"
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  data-disabled={isPending}
                >
                  <FieldLabel htmlFor={field.name}>
                    Pemeliharaan Terakhir
                  </FieldLabel>
                  <Input
                    id={field.name}
                    type="date"
                    value={
                      field.value
                        ? new Date(field.value).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? new Date(e.target.value) : undefined
                      )
                    }
                    disabled={isPending}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>
                    Kosongkan jika belum pernah. Format YYYY-MM-DD.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Batal
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending || !buildingCode}>
              {isPending && (
                <LoaderCircle
                  data-icon="inline-start"
                  className="animate-spin"
                />
              )}
              {isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
