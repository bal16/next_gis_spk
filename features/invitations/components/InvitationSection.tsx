"use client";

import { useState } from "react";
import { Ticket, Copy, Check, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GenerateInvitationDialog } from "./GenerateInvitationDialog";
import type { InvitationToken } from "../type";

interface InvitationSectionProps {
  initialData: InvitationToken[];
  serverTime: string;
}

function InvitationStatusBadge({
  item,
  serverTime,
}: {
  item: InvitationToken;
  serverTime: string;
}) {
  const isExpired = new Date(item.expiresAt).getTime() < new Date(serverTime).getTime();

  if (item.usedAt) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
        <CheckCircle2 className="h-3 w-3" /> Digunakan
      </span>
    );
  }

  if (isExpired) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
        <AlertCircle className="h-3 w-3" /> Kedaluwarsa
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
      <Clock className="h-3 w-3" /> Aktif
    </span>
  );
}

export function InvitationSection({
  initialData,
  serverTime,
}: InvitationSectionProps) {
  const [tokens, setTokens] = useState<InvitationToken[]>(initialData);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleCreated(newToken: InvitationToken) {
    setTokens((prev) => [newToken, ...prev]);
  }

  function handleCopy(token: string, id: string) {
    navigator.clipboard.writeText(token);
    setCopiedId(id);
    toast.success("Token berhasil disalin!");
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Token Undangan Pendaftaran
          </h2>
          <p className="text-sm text-muted-foreground">
            Kelola kode token untuk membatasi siapa saja yang berhak mendaftar ke
            sistem.
          </p>
        </div>
        <GenerateInvitationDialog onCreated={handleCreated} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Ticket className="h-4 w-4 text-primary" /> Daftar Token Undangan
          </CardTitle>
          <CardDescription>
            Riwayat token yang telah dibuat dan status penggunaannya.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tokens.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4 mb-3">
                <Ticket className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold">Belum Ada Token Undangan</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Klik tombol &quot;Buat Token Undangan&quot; di atas untuk membuat
                kode token registrasi pertama.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-muted/40 text-xs font-medium text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Token</th>
                    <th className="px-4 py-3">Peran / Role</th>
                    <th className="px-4 py-3">Email Penerima</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Kedaluwarsa</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tokens.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-mono font-medium">
                        {item.token}
                      </td>
                      <td className="px-4 py-3">
                        <span className="capitalize">{item.role}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {item.email || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <InvitationStatusBadge
                          item={item}
                          serverTime={serverTime}
                        />
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(item.expiresAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => handleCopy(item.token, item.id)}
                        >
                          {copiedId === item.id ? (
                            <Check className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
