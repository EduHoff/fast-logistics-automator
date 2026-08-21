"use client";

import { useState } from "react";
import { styles } from "../styles";
import { Routes } from "@/api/Routes";
import { PurchaseOrder } from "@/domain/entities/PurchaseOrder";

interface StepFinalProps {
  purchaseOrder: PurchaseOrder;
  back: () => void;
  onSuccess: () => void;
}

export function StepFinal({ purchaseOrder, back, onSuccess }: StepFinalProps) {
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    if (isSaving) return;

    try {
      setIsSaving(true);
      
      await Routes.saveOrder(purchaseOrder);

      alert("Pedido salvo com sucesso");
      
      onSuccess();
      
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar o pedido");
      setIsSaving(false);
    }
  }

  return (
    <>
      <div style={styles.stepHeader}>
        <span>Etapa 5 de 5</span>
        <h2>Resumo Final</h2>
      </div>

      <div style={styles.summaryCard}>
        <p>
          <strong>Pedido:</strong> {purchaseOrder.order_number}
        </p>

        <p>
          <strong>Cliente:</strong> {purchaseOrder.customer_name}
        </p>

        <p>
          <strong>Volume Total:</strong> {purchaseOrder.total_volume_m3} m³
        </p>

        <p>
          <strong>Veículos Alocados:</strong>{" "}
          {purchaseOrder.vehicles.length > 0
            ? purchaseOrder.vehicles
                .map((v) => `${v.quantity}x ${v.type}`)
                .join(", ")
            : "Nenhum veículo alocado"}
        </p>

        <p>
          <strong>Frete Final:</strong> R$ {purchaseOrder.total_freight.toFixed(2)}
        </p>
      </div>

      <div style={styles.buttonGroup}>
        <button 
          style={styles.secondaryButton} 
          onClick={back}
          disabled={isSaving}
        >
          Voltar
        </button>

        <button 
          style={styles.button} 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Salvando..." : "Confirmar Pedido"}
        </button>
      </div>
    </>
  );
}