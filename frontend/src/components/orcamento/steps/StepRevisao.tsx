"use client";

import { WizardData } from "../types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface StepRevisaoProps {
  data: WizardData;
  next: (data: Partial<WizardData>) => void;
  back: () => void;
}

export function StepRevisao({ data, next, back }: StepRevisaoProps) {
  const purchaseOrder = data.purchaseOrder;

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Etapa 2 de 5
        </span>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Revisão dos Itens
        </h2>
      </div>

      <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm space-y-2 text-sm">
        <p>
          <strong className="font-semibold">Pedido:</strong> {purchaseOrder?.order_number}
        </p>
        <p>
          <strong className="font-semibold">Cliente:</strong> {purchaseOrder?.customer_name}
        </p>
        <p>
          <strong className="font-semibold">Cidade:</strong>{" "}
          {purchaseOrder?.city} - {purchaseOrder?.uf ?? ""}
        </p>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Qtd</TableHead>
              <TableHead>Un</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchaseOrder?.items?.map((item, index: number) => (
              <TableRow key={index}>
                <TableCell className="font-mono text-xs">{item.code}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell>{String(item.unit)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={back}>
          Voltar
        </Button>
        <Button
          onClick={() => {
            if (purchaseOrder) {
              next({ purchaseOrder });
            }
          }}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
}