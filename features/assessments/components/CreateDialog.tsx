"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TBuilding } from "@/features/buildings/type";
import { createAssessmentSchema, type TCreateAssessment } from "../type";
import { useCreateAssessment } from "../hooks/useAssessments";

interface CreateDialogProps {
  trigger?: ReactNode;
  buildingCode?: TBuilding["code"];
}

export function CreateDialog({ trigger, buildingCode }: CreateDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: createAssessment, isPending } = useCreateAssessment(
    buildingCode || "",
  );

  const form = useForm<TCreateAssessment>({
    resolver: zodResolver(createAssessmentSchema),
    defaultValues: {
      age: 0,
      structure: 0,
      architecture: 0,
      mep: 0,
      utility: 0,
      damage: 0,
      lastMaintenance: undefined,
    },
  });

  async function onSubmit(data: TCreateAssessment) {
    if (!buildingCode) return;
    try {
      await createAssessment(data);
      form.reset();
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
            <DialogTitle>Add Assessment</DialogTitle>
            <DialogDescription>
              Fill out the assessment details below. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4 space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            <Field>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter age"
                {...form.register("age")}
                disabled={isPending}
              />
              {form.formState.errors.age && (
                <span className="text-sm text-red-500">
                  {form.formState.errors.age.message}
                </span>
              )}
            </Field>
            <Field>
              <Label htmlFor="structure">Structure</Label>
              <Input
                id="structure"
                type="number"
                step="any"
                placeholder="Enter structure score"
                {...form.register("structure")}
                disabled={isPending}
              />
              {form.formState.errors.structure && (
                <span className="text-sm text-red-500">
                  {form.formState.errors.structure.message}
                </span>
              )}
            </Field>
            <Field>
              <Label htmlFor="architecture">Architecture</Label>
              <Input
                id="architecture"
                type="number"
                step="any"
                placeholder="Enter architecture score"
                {...form.register("architecture")}
                disabled={isPending}
              />
              {form.formState.errors.architecture && (
                <span className="text-sm text-red-500">
                  {form.formState.errors.architecture.message}
                </span>
              )}
            </Field>
            <Field>
              <Label htmlFor="mep">mep</Label>
              <Input
                id="mep"
                type="number"
                step="any"
                placeholder="Enter mep score"
                {...form.register("mep")}
                disabled={isPending}
              />
              {form.formState.errors.mep && (
                <span className="text-sm text-red-500">
                  {form.formState.errors.mep.message}
                </span>
              )}
            </Field>
            <Field>
              <Label htmlFor="utility">Utility</Label>
              <Input
                id="utility"
                type="number"
                step="any"
                placeholder="Enter utility score"
                {...form.register("utility")}
                disabled={isPending}
              />
              {form.formState.errors.utility && (
                <span className="text-sm text-red-500">
                  {form.formState.errors.utility.message}
                </span>
              )}
            </Field>
            <Field>
              <Label htmlFor="damage">Damage</Label>
              <Input
                id="damage"
                type="number"
                step="any"
                placeholder="Enter damage score"
                {...form.register("damage")}
                disabled={isPending}
              />
              {form.formState.errors.damage && (
                <span className="text-sm text-red-500">
                  {form.formState.errors.damage.message}
                </span>
              )}
            </Field>
            <Field>
              <Label htmlFor="lastMaintenance">Last Maintenance</Label>
              <Input
                id="lastMaintenance"
                type="date"
                placeholder="Enter last maintenance date"
                {...form.register("lastMaintenance")}
                disabled={isPending}
              />
              {form.formState.errors.lastMaintenance && (
                <span className="text-sm text-red-500">
                  {form.formState.errors.lastMaintenance.message}
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
            <Button type="submit" disabled={isPending || !buildingCode}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
