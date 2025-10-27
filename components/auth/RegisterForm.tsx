"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoaderCircle, UserPlus } from "lucide-react";
import { registrationAction } from "@/app/actions/auth";
import { registerSchema, type RegisterFormData } from "@/lib/validators/auth";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "", // This is a known property in RegisterFormData
    },
  });

  // Handler 'onSubmit' tetap sama persis
  async function onSubmit(data: RegisterFormData) {
    startTransition(async () => {
      const response = await registrationAction(data);
      if (response.status === "error") {
        toast.error("Registrasi Gagal", {
          description: response.message,
        });
      } else if (response.status === "success") {
        toast.success("Registrasi Berhasil", {
          description: "Mengarahkan Anda ke halaman login...",
        });
        form.reset();
        router.push("/login"); // Arahkan ke halaman login
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        {/* Field: Nama Lengkap */}
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                data-invalid={fieldState.invalid}
                htmlFor={field.name}
              >
                Nama Lengkap
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="John Doe"
                value={field.value || ""}
                aria-invalid={Boolean(fieldState.invalid)}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Field: Email */}
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                data-invalid={fieldState.invalid}
                htmlFor={field.name}
              >
                Email
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                placeholder="email@unnes.ac.id"
                value={field.value || ""}
                aria-invalid={Boolean(fieldState.invalid)}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Field: Password */}
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                data-invalid={fieldState.invalid}
                htmlFor={field.name}
              >
                Password
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="password"
                placeholder="••••••••"
                value={field.value || ""}
                aria-invalid={Boolean(fieldState.invalid)}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Field: Konfirmasi Password */}
        <Controller
          control={form.control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                data-invalid={fieldState.invalid}
                htmlFor={field.name}
              >
                Konfirmasi Password
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="password"
                placeholder="••••••••"
                value={field.value || ""}
                aria-invalid={Boolean(fieldState.invalid)}
              />
              {fieldState.invalid && (
                // Zod refine akan menempatkan error di field ini
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" /> Register
            </>
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
