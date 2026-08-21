"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "presentation/services/AuthService";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const authService = new AuthService();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      alert("Por favor, preencha o e-mail e a senha.");
      return;
    }

    try {
      setLoading(true);

      const user = await authService.login(email, password);

      if (user.isAdmin()) {
        router.push("/dashboard");
      } else {
        router.push("/orcamento");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      alert("E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <Image
          src="/Logo-FAST-Ariam.png"
          alt="FAST Logo"
          width={180}
          height={60}
          style={{ alignSelf: "center", marginBottom: "10px" }}
        />

        <h1 style={styles.title}>FAST Logística</h1>

        <input
          style={styles.input}
          placeholder="Email"
          type="email"
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          style={{
            ...styles.primaryButton,
            opacity: loading ? 0.7 : 1,
          }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <button
          style={styles.secondaryButton}
          onClick={() => router.push("/register")}
        >
          Criar conta
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column" as const,
    gap: "15px",
    width: "320px",
    transition: "transform 0.2s",
  },

  title: {
    textAlign: "center" as const,
    color: "#1E3A8A",
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #93C5FD",
    outline: "none",
  },

  primaryButton: {
    backgroundColor: "#3B82F6",
    color: "#fff",
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  secondaryButton: {
    backgroundColor: "#DBEAFE",
    color: "#1E3A8A",
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
  },
};