"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ReactNode, useState } from "react";
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
import type { TBuilding } from "@/features/buildings/type";
import { createAssessmentSchema, type TCreateAssessment } from "../type";
import { useCreateAssessment } from "../hooks/useAssessments";
import { AssessmentFormFields } from "./AssessmentFormFields";

interface CreateDialogProps {
  trigger?: ReactNode;
  buildingCode?: TBuilding["code"];
}

const EMPTY_VALUES: TCreateAssessment = {
  age: undefined as unknown as number,
  structure: undefined as unknown as number,
  architecture: undefined as unknown as number,
  mep: undefined as unknown as number,
  utility: undefined as unknown as number,
  damage: undefined as unknown as number,
  lastMaintenance: undefined,
};

export function CreateDialog({ trigger, buildingCode }: CreateDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: createAssessment, isPending } = useCreateAssessment(
    buildingCode || ""
  );

  const form = useForm<TCreateAssessment>({
    resolver: zodResolver(createAssessmentSchema),
    defaultValues: EMPTY_VALUES,
  });

  async function onSubmit(data: TCreateAssessment) {
    if (!buildingCode) return;
    try {
      await createAssessment(data);
      form.reset(EMPTY_VALUES);
      setOpen(false);
    } catch {
      // Error handled by the hook
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button variant="default">Add New Assessment</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Tambah Penilaian</DialogTitle>
            <DialogDescription>
              Isi detail penilaian gedung, lalu klik simpan saat selesai.
            </DialogDescription>
          </DialogHeader>

          <AssessmentFormFields control={form.control} isPending={isPending} />

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
