"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import type { LoginData } from "@/api/auth";

interface LoginFormProps {
  onSubmit: (data: LoginData) => Promise<void>;
  isLoading: boolean;
}

export const LoginForm = ({ onSubmit, isLoading }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="email@unnes.ac.id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Loading..." : <><LogIn className="mr-2 h-4 w-4" /> Login</>}
      </Button>
      <div className="text-xs text-muted-foreground text-center mt-4 p-3 bg-muted/50 rounded-md">
        <p className="font-semibold mb-1">Demo Credentials:</p>
        <p>Admin: admin@unnes.ac.id / admin123</p>
        <p>User: user@unnes.ac.id / user123</p>
      </div>
    </form>
  );
};