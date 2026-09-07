"use client";

import { useState } from "react";
import { WizardData } from "../types";
import { uploadOrder } from "@/services/scanner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface StepUploadOrderProps {
  data: WizardData;
  next: (data: Partial<WizardData>) => void;
}

export function StepUploadOrder({ next, data }: StepUploadOrderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const hasExistingOrder = !!data.purchaseOrder;

  async function handleUpload() {
    if (!file && hasExistingOrder) {
      if (data.purchaseOrder) {
        next({ purchaseOrder: data.purchaseOrder });
      }
      return;
    }

    if (!file) {
      toast.warning("Nenhum arquivo selecionado", {
        description: "Por favor, selecione um arquivo de pedido (.pdf ou .json).",
      });
      return;
    }

    try {
      setLoading(true);
      const purchaseOrder = await uploadOrder(file);

      toast.success("Arquivo processado com sucesso!", {
        description: "Os dados do pedido foram extraídos.",
      });

      next({ purchaseOrder });
    } catch (error) {
      console.error(error);

      toast.error("Erro ao processar o arquivo", {
        description: "Verifique a estrutura do documento e tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Upload do Pedido
        </h2>
      </div>

      <label
        className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/30 bg-accent/50 p-8 text-center transition-colors hover:border-primary/60 hover:bg-accent ${
          loading ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        }`}
      >
        <span className="text-sm font-medium text-foreground">
          Clique em qualquer lugar deste box para selecionar o arquivo (.pdf ou .json)
        </span>
        {file && (
          <span className="mt-2 text-xs font-semibold text-primary">
            Selecionado: {file.name}
          </span>
        )}

        <input
          type="file"
          accept=".pdf,.json"
          disabled={loading}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
        />
      </label>

      <div className="flex justify-end">
        <Button onClick={handleUpload} disabled={loading}>
          {loading
            ? "Processando Arquivo..."
            : hasExistingOrder && !file
            ? "Avançar com Pedido Atual"
            : "Enviar Pedido"}
        </Button>
      </div>
    </div>
  );
}
