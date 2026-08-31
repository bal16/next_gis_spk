"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { toast } from "sonner";
import { LoaderCircle, UserPlus } from "lucide-react";

import {
  registerSchema,
  type RegisterFormData,
} from "@/features/auth/types/authSchema";

import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registrationAction } from "../actions/registrationAction";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: RegisterFormData) {
    startTransition(async () => {
      const response = await registrationAction(data);
      if (response.status === "success") {
        toast.success("Registration Successful", {
          description: "Please go to login...",
        });
        form.reset();
        onSuccess?.();
      } else {
        const msg = response.message || "";
        if (msg.includes("Email ini sudah terdaftar") || msg.toLowerCase().includes("email")) {
          form.setError("email", { message: msg });
        }
        toast.error("Registration Failed", {
          description: msg,
        });
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        {/* Field: Nama Lengkap */}
        <Controller
          control={form.control}
          name="username"
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

        <Button type="submit" className="w-full" disabled={isPending} aria-busy={isPending}>
          {isPending ? (
            <LoaderCircle data-icon="inline-start" className="animate-spin" />
          ) : (
            <>
              <UserPlus data-icon="inline-start" /> Register
            </>
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
