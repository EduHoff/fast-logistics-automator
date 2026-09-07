"use client";

import { useEffect, useState } from "react";
import { WizardData } from "../types";
import { calculateOrderVolume } from "@/services/orders";
import { PurchaseOrder, Vehicle } from "@/types";
import { VehicleType } from "@/types/enums";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface StepVolumetriaProps {
  data: WizardData;
  next: (data: Partial<WizardData>) => void;
  back: () => void;
}

const VEHICLE_CAPACITY: Record<VehicleType, number> = {
  [VehicleType.TRUCK]: 45,
  [VehicleType.CARRETA]: 90,
};

export function StepVolumetria({ data, next, back }: StepVolumetriaProps) {
  const [loading, setLoading] = useState(true);
  const [updatedOrder, setUpdatedOrder] = useState<PurchaseOrder | null>(null);
  const [editableVehicles, setEditableVehicles] = useState<Vehicle[]>([]);
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);

  useEffect(() => {
    async function initVolumetria() {
      if (!data.purchaseOrder) return;

      if (
        data.purchaseOrder.vehicles &&
        data.purchaseOrder.vehicles.length > 0
      ) {
        setUpdatedOrder(data.purchaseOrder);
        setEditableVehicles(data.purchaseOrder.vehicles);
        setLoading(false);
        return;
      }

      try {
        const response = await calculateOrderVolume(data.purchaseOrder);
        setUpdatedOrder(response);
        setEditableVehicles(response.vehicles || []);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao calcular volumetria", {
          description:
            "Ocorreu uma falha ao realizar a cubagem e alocação automática de frota.",
        });
      } finally {
        setLoading(false);
      }
    }

    initVolumetria();
  }, [data.purchaseOrder]);

  function updateVehicleType(index: number, vehicleType: VehicleType) {
    setEditableVehicles((prev) =>
      prev.map((v, i) =>
        i === index
          ? {
              ...v,
              type: vehicleType,
              capacity_m3: VEHICLE_CAPACITY[vehicleType] ?? v.capacity_m3,
            }
          : v
      )
    );
  }

  function increaseQuantity(index: number) {
    setEditableVehicles((prev) =>
      prev.map((v, i) => (i === index ? { ...v, quantity: v.quantity + 1 } : v))
    );
  }

  function decreaseQuantity(index: number) {
    setEditableVehicles((prev) =>
      prev.map((v, i) =>
        i === index && v.quantity > 1 ? { ...v, quantity: v.quantity - 1 } : v
      )
    );
  }

  function addVehicle(vehicleType: VehicleType) {
    const vehicle: Vehicle = {
      capacity_m3: VEHICLE_CAPACITY[vehicleType] ?? 0,
      type: vehicleType,
      quantity: 1,
    };
    setEditableVehicles((prev) => [...prev, vehicle]);
    setShowVehicleSelector(false);
  }

  function removeVehicle(index: number) {
    setEditableVehicles((prev) => prev.filter((_, i) => i !== index));
  }

  function handleNext() {
    if (!updatedOrder) return;

    const totalVolume = updatedOrder.total_volume_m3 ?? 0;

    if (totalVolume <= 0) {
      toast.error("Volume total inválido", {
        description:
          "O volume total do pedido é 0 m³. Verifique os itens do pedido antes de prosseguir.",
      });
      return;
    }

    if (editableVehicles.length === 0) {
      toast.warning("Nenhum veículo alocado", {
        description:
          "Adicione pelo menos um veículo à frota antes de prosseguir.",
      });
      return;
    }

    const hasInvalidCapacity = editableVehicles.some(
      (v) => !v.capacity_m3 || v.capacity_m3 <= 0
    );

    if (hasInvalidCapacity) {
      toast.warning("Capacidade inválida", {
        description:
          "Todos os veículos alocados devem possuir uma capacidade maior que 0 m³.",
      });
      return;
    }

    const totalFleetCapacity = editableVehicles.reduce(
      (acc, v) => acc + v.capacity_m3 * v.quantity,
      0
    );

    if (totalFleetCapacity < totalVolume) {
      const deficit = (totalVolume - totalFleetCapacity).toFixed(2);
      toast.warning("Capacidade de frota insuficiente", {
        description: `A capacidade total selecionada (${totalFleetCapacity} m³) é inferior ao volume do pedido (${totalVolume} m³). Faltam ${deficit} m³.`,
      });
    } else {
      toast.success("Volumetria e frota confirmadas!", {
        description: "Avançando para a etapa de cálculo de frete.",
      });
    }

    const updatedPurchaseOrder: PurchaseOrder = {
      ...updatedOrder,
      vehicles: editableVehicles,
    };

    next({ purchaseOrder: updatedPurchaseOrder });
  }

  if (loading) {
    return (
      <p className="text-center py-8 text-muted-foreground">
        Processando cubagem e alocando frota...
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Volumetria e Frota
        </h2>
      </div>

      <div className="rounded-lg border bg-card p-4 space-y-4">
        <p className="text-sm">
          <strong className="font-semibold">Volume Total:</strong>{" "}
          {updatedOrder?.total_volume_m3 ?? 0} m³
        </p>

        <hr className="border-border" />

        <div className="space-y-3">
          <p className="text-sm font-semibold">
            Frota Sugerida para o Transporte:
          </p>

          {editableVehicles.length > 0 ? (
            <div className="space-y-2">
              {editableVehicles.map((vehicle, index) => (
                <div
                  key={index}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-muted/20 p-3"
                >
                  <div className="flex-1 min-w-35">
                    <label className="text-[10px] font-semibold text-muted-foreground block mb-0.5">
                      Tipo de Veículo
                    </label>
                    <select
                      value={vehicle.type}
                      onChange={(e) =>
                        updateVehicleType(index, e.target.value as VehicleType)
                      }
                      className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      {Object.values(VehicleType).map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-28">
                    <label className="text-[10px] font-semibold text-muted-foreground block mb-0.5">
                      Capacidade (m³)
                    </label>
                    <Input
                      type="number"
                      min={1}
                      value={vehicle.capacity_m3}
                      onChange={(e) => {
                        const val =
                          e.target.value === "" ? 0 : Number(e.target.value);
                        setEditableVehicles((prev) =>
                          prev.map((v, i) =>
                            i === index ? { ...v, capacity_m3: val } : v
                          )
                        );
                      }}
                      className="h-8 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground block mb-0.5 text-center">
                      Qtd.
                    </label>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-xs"
                        onClick={() => decreaseQuantity(index)}
                      >
                        -
                      </Button>
                      <span className="font-bold text-xs w-6 text-center">
                        {vehicle.quantity}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-xs"
                        onClick={() => increaseQuantity(index)}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-end self-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeVehicle(index)}
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      title="Remover veículo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-amber-600 dark:text-amber-500 font-medium py-1">
              Nenhum veículo selecionado no momento.
            </p>
          )}

          {!showVehicleSelector ? (
            <Button
              variant="outline"
              size="sm"
              className="w-full border-dashed"
              onClick={() => setShowVehicleSelector(true)}
            >
              <Plus className="h-4 w-4 mr-1.5" /> Adicionar Veículo
            </Button>
          ) : (
            <div className="flex items-center gap-2 pt-1">
              <select
                defaultValue=""
                onChange={(e) => {
                  if (!e.target.value) return;
                  addVehicle(e.target.value as VehicleType);
                }}
                className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="" disabled hidden>
                  Selecione o tipo de veículo...
                </option>
                {Object.values(VehicleType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => setShowVehicleSelector(false)}
              >
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={back}>
          Voltar
        </Button>

        <Button onClick={handleNext}>Ir para o Frete</Button>
      </div>
    </div>
  );
}