import Link from "next/link";
import { Building2, StepBackIcon } from "lucide-react";

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
    <main className="min-h-screen relative flex items-center justify-center bg-linear-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="absolute top-2 left-2">
        <Button variant="link" asChild>
          <Link href="/">
            <StepBackIcon className="mr-2" /> Kembali ke Beranda
          </Link>
        </Button>
      </div>
      <Card className="w-full max-w-md min-h-[70vh]">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </div>

          <CardTitle className="text-2xl font-bold">
            SPK Prioritas Perawatan Gedung
          </CardTitle>

          <CardDescription>Fakultas Teknik UNNES</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="pt-4">
              <LoginForm />
            </TabsContent>

            <TabsContent value="register" className="pt-4">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}
