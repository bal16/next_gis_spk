"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Copy, Check, Plus, LoaderCircle, KeyRound } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { createInvitation } from "../api/create-invitation";
import type { InvitationToken } from "../type";

interface GenerateInvitationDialogProps {
  onCreated?: (token: InvitationToken) => void;
}

export function GenerateInvitationDialog({
  onCreated,
}: GenerateInvitationDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [expiresInDays, setExpiresInDays] = useState(7);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  function resetState() {
    setEmail("");
    setRole("user");
    setExpiresInDays(7);
    setGeneratedToken(null);
    setHasCopied(false);
  }

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (!isOpen) {
      resetState();
    }
  }

  function handleCopy() {
    if (!generatedToken) return;
    navigator.clipboard.writeText(generatedToken);
    setHasCopied(true);
    toast.success("Token berhasil disalin ke clipboard!");
    setTimeout(() => setHasCopied(false), 2000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        const result = await createInvitation({
          email: email.trim() || undefined,
          role,
          expiresInDays,
        });

        setGeneratedToken(result.token);
        toast.success("Token undangan berhasil dibuat!");
        onCreated?.(result);
      } catch (err) {
        console.error("Failed to generate invitation token:", err);
        toast.error("Gagal membuat token undangan", {
          description: "Pastikan endpoint backend /invitations telah tersedia.",
        });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Buat Token Undangan</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" />
            Generate Token Undangan
          </DialogTitle>
          <DialogDescription>
            Buat kode token undangan agar staf atau surveyor baru dapat
            mendaftar ke sistem.
          </DialogDescription>
        </DialogHeader>

        {generatedToken ? (
          <div className="space-y-4 py-3">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-300">
              <p className="text-xs font-semibold uppercase tracking-wider">
                Token Berhasil Dibuat
              </p>
              <div className="mt-2 flex items-center justify-between gap-2 rounded bg-background p-2.5 font-mono text-sm font-bold border select-all">
                <span className="truncate">{generatedToken}</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1.5 shrink-0"
                  onClick={handleCopy}
                >
                  {hasCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      Tersalin
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Salin
                    </>
                  )}
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Salin dan berikan kode token di atas kepada pengguna yang akan
                didaftarkan.
              </p>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Selesai
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="inv-email">
                  Email Tujuan (Opsional)
                </FieldLabel>
                <Input
                  id="inv-email"
                  type="email"
                  placeholder="staf@unnes.ac.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="inv-role">Hak Akses / Peran</FieldLabel>
                <select
                  id="inv-role"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={role}
                  onChange={(e) => setRole(e.target.value as "user" | "admin")}
                >
                  <option value="user">User Biasa / Surveyor</option>
                  <option value="admin">Administrator</option>
                </select>
              </Field>

              <Field>
                <FieldLabel htmlFor="inv-expiry">Masa Berlaku Token</FieldLabel>
                <select
                  id="inv-expiry"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={expiresInDays}
                  onChange={(e) => setExpiresInDays(Number(e.target.value))}
                >
                  <option value={1}>1 Hari</option>
                  <option value={3}>3 Hari</option>
                  <option value={7}>7 Hari (1 Minggu)</option>
                  <option value={30}>30 Hari (1 Bulan)</option>
                </select>
              </Field>
            </FieldGroup>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isPending} aria-busy={isPending}>
                {isPending ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  "Generate Token"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
