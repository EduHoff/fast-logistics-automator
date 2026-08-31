"use client";

import { useEffect, useState } from "react";
import { WizardData } from "../types";
import { quoteOrderFreight } from "@/services/orders";
import { PurchaseOrder } from "@/types";
import { Button } from "@/components/ui/button";

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
        const response = await quoteOrderFreight(data.purchaseOrder);
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
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 space-y-4">
        <p className="text-sm font-medium text-destructive">{error}</p>
        <Button variant="outline" onClick={back}>
          Voltar
        </Button>
      </div>
    );
  }

  if (!updatedOrder) {
    return (
      <p className="text-center py-8 text-muted-foreground">
        Calculando taxas fiscais e frete...
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Etapa 4 de 5
        </span>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Cálculo de Frete
        </h2>
      </div>

      <div className="rounded-lg border bg-card p-4 text-card-foreground space-y-2 text-sm">
        <p>
          <strong className="font-semibold">Destino:</strong> {updatedOrder.city} - {String(updatedOrder.uf)}
        </p>
        <p>
          <strong className="font-semibold">Cliente:</strong> {updatedOrder.customer_name}
        </p>
        <p>
          <strong className="font-semibold">Volume Calculado:</strong> {updatedOrder.total_volume_m3 ?? 0} m³
        </p>

        <hr className="border-border my-3" />

        <p className="text-base font-semibold">
          Total do Frete Comercial:{" "}
          <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">
            R$ {(updatedOrder.total_freight ?? 0).toFixed(2)}
          </span>
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={back}>
          Voltar
        </Button>

        <Button onClick={() => next({ purchaseOrder: updatedOrder })}>
          Avançar para o Resumo
        </Button>
      </div>
    </div>
  );
}