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
    <main className="min-h-screen relative flex flex-col items-center justify-center bg-linear-to-br from-primary/10 via-background to-secondary/10 p-4">
      
      <div className="absolute top-4 left-4 z-10">
        <Button variant="ghost" className="gap-2" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden md:inline font-medium">Kembali ke Beranda</span>
          </Link>
        </Button>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-primary/10 mb-12 md:mb-32">
        <CardHeader className="space-y-1 text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-2xl ring-1 ring-primary/20">
              <Building2 className="h-8 w-8 text-primary" />
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
          <AuthReasonAlert reason={searchParams?.reason} next={searchParams?.next} />
          <AuthTabs />
        </CardContent>
      </Card>
      
      <div className="absolute bottom-4 text-xs text-muted-foreground text-center w-full opacity-60">
        &copy; {new Date().getFullYear()} Fakultas Teknik UNNES
      </div>
    </main>
  );
}