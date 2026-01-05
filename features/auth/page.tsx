import Link from "next/link";
import { Building2, ArrowLeft } from "lucide-react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { LoginForm } from "@/features/auth/components/LoginForm";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function AuthPage() {
  return (
    // 1. Container: Tetap gunakan min-h-screen, flex, dan justify-center
    <main className="min-h-screen relative flex flex-col items-center justify-center bg-linear-to-br from-primary/10 via-background to-secondary/10 p-4">
      
      {/* Tombol Kembali: Tambahkan z-10 agar selalu di atas jika layar sangat pendek */}
      <div className="absolute top-4 left-4 z-10">
        <Button variant="ghost" className="gap-2" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            {/* Teks disembunyikan di mobile agar tidak semrawut */}
            <span className="hidden md:inline font-medium">Kembali ke Beranda</span>
          </Link>
        </Button>
      </div>

      {/* 2. CARD: Optical Center Magic */}
      {/* mb-12 (mobile) sampai mb-32 (desktop) membuat card terangkat ke atas */}
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
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-0">
              <LoginForm />
            </TabsContent>

            <TabsContent value="register" className="mt-0">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Opsional: Footer copyright kecil di bawah agar ruang kosong bawah tidak sepi */}
      <div className="absolute bottom-4 text-xs text-muted-foreground text-center w-full opacity-60">
        &copy; {new Date().getFullYear()} Fakultas Teknik UNNES
      </div>
    </main>
  );
}