"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "presentation/services/AuthService";
import { UserRole } from "domain/enums/UserRole";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const authService = new AuthService();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.OPERATOR);
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    try {
      setLoading(true);
      await authService.register({ name, email, password, role });
      router.push("/login");
    } catch {
      alert("Erro ao cadastrar");
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
          style={{ alignSelf: "center" }}
        />

        <h1 style={styles.title}>Criar Conta</h1>

        <input
          style={styles.input}
          placeholder="Nome"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Senha"
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          style={styles.input}
          onChange={(e) => setRole(e.target.value as UserRole)}
        >
          <option value="OPERATOR">Operador</option>
          <option value="ADMIN">Administrador</option>
        </select>

        <button
          style={{
            ...styles.primaryButton,
            opacity: loading ? 0.7 : 1,
          }}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Criando..." : "Criar conta"}
        </button>

        <button
          style={styles.secondaryButton}
          onClick={() => router.push("/login")}
        >
          Voltar para login
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