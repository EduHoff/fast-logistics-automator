"use client";

import { useState } from "react";
import { styles } from "../styles";
import { WizardData } from "../types";
import { Routes } from "@/api/Routes";

interface StepUploadOrderProps {
  data: WizardData; // Adicionado aqui
  next: (data: Partial<WizardData>) => void;
}

export function StepUploadOrder({ next, data }: StepUploadOrderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const hasExistingOrder = !!data.purchaseOrder;

  async function handleUpload() {
    if (!file && hasExistingOrder) {
      next({ purchaseOrder: data.purchaseOrder });
      return;
    }

    if (!file) {
      alert("Por favor, selecione um arquivo de pedido (PDF ou JSON).");
      return;
    }

    try {
      setLoading(true);
      const purchaseOrder = await Routes.uploadOrder(file);
      next({ purchaseOrder });
    } catch (error) {
      console.error(error);
      alert("Erro ao processar o arquivo do pedido. Verifique a estrutura e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div style={styles.stepHeader}>
        <span>Etapa 1 de 5</span>
        <h2>Upload do Pedido</h2>
      </div>

      <label 
        style={{
          ...styles.uploadContainer,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: loading ? "not-allowed" : "pointer",
          padding: "20px",
        }}
      >
        <span style={{ fontSize: "1rem", color: "#333", marginBottom: "12px", textAlign: "center" }}>
          Clique em qualquer lugar deste box para selecionar o arquivo (.pdf ou .json)
        </span>

        <input
          type="file"
          accept=".pdf,.json" 
          disabled={loading}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </label>

      <button style={styles.button} onClick={handleUpload} disabled={loading}>
        {loading ? "Processando Arquivo..." : hasExistingOrder && !file ? "Avançar com Pedido Atual" : "Enviar Pedido"}
      </button>
    </>
  );
}