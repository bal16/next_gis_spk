"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { ReactNode, useState, useEffect } from "react";
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
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  createBuildingSchema,
  updateBuildingSchema,
  type TBuilding,
  type TCreateBuilding,
  type TUpdateBuilding,
} from "../type";
import { useAddBuilding, useUpdateBuilding } from "../hooks/useBuildings";
import { LoaderCircle } from "lucide-react";

interface BuildingDialogProps {
  variant?: "add" | "edit";
  initialData?: Partial<TCreateBuilding>;
  trigger?: ReactNode;
  buildingId?: TBuilding["id"];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function BuildingDialog({
  variant = "add",
  initialData,
  trigger,
  buildingId,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: BuildingDialogProps) {
  const isEdit = variant === "edit";
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen =
    setControlledOpen !== undefined ? setControlledOpen : setInternalOpen;

  const { mutateAsync: addBuilding, isPending: isAdding } = useAddBuilding();
  const { mutateAsync: updateBuilding, isPending: isUpdating } =
    useUpdateBuilding();

  const isPending = isAdding || isUpdating;

  const form = useForm<TCreateBuilding | TUpdateBuilding>({
    resolver: zodResolver(isEdit ? updateBuildingSchema : createBuildingSchema),
    defaultValues: {
      ...(isEdit ? {} : { code: initialData?.code || "" }),
      name: initialData?.name || "",
      latitude: initialData?.latitude,
      longitude: initialData?.longitude,
    },
  });

  // Reset form when dialog opens with new data
  useEffect(() => {
    if (open) {
      form.reset({
        ...(isEdit ? {} : { code: initialData?.code || "" }),
        name: initialData?.name || "",
        latitude: initialData?.latitude,
        longitude: initialData?.longitude,
      });
    }
  }, [open, form, isEdit, initialData]);

  async function onSubmit(data: TCreateBuilding | TUpdateBuilding) {
    try {
      if (isEdit && buildingId) {
        await updateBuilding({ id: buildingId, data: data as TUpdateBuilding });
      } else {
        await addBuilding(data as TCreateBuilding);
      }
      setOpen(false);
      form.reset();
    } catch (error) {
      // Error is handled by the hook's onError, but we catch it here to prevent unhandled promise rejections
      console.error(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : controlledOpen === undefined ? (
        <DialogTrigger asChild>
          <Button
            variant={isEdit ? "ghost" : "default"}
            className={isEdit ? "w-full" : ""}
          >
            {isEdit ? "Edit Building" : "Add New Building"}
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="sm:max-w-md">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {isEdit
                ? `Edit Building - ${initialData?.code || ""}`
                : "Add Building"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Edit the building details below."
                : "Fill out the building details below."}{" "}
              Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="flex flex-col gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            {!isEdit && (
              <Controller
                control={form.control}
                name="code"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} data-disabled={isPending}>
                    <FieldLabel htmlFor={field.name}>Kode</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      value={field.value ?? ""}
                      placeholder="e.g., E01"
                      disabled={isPending}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                    />
                    <FieldDescription>Kode unik, tidak dapat diubah setelah dibuat.</FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            )}
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} data-disabled={isPending}>
                  <FieldLabel htmlFor={field.name}>Nama</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    value={field.value ?? ""}
                    placeholder="Nama gedung"
                    maxLength={20}
                    disabled={isPending}
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  <FieldDescription>Maks 20 karakter.</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="latitude"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} data-disabled={isPending}>
                  <FieldLabel htmlFor={field.name}>Latitude</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.value ?? ""}
                    type="number"
                    inputMode="decimal"
                    step="any"
                    placeholder="-7.2900"
                    onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)}
                    disabled={isPending}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>Desimal -90 s.d. 90. Contoh -7.29 (cek Google Maps).</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="longitude"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} data-disabled={isPending}>
                  <FieldLabel htmlFor={field.name}>Longitude</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.value ?? ""}
                    type="number"
                    inputMode="decimal"
                    step="any"
                    placeholder="110.4100"
                    onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)}
                    disabled={isPending}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>Desimal -180 s.d. 180. Contoh 110.41.</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
            <Button type="submit" disabled={isPending}>
              {isPending && <LoaderCircle data-icon="inline-start" className="animate-spin" />}
              {isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
