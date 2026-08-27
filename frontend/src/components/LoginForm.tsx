"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { loginUser } from "@/services/auth";
import { UserRole } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor, preencha o e-mail e a senha.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await loginUser({ email, password });

      if (response.user.role === UserRole.ADMIN) {
        router.push("/dashboard");
      } else {
        router.push("/orcamento");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      setError("E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm shadow-md">
      <CardHeader className="flex flex-col items-center space-y-2 pb-4">
        <Image
          src="/Logo-FAST-Ariam.png"
          alt="FAST Logo"
          width={180}
          height={60}
          priority
        />
        <CardTitle className="text-xl font-bold text-slate-800">FAST Logística</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="rounded bg-red-50 p-2 text-center text-xs text-red-600 border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => router.push("/register")}
            disabled={loading}
          >
            Criar conta
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
