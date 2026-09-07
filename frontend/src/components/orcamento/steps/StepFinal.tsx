"use client";

import { useState } from "react";
import { saveOrderToDatabase } from "@/services/orders";
import { PurchaseOrder, Vehicle } from "@/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
      await saveOrderToDatabase(purchaseOrder);

      toast.success("Pedido salvo com sucesso!", {
        description: `O pedido ${purchaseOrder.order_number} foi registrado no sistema.`,
      });

      onSuccess();
    } catch (error) {
      console.error(error);

      toast.error("Erro ao salvar o pedido", {
        description: "Ocorreu uma falha ao conectar com o servidor. Tente novamente.",
      });

      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Resumo Final
        </h2>
      </div>

      <div className="rounded-lg border bg-card p-4 text-card-foreground space-y-2 text-sm">
        <p>
          <strong className="font-semibold">Pedido:</strong>{" "}
          {purchaseOrder.order_number}
        </p>
        <p>
          <strong className="font-semibold">Cliente:</strong>{" "}
          {purchaseOrder.customer_name}
        </p>
        <p>
          <strong className="font-semibold">Volume Total:</strong>{" "}
          {purchaseOrder.total_volume_m3 ?? 0} m³
        </p>
        <p>
          <strong className="font-semibold">Veículos Alocados:</strong>{" "}
          {purchaseOrder.vehicles && purchaseOrder.vehicles.length > 0
            ? purchaseOrder.vehicles
                .map((v: Vehicle) => `${v.quantity}x ${v.type}`)
                .join(", ")
            : "Nenhum veículo alocado"}
        </p>
        <p>
          <strong className="font-semibold">Frete Final:</strong> R${" "}
          {Number(purchaseOrder.total_freight ?? 0).toFixed(2)}
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={back} disabled={isSaving}>
          Voltar
        </Button>

        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Salvando..." : "Confirmar Pedido"}
        </Button>
      </div>
    </div>
  );
}
