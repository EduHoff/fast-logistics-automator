"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/auth";
import { UserRole } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.warning("Campos obrigatórios não preenchidos", {
        description: "Por favor, informe seu e-mail e senha para acessar.",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser({ email, password });

      toast.success(`Bem-vindo, ${response.user.name || "usuário"}!`);

      if (response.user.role === UserRole.ADMIN) {
        router.push("/dashboard");
      } else {
        router.push("/orcamento");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      toast.error("Falha na autenticação", {
        description: "E-mail ou senha incorretos. Verifique suas credenciais.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm shadow-md">
      <CardHeader className="flex flex-col items-center space-y-2 pb-4">
        <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Login
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
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