"use client";

import { useEffect, useState } from "react";
import { styles } from "../styles";
import { WizardData } from "../types";
import { Routes } from "@/api/Routes";
import { PurchaseOrder } from "@/domain/entities/PurchaseOrder";

interface StepFreteProps {
  data: WizardData;
  next: (data: Partial<WizardData>) => void;
  back: () => void;
}

export function StepFrete({ data, next, back }: StepFreteProps) {
  const [updatedOrder, setUpdatedOrder] = useState<PurchaseOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuote() {
      if (!data.purchaseOrder) return;

      try {
        const response = await Routes.quoteOrder(data.purchaseOrder);
        
        setUpdatedOrder(response);
      } catch (err) {
        console.error(err);
        setError("Não foi possível calcular o frete para este destino.");
      }
    }

    fetchQuote();
  }, [data.purchaseOrder]);

  if (error) {
    return (
      <div style={styles.summaryCard}>
        <p style={{ color: "red" }}>{error}</p>
        <button style={styles.secondaryButton} onClick={back}>Voltar</button>
      </div>
    );
  }

  if (!updatedOrder) {
    return <p style={{ textAlign: "center", padding: "20px" }}>Calculando taxas fiscais e frete...</p>;
  }

  return (
    <>
      <div style={styles.stepHeader}>
        <span>Etapa 4 de 5</span>
        <h2>Cálculo de Frete</h2>
      </div>

      <div style={styles.summaryCard}>
        <p>
          <strong>Destino:</strong> {updatedOrder.city} - {String(updatedOrder.uf)}
        </p>
        <p>
          <strong>Cliente:</strong> {updatedOrder.customer_name}
        </p>
        <p>
          <strong>Volume Calculado:</strong> {updatedOrder.total_volume_m3} m³
        </p>
        
        <hr style={{ margin: "15px 0", border: "0", borderTop: "1px solid #ccc" }} />

        <p style={{ fontSize: "1.2rem" }}>
          <strong>Total do Frete Comercial:</strong>{" "}
          <span style={{ color: "#2e7d32", fontWeight: "bold" }}>
            R$ {updatedOrder.total_freight.toFixed(2)}
          </span>
        </p>
      </div>

      <div style={styles.buttonGroup}>
        <button style={styles.secondaryButton} onClick={back}>
          Voltar
        </button>

        <button
          style={styles.button}
          onClick={() =>
            next({
              purchaseOrder: updatedOrder,
            })
          }
        >
          Avançar para o Resumo
        </button>
      </div>
    </>
  );
}