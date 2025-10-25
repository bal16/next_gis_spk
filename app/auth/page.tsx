"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { loginUser, registerUser, type LoginData, type RegisterData } from "@/api/auth";

export default function Auth() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/");
//     }
//   }, [isAuthenticated, navigate]);

  const handleLogin = async (data: LoginData) => {
    setIsLoading(true);
    const result = await loginUser(data);
    setIsLoading(false);

    if (result.success) {
      toast.success("Login berhasil",{
        description: "Selamat datang kembali!",
      });
      router.push("/");
    } else {
      toast.error("Login gagal",{
        description: result.error || "Terjadi kesalahan. Silakan coba lagi.",
      });
    }
  };

  const handleRegister = async (data: RegisterData) => {
    setIsLoading(true);
    const result = await registerUser(data);
    setIsLoading(false);

    if (result.success) {
      toast.success("Registrasi berhasil",{
        description: "Akun Anda telah dibuat!",
      });
      router.push("/");
    } else {
      toast.error("Registrasi gagal",{
        description: result.error || "Terjadi kesalahan. Silakan coba lagi.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            SPK Prioritas Perawatan Gedung
          </CardTitle>
          <CardDescription>
            Fakultas Teknik UNNES
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="pt-4">
              <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="register" className="pt-4">
              <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
