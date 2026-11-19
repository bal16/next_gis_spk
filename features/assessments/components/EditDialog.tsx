"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ReactNode, useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
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
import type { TAssessment } from "@/features/buildings/type";
import { useUpdateAssessment } from "../hooks/useAssessments";
import { createAssessmentSchema, type TCreateAssessment } from "../type";
import { AssessmentFormFields } from "./AssessmentFormFields";

interface EditDialogProps {
  buildingCode: string;
  assessment: TAssessment;
  trigger?: ReactNode;
}

export function EditDialog({
  buildingCode,
  assessment,
  trigger,
}: EditDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: updateAssessment, isPending } = useUpdateAssessment(
    buildingCode,
    () => setOpen(false)
  );

  const form = useForm<TCreateAssessment>({
    resolver: zodResolver(createAssessmentSchema),
    defaultValues: {
      age: assessment.age,
      structure: assessment.structure,
      architecture: assessment.architecture,
      mep: assessment.mep,
      utility: assessment.utility,
      damage: assessment.damage,
      lastMaintenance: assessment.lastMaintenance
        ? new Date(assessment.lastMaintenance)
        : undefined,
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      age: assessment.age,
      structure: assessment.structure,
      architecture: assessment.architecture,
      mep: assessment.mep,
      utility: assessment.utility,
      damage: assessment.damage,
      lastMaintenance: assessment.lastMaintenance
        ? new Date(assessment.lastMaintenance)
        : undefined,
    });
  }, [open, assessment, form]);

  async function onSubmit(data: TCreateAssessment) {
    try {
      await updateAssessment({ assessmentId: assessment.id, data });
    } catch {
      // Error handled by the hook
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Penilaian</DialogTitle>
            <DialogDescription>
              Ubah detail penilaian gedung, lalu klik simpan.
            </DialogDescription>
          </DialogHeader>

          <AssessmentFormFields control={form.control} isPending={isPending} />

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Batal
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
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
