"use client";

import { Controller, type Control } from "react-hook-form";
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
import { SCORE_CRITERIA, SCORE_LABELS, SCORE_OPTIONS } from "../constants";
import type { TCreateAssessment } from "../type";

type AssessmentFormFieldsProps = {
  control: Control<TCreateAssessment>;
  isPending: boolean;
};

export function AssessmentFormFields({
  control,
  isPending,
}: AssessmentFormFieldsProps) {
  return (
    <FieldGroup className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto py-4 pr-2">
      <Controller
        control={control}
        name="age"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} data-disabled={isPending}>
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
                  e.target.value === "" ? undefined : e.target.valueAsNumber
                )
              }
              disabled={isPending}
              aria-invalid={fieldState.invalid}
            />
            <FieldDescription>
              Umur bangunan dalam tahun, minimal 0.
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <FieldSet>
        <FieldLegend variant="label">Kriteria Penilaian</FieldLegend>
        <FieldDescription>
          Pilih 1 = {SCORE_LABELS[1]}, 2 = {SCORE_LABELS[2]}, 3 ={" "}
          {SCORE_LABELS[3]}. Wajib diisi.
        </FieldDescription>
        <div className="mt-2 flex flex-col gap-4">
          {SCORE_CRITERIA.map((item) => (
            <Controller
              key={item.name}
              control={control}
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
                        aria-label={`${item.label} ${opt.label} (${SCORE_LABELS[Number(opt.value)]})`}
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
        control={control}
        name="lastMaintenance"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} data-disabled={isPending}>
            <FieldLabel htmlFor={field.name}>Pemeliharaan Terakhir</FieldLabel>
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
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
}
