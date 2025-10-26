import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { logger } from "@/lib/utils";


interface FormSelectFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: string[];
  placeholder?: string;
}

export function FormSelectField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder,
}: FormSelectFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        // console.log("render select:", name, "value:", field.value)
        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel data-invalid={fieldState.invalid}>{label}</FieldLabel>
            {logger(`${field.name}: ${field.value}`)}

            <NativeSelect {...field}>
              {placeholder && (
                <NativeSelectOption value="" disabled>
                  {placeholder ?? `Pilih ${label}`}
                </NativeSelectOption>
              )}
              {options.map((option) => (
                <NativeSelectOption key={option} value={option}>
                  {option}
                </NativeSelectOption>
              ))}
            </NativeSelect>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
