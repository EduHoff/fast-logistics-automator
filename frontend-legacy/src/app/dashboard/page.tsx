"use client";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div style={{ padding: "40px", textAlign: "center", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#d35400" }}>Área do ADMIN</h1>
      <p>Painel de controle administrativo da FAST Logística.</p>
      <button 
        onClick={() => router.push("/login")}
        style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
      >
        Sair
      </button>
    </div>
  );
}