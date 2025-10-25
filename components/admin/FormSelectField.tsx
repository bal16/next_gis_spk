import { Controller, Control, FieldValues, Path } from "react-hook-form"
import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { logger } from "@/lib/utils"

interface FormSelectFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  options: string[]
  placeholder?: string
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
      render={({ field, fieldState }) =>{ 
        // console.log("render select:", name, "value:", field.value)
        return (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel data-invalid={fieldState.invalid}>{label}</FieldLabel>
                            {logger(`${field.name}: ${field.value}`)}
          
          <Select
            value={field.value ?? ""}
            onValueChange={field.onChange}
          >
            <SelectTrigger>
              <SelectValue placeholder={placeholder ?? `Pilih ${label}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}}
    />
  )
}
