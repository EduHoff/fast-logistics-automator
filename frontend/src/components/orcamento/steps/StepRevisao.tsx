"use client";

import { useState } from "react";
import { WizardData } from "../types";
import { PurchaseOrder, Product } from "@/types";
import { Category, UnitType, UF } from "@/types/enums";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface StepRevisaoProps {
  data: WizardData;
  next: (data: Partial<WizardData>) => void;
  back: () => void;
}

export function StepRevisao({ data, next, back }: StepRevisaoProps) {
  const [order, setOrder] = useState<PurchaseOrder | null>(
    data.purchaseOrder || null
  );

  function handleOrderChange(field: keyof PurchaseOrder, value: string) {
    if (!order) return;
    setOrder({
      ...order,
      [field]: value,
    });
  }

  function handleItemChange(
    index: number,
    field: keyof Product,
    value: string | number
  ) {
    if (!order) return;

    const updatedItems = order.items.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          [field]: value,
        };
      }
      return item;
    });

    setOrder({
      ...order,
      items: updatedItems,
    });
  }

  function addItem() {
    if (!order) return;

    const newItem: Product = {
      code: "",
      description: "",
      quantity: 1,
      unit: UnitType.PC,
      category: Category.LSG,
    };

    setOrder({
      ...order,
      items: [...(order.items || []), newItem],
    });
  }

  function removeItem(index: number) {
    if (!order) return;

    setOrder({
      ...order,
      items: order.items.filter((_, i) => i !== index),
    });
  }

  function handleNext() {
    if (!order) return;

    if (
      !order.order_number?.trim() ||
      !order.customer_name?.trim() ||
      !order.city?.trim() ||
      !order.uf?.trim()
    ) {
      toast.warning("Dados do cabeçalho incompletos", {
        description:
          "Preencha o Nº do Pedido, Cliente, Cidade e UF antes de prosseguir.",
      });
      return;
    }

    if (!order.items || order.items.length === 0) {
      toast.warning("Nenhum item informado", {
        description: "O pedido precisa ter pelo menos um item cadastrado.",
      });
      return;
    }

    const hasInvalidItem = order.items.some(
      (item) =>
        !item.code?.trim() ||
        !item.description?.trim() ||
        !item.quantity ||
        item.quantity <= 0
    );

    if (hasInvalidItem) {
      toast.warning("Itens incompletos ou inválidos", {
        description:
          "Certifique-se de que todos os itens tenham código, descrição e quantidade maior que zero.",
      });
      return;
    }

    toast.success("Revisão de itens concluída!", {
      description: "Avançando para o cálculo de volumetria.",
    });

    next({ purchaseOrder: order });
  }

  if (!order) {
    return (
      <p className="text-center py-8 text-muted-foreground">
        Nenhum pedido carregado para revisão.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Revisão dos Itens
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Confira, edite, adicione ou remova itens extraídos do pedido antes de prosseguir.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
        <div>
          <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
            Nº do Pedido
          </label>
          <Input
            value={order.order_number || ""}
            onChange={(e) => handleOrderChange("order_number", e.target.value)}
            className="h-8 text-xs font-mono"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
            Cliente
          </label>
          <Input
            value={order.customer_name || ""}
            onChange={(e) => handleOrderChange("customer_name", e.target.value)}
            className="h-8 text-xs"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
              Cidade
            </label>
            <Input
              value={order.city || ""}
              onChange={(e) => handleOrderChange("city", e.target.value)}
              className="h-8 text-xs"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
              UF
            </label>
            <select
              value={order.uf || ""}
              onChange={(e) => handleOrderChange("uf", e.target.value)}
              className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">--</option>
              {Object.values(UF).map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead className="w-27.5">Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="w-35">Categoria</TableHead>
                <TableHead className="w-20 text-right">Qtd</TableHead>
                <TableHead className="w-20">Un</TableHead>
                <TableHead className="w-10 text-center"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items?.length > 0 ? (
                order.items.map((item, index) => (
                  <TableRow key={index} className="p-0">
                    <TableCell className="p-1.5">
                      <Input
                        value={item.code}
                        onChange={(e) =>
                          handleItemChange(index, "code", e.target.value)
                        }
                        className="h-7 text-xs font-mono"
                      />
                    </TableCell>

                    <TableCell className="p-1.5">
                      <Input
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(index, "description", e.target.value)
                        }
                        className="h-7 text-xs"
                      />
                    </TableCell>

                    <TableCell className="p-1.5">
                      <select
                        value={item.category}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "category",
                            e.target.value as Category
                          )
                        }
                        className="w-full h-7 rounded-md border border-input bg-background px-2 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        {Object.values(Category).map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </TableCell>

                    <TableCell className="p-1.5">
                      <Input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => {
                          const val =
                            e.target.value === "" ? 0 : Number(e.target.value);
                          handleItemChange(index, "quantity", val);
                        }}
                        className="h-7 text-xs text-right font-mono"
                      />
                    </TableCell>

                    <TableCell className="p-1.5">
                      <select
                        value={item.unit}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "unit",
                            e.target.value as UnitType
                          )
                        }
                        className="w-full h-7 rounded-md border border-input bg-background px-2 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        {Object.values(UnitType).map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    </TableCell>

                    <TableCell className="p-1.5 text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        className="h-7 w-7 text-destructive hover:bg-destructive/10"
                        title="Remover item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-4 text-xs text-muted-foreground"
                  >
                    Nenhum item na lista. Clique abaixo para adicionar um item.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          className="w-full border-dashed text-xs"
        >
          <Plus className="h-3.5 w-3.5 mr-1" /> Adicionar Item
        </Button>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={back}>
          Voltar
        </Button>
        <Button onClick={handleNext}>Próximo</Button>
      </div>
    </div>
  );
}