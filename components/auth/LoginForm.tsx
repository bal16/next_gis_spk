"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoaderCircle, LogIn } from "lucide-react";

import { loginAction } from "@/app/actions/auth";
import { loginSchema, type LoginFormData } from "@/lib/validators/auth";

import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    startTransition(async () => {
      const response = await loginAction(data);

      if (!response) {
        // console.log("Response is undefined");
        return;
      }

      if (response.status === "error") {
        toast.error("Login Gagal", {
          description: response.message,
        });
      } else if (response.status === "success") {
        toast.success("Login Berhasil", {
          description: "Mengarahkan Anda ke dashboard...",
        });

        setTimeout(() => {
          router.push("/admin");
        }, 500);
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
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

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" /> Login
            </>
          )}
        </Button>
      </FieldGroup>

      <div className="text-xs text-muted-foreground text-center mt-4 p-3 bg-muted/50 rounded-md">
        <p className="font-semibold mb-1">Demo Credentials:</p>
        <p>Admin: admin@unnes.ac.id / admin123</p>
        <p>User: user@unnes.ac.id / user123</p>
      </div>
    </form>
  );
}
