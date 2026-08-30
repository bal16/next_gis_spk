"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createBuildingSchema,
  updateBuildingSchema,
  type TBuilding,
  type TCreateBuilding,
  type TUpdateBuilding,
} from "../type";
import { useAddBuilding, useUpdateBuilding } from "../hooks/useBuildings";

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

          <FieldGroup className="py-4 space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {!isEdit && (
              <Field>
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  placeholder="e.g., E01"
                  {...form.register("code")}
                  disabled={isPending}
                />
                {(form.formState.errors as { code?: { message?: string } })
                  .code && (
                  <span className="text-sm text-red-500">
                    {
                      (form.formState.errors as { code?: { message?: string } })
                        .code?.message
                    }
                  </span>
                )}
              </Field>
            )}
            <Field>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Building Name"
                maxLength={20}
                {...form.register("name")}
                disabled={isPending}
              />
              {form.formState.errors.name && (
                <span className="text-sm text-red-500">
                  {form.formState.errors.name.message}
                </span>
              )}
            </Field>
            <Field>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="text"
                placeholder="-6.200000"
                {...form.register("latitude")}
                disabled={isPending}
              />
              {form.formState.errors.latitude && (
                <span className="text-sm text-red-500">
                  {form.formState.errors.latitude.message}
                </span>
              )}
            </Field>
            <Field>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="text"
                placeholder="106.816666"
                {...form.register("longitude")}
                disabled={isPending}
              />
              {form.formState.errors.longitude && (
                <span className="text-sm text-red-500">
                  {form.formState.errors.longitude.message}
                </span>
              )}
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
