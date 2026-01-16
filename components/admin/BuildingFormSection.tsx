"use client";

import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { logger } from "@/lib/utils";
import { buildingFormDTO } from "@/lib/dto";
import { BuildingFormData, buildingSchema } from "@/lib/validators/building";
import { TBuilding } from "@/types/building";
import {
  useAddBuilding,
  useUpdateBuilding,
} from "@/features/buildings/hooks/useBuildings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

interface BuildingFormSectionProps {
  selectedBuilding: TBuilding | null;
  onSave: () => void;
  onCancel: () => void;
}

export const BuildingFormSection = ({
  selectedBuilding,
  onSave,
  onCancel,
}: BuildingFormSectionProps) => {
  const addBuildingMutation = useAddBuilding(onSave);
  const updateBuildingMutation = useUpdateBuilding(onSave);

  const form = useForm({
    resolver: zodResolver(buildingSchema),
    defaultValues: {
      name: undefined,
      code: undefined,
      age: undefined,
      structure: undefined,
      architecture: undefined,
      MEP: undefined,
      utility: undefined,
      damage: undefined,
      lat: undefined,
      lng: undefined,
    },
  });

  useEffect(() => {
    if (selectedBuilding) {
      const flatData = buildingFormDTO(selectedBuilding);
      form.reset(flatData);
    } else {
      form.reset({});
    }
  }, [selectedBuilding, form]);

  const onSubmit = async (data: BuildingFormData) => {
    if (selectedBuilding) {
      updateBuildingMutation.mutate({ id: selectedBuilding.id, data });
    } else {
      addBuildingMutation.mutate(data);
    }
  };
  const isSubmitting =
    addBuildingMutation.isPending || updateBuildingMutation.isPending;
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Formulir Gedung
          </h2>
          <p className="text-muted-foreground mt-1">
            {selectedBuilding ? "Edit data gedung" : "Tambah gedung baru"}
          </p>
        </div>
        <Button
          onClick={onCancel}
          variant="outline"
          className="w-full md:w-auto"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Dashboard
        </Button>
      </div>

      <div className="space-y-8 max-w-3xl">
        {/* Section 1: Informasi Dasar */}
        <FieldGroup className="space-y-4">
          <h3 className="text-xl font-bold">1. Informasi Dasar</h3>
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  data-invalid={fieldState.invalid}
                  htmlFor={field.name}
                >
                  Nama Gedung
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Masukkan nama gedung"
                  value={field.value || ""}
                  aria-invalid={Boolean(fieldState.invalid)}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="code"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                {" "}
                <FieldLabel
                  data-invalid={fieldState.invalid}
                  htmlFor={field.name}
                >
                  Kode Gedung
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Masukkan kode gedung"
                  value={field.value || ""}
                  aria-invalid={Boolean(fieldState.invalid)}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        {/* Section 2: Penilaian Kriteria */}
        <FieldGroup className="space-y-4">
          <h3 className="text-xl font-bold">2. Penilaian Kriteria</h3>
          <Controller
            control={form.control}
            name="age"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                {" "}
                <FieldLabel
                  data-invalid={fieldState.invalid}
                  htmlFor={field.name}
                >
                  C1: Usia
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="number"
                  placeholder="0"
                  value={field.value || ""} // Pastikan value tidak pernah undefined
                  aria-invalid={Boolean(fieldState.invalid)}
                  onChange={(event) =>
                    field.onChange(event.target.valueAsNumber)
                  }
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="structure"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  data-invalid={fieldState.invalid}
                  htmlFor={field.name}
                >
                  C2.1: Kondisi Struktur
                </FieldLabel>
                <NativeSelect
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                >
                  <NativeSelectOption
                    value=""
                    className="text-muted-foreground"
                    defaultChecked
                    disabled={Boolean(field.value)}
                  >
                    Pilih kondisi struktur
                  </NativeSelectOption>
                  {["Baik", "Rusak Ringan", "Rusak Berat"].map((option) => (
                    <NativeSelectOption key={option} value={option}>
                      {option}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="architecture"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  data-invalid={fieldState.invalid}
                  htmlFor={field.name}
                >
                  C2.2: Kondisi Arsitektural
                </FieldLabel>
                <NativeSelect
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                >
                  <NativeSelectOption
                    value=""
                    className="text-muted-foreground"
                    defaultChecked
                    disabled={Boolean(field.value)}
                  >
                    Pilih kondisi arsitektural
                  </NativeSelectOption>
                  {["Baik", "Rusak Ringan", "Rusak Berat"].map((option) => (
                    <NativeSelectOption key={option} value={option}>
                      {option}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="MEP"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  data-invalid={fieldState.invalid}
                  htmlFor={field.name}
                >
                  C2.3: Kondisi MEP
                </FieldLabel>
                <NativeSelect
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                >
                  <NativeSelectOption
                    value=""
                    className="text-muted-foreground"
                    defaultChecked
                    disabled={Boolean(field.value)}
                  >
                    Pilih kondisi MEP
                  </NativeSelectOption>
                  {["Baik", "Rusak Ringan", "Rusak Berat"].map((option) => (
                    <NativeSelectOption key={option} value={option}>
                      {option}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="utility"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  data-invalid={fieldState.invalid}
                  htmlFor={field.name}
                >
                  C3: Tingkat Utilitas
                </FieldLabel>
                <NativeSelect
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                >
                  <NativeSelectOption
                    value=""
                    className="text-muted-foreground"
                    defaultChecked
                    disabled={Boolean(field.value)}
                  >
                    Pilih tingkat utilitas
                  </NativeSelectOption>
                  {["Rendah", "Sedang", "Tinggi"].map((option) => (
                    <NativeSelectOption key={option} value={option}>
                      {option}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="damage"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  data-invalid={fieldState.invalid}
                  htmlFor={field.name}
                >
                  C4: Dampak Kerusakan
                </FieldLabel>
                <NativeSelect
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                >
                  <NativeSelectOption
                    value=""
                    className="text-muted-foreground"
                    defaultChecked
                    disabled={Boolean(field.value)}
                  >
                    Pilih dampak kerusakan
                  </NativeSelectOption>
                  {["Rendah", "Sedang", "Tinggi"].map((option) => (
                    <NativeSelectOption key={option} value={option}>
                      {option}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        {/* Section 3: Lokasi */}
        <FieldGroup className="space-y-4">
          <h3 className="text-xl font-bold">3. Lokasi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              control={form.control}
              name="lat"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  {" "}
                  <FieldLabel
                    data-invalid={fieldState.invalid}
                    htmlFor={field.name}
                  >
                    Latitude
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="number"
                    step="any"
                    placeholder="-7.0515"
                    value={field.value || ""}
                    onChange={(event) =>
                      field.onChange(event.target.valueAsNumber)
                    }
                    aria-invalid={Boolean(fieldState.invalid)}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="lng"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  {" "}
                  <FieldLabel
                    data-invalid={fieldState.invalid}
                    htmlFor={field.name}
                  >
                    Longitude
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="number"
                    step="any"
                    placeholder="110.4020"
                    value={field.value || ""}
                    onChange={(event) =>
                      field.onChange(event.target.valueAsNumber)
                    }
                    aria-invalid={Boolean(fieldState.invalid)}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </FieldGroup>

        {/* Action Button */}
        <FieldGroup className="flex items-center gap-3 pt-4">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting
              ? "Menyimpan..."
              : selectedBuilding
              ? "Perbarui Data"
              : "Simpan Data"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} size="lg">
            Batal
          </Button>
        </FieldGroup>
      </div>
    </form>
  );
};
