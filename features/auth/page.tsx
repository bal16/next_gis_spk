import Link from "next/link";
import { Building2, ArrowLeft } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { AuthTabs } from "@/features/auth/components/AuthTabs";
import { AuthReasonAlert } from "@/features/auth/components/AuthReasonAlert";

export default function AuthPage({
  searchParams,
}: {
  searchParams?: { reason?: string; next?: string };
}) {
  return (
    <main className="from-primary/10 via-background to-secondary/10 relative flex min-h-screen flex-col items-center justify-center bg-linear-to-br p-4">
      <div className="absolute top-4 left-4 z-10">
        <Button variant="ghost" className="gap-2" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden font-medium md:inline">
              Kembali ke Beranda
            </span>
          </Link>
        </Button>
      </div>

      <Card className="border-primary/10 mb-12 w-full max-w-md shadow-2xl md:mb-32">
        <CardHeader className="space-y-1 pb-2 text-center">
          <div className="mb-4 flex justify-center">
            <div className="bg-primary/10 ring-primary/20 rounded-2xl p-3 ring-1">
              <Building2 className="text-primary h-8 w-8" />
            </div>
          </div>

          <CardTitle className="text-2xl font-bold tracking-tight">
            SPK Prioritas Gedung
          </CardTitle>

          <CardDescription className="text-base">
            Fakultas Teknik UNNES
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          <AuthReasonAlert
            reason={searchParams?.reason}
            next={searchParams?.next}
          />
          <AuthTabs />
        </CardContent>
      </Card>

      <div className="text-muted-foreground absolute bottom-4 w-full text-center text-xs opacity-60">
        &copy; {new Date().getFullYear()} Fakultas Teknik UNNES
      </div>
    </main>
  );
}
