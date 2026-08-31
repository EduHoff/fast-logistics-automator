"use client";

import { useEffect, useState } from "react";
import { WizardData } from "../types";
import { calculateOrderVolume } from "@/services/orders";
import { PurchaseOrder, Vehicle } from "@/types";
import { VehicleType } from "@/types/enums";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    async function calculate() {
      if (!data.purchaseOrder) return;

      try {
        const response = await calculateOrderVolume(data.purchaseOrder);
        setUpdatedOrder(response);
        setEditableVehicles(response.vehicles || []);
      } catch (error) {
        console.error(error);
        alert("Erro ao calcular a volumetria e alocação de frota.");
      } finally {
        setLoading(false);
      }
    }

    calculate();
  }, [data.purchaseOrder]);

  function updateVehicleType(index: number, vehicleType: VehicleType) {
    setEditableVehicles((prev) =>
      prev.map((v, i) => (i === index ? { ...v, type: vehicleType } : v))
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
      capacity_m3: VEHICLE_CAPACITY[vehicleType],
      type: vehicleType,
      quantity: 1,
    };
    setEditableVehicles((prev) => [...prev, vehicle]);
    setShowVehicleSelector(false);
  }

  function removeVehicle(index: number) {
    setEditableVehicles((prev) => prev.filter((_, i) => i !== index));
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
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Etapa 3 de 5
        </span>
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

        <p className="text-sm font-semibold">
          Frota Sugerida para o Transporte:
        </p>

        {editableVehicles.length > 0 ? (
          <div className="space-y-4">
            {editableVehicles.map((vehicle, index) => (
              <div
                key={index}
                className="rounded-lg border bg-muted/30 p-4 space-y-3"
              >
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Tipo de veículo
                  </label>
                  <select
                    value={vehicle.type}
                    onChange={(e) =>
                      updateVehicleType(index, e.target.value as VehicleType)
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    {Object.values(VehicleType).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
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
                    className="w-36"
                  />
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => decreaseQuantity(index)}
                  >
                    -
                  </Button>
                  <span className="font-bold text-sm w-4 text-center">
                    {vehicle.quantity}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => increaseQuantity(index)}
                  >
                    +
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeVehicle(index)}
                  className="w-full mt-2"
                >
                  Remover veículo
                </Button>
              </div>
            ))}

            {!showVehicleSelector ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowVehicleSelector(true)}
              >
                + Adicionar Veículo
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <select
                  defaultValue=""
                  onChange={(e) => {
                    if (!e.target.value) return;
                    addVehicle(e.target.value as VehicleType);
                  }}
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="" disabled hidden>
                    Selecione um veículo
                  </option>
                  {Object.values(VehicleType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                <Button
                  variant="ghost"
                  onClick={() => setShowVehicleSelector(false)}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-amber-600 dark:text-amber-500 font-medium">
            Nenhum veículo foi necessário ou volume zerado.
          </p>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={back}>
          Voltar
        </Button>

        <Button
          onClick={() => {
            if (!updatedOrder) return;
            const updatedPurchaseOrder: PurchaseOrder = {
              ...updatedOrder,
              vehicles: editableVehicles,
            };

            next({ purchaseOrder: updatedPurchaseOrder });
          }}
        >
          Ir para o Frete
        </Button>
      </div>
    </div>
  );
}
