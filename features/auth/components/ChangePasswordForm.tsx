"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoaderCircle, KeyRound, ShieldAlert } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/features/auth/types/authSchema";
import { changePasswordAction } from "@/features/auth/actions/changePasswordAction";

import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ChangePasswordForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  async function onSubmit(data: ChangePasswordFormData) {
    startTransition(async () => {
      const response = await changePasswordAction(data);

      if (response.status === "error") {
        const msg = response.message || "";
        if (
          msg.includes("Password saat ini salah") ||
          msg.toLowerCase().includes("current")
        ) {
          form.setError("currentPassword", { message: msg });
        }
        toast.error("Gagal Mengubah Password", {
          description: msg,
        });
      } else if (response.status === "success") {
        toast.success("Password Berhasil Diubah", {
          description: "Mengarahkan ke halaman tujuan...",
        });

        queryClient.invalidateQueries({ queryKey: ["currentUser"] });

        const target = response.data?.redirectUrl || "/admin";
        setTimeout(() => {
          router.push(target);
          router.refresh();
        }, 600);
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-300">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <p>
          Akun Anda menggunakan kata sandi bawaan atau diwajibkan melakukan
          pembaruan password sebelum dapat mengakses sistem.
        </p>
      </div>

      <FieldGroup>
        <Controller
          control={form.control}
          name="currentPassword"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                data-invalid={fieldState.invalid}
                htmlFor={field.name}
              >
                Password Saat Ini
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="password"
                placeholder="Masukkan password saat ini"
                value={field.value || ""}
                aria-invalid={Boolean(fieldState.invalid)}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="newPassword"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                data-invalid={fieldState.invalid}
                htmlFor={field.name}
              >
                Password Baru
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="password"
                placeholder="Minimal 8 karakter"
                value={field.value || ""}
                aria-invalid={Boolean(fieldState.invalid)}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="confirmNewPassword"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                data-invalid={fieldState.invalid}
                htmlFor={field.name}
              >
                Konfirmasi Password Baru
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="password"
                placeholder="Ulangi password baru"
                value={field.value || ""}
                aria-invalid={Boolean(fieldState.invalid)}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isPending}
          aria-busy={isPending}
        >
          {isPending ? (
            <LoaderCircle data-icon="inline-start" className="animate-spin" />
          ) : (
            <>
              <KeyRound data-icon="inline-start" /> Simpan Password Baru
            </>
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
