"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { useAddBuilding, useUpdateBuilding } from "@/hooks/useBuildings";
import { Building } from "@/types/building";
import { logger } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { BuildingFormData, buildingSchema } from "@/lib/validators/building";

interface BuildingFormSectionProps {
  selectedBuilding: Building | null;
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
      nama_gedung: undefined,
      kode_gedung: undefined,
      C1_Usia: undefined,
      C2_Kondisi_Struktur: undefined,
      C2_Kondisi_Arsitektural: undefined,
      C2_Kondisi_MEP: undefined,
      C3_Utilitas: undefined,
      C4_Dampak: undefined,
      lat: undefined,
      lng: undefined,
    },
  });

  useEffect(() => {
    // if (!selectedBuilding) return;
    // if (!selectedBuilding.kriteria) return; // <-- jangan reset kalau belum ada datanya

    if (selectedBuilding) {
      // Map data dari struktur Building (nested) ke struktur BuildingFormData (flat)
      const flatData = {
        nama_gedung: selectedBuilding.nama_gedung,
        kode_gedung: selectedBuilding.kode_gedung,
        C1_Usia: `${selectedBuilding.kriteria.C1_Usia}`,
        C2_Kondisi_Struktur: selectedBuilding.kriteria.C2_Kondisi_Struktur,
        C2_Kondisi_Arsitektural:
          selectedBuilding.kriteria.C2_Kondisi_Arsitektural,
        C2_Kondisi_MEP: selectedBuilding.kriteria.C2_Kondisi_MEP,
        C3_Utilitas: selectedBuilding.kriteria.C3_Utilitas,
        C4_Dampak: selectedBuilding.kriteria.C4_Dampak,
        lat: selectedBuilding.lokasi.lat,
        lng: selectedBuilding.lokasi.lng,
      };
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
            name="nama_gedung"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel data-invalid={fieldState.invalid}>
                  {field.name}
                </FieldLabel>
                <Input
                  {...field}
                  placeholder="Masukkan nama gedung"
                  value={field.value || ""}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="kode_gedung"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel data-invalid={fieldState.invalid}>
                  {field.name}
                </FieldLabel>
                <Input
                  {...field}
                  placeholder="Masukkan kode gedung"
                  value={field.value || ""}
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
            name="C1_Usia"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                {logger(`${field.name}: ${field.value}`)}
                <FieldLabel data-invalid={fieldState.invalid}>
                  C1: Usia
                </FieldLabel>
                <Input
                  {...field}
                  type="number"
                  placeholder="0"
                  value={field.value || ""} // Pastikan value tidak pernah undefined
                  onChange={(event) =>
                    field.onChange(event.target.valueAsNumber)
                  } // Gunakan valueAsNumber untuk input number
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="C2_Kondisi_Struktur"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel data-invalid={fieldState.invalid}>
                  C2.1: Kondisi Struktur
                </FieldLabel>
                <NativeSelect {...field}>
                  <NativeSelectOption value="" className="text-secondary">
                    Pilih Kondisi Struktur
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
            name="C2_Kondisi_Arsitektural"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel data-invalid={fieldState.invalid}>
                  C2.2: Kondisi Arsitektural (Debug)
                </FieldLabel>
                {logger(`${field.name}: ${field.value}`)}
                <NativeSelect {...field}>
                  <NativeSelectOption value="" className="text-secondary">
                    Pilih Kondisi Arsitektural
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
            name="C2_Kondisi_MEP"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel data-invalid={fieldState.invalid}>
                  C2.3: Kondisi MEP
                </FieldLabel>
                <NativeSelect {...field}>
                  <NativeSelectOption value="" className="text-secondary">
                    Pilih Kondisi MEP
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
            name="C3_Utilitas"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel data-invalid={fieldState.invalid}>
                  C3: Tingkat Utilitas
                </FieldLabel>
                <NativeSelect {...field}>
                  <NativeSelectOption value="" className="text-secondary">
                    Pilih Tingkat Utilitas
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
            name="C4_Dampak"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel data-invalid={fieldState.invalid}>
                  C4: Dampak Kerusakan
                </FieldLabel>
                <NativeSelect {...field}>
                  <NativeSelectOption value="" className="text-secondary">
                    Pilih Dampak Kerusakan
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
                  <FieldLabel data-invalid={fieldState.invalid}>
                    {field.name}
                  </FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    step="any"
                    placeholder="-7.0515"
                    value={field.value ?? ""}
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
                  <FieldLabel data-invalid={fieldState.invalid}>
                    {field.name}
                  </FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    step="any"
                    placeholder="110.4020"
                    value={String(field.value)}
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
