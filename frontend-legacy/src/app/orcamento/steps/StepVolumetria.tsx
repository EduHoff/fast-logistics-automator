"use client";

import { useEffect, useState } from "react";
import { styles } from "../styles";
import { WizardData } from "../types";
import { Routes } from "@/api/Routes";
import { ApiDataPayload, PurchaseOrder } from "@/domain/entities/PurchaseOrder";
import { Vehicle } from "@/domain/entities/Vehicle";
import { VehicleType } from "@/domain/enums/VehicleType";

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
        const response = await Routes.calculateOrder(data.purchaseOrder);
        setUpdatedOrder(response);
        setEditableVehicles(response.vehicles);
      } catch (error) {
        console.error(error);
        alert("Erro ao calcular a volumetria e alocação de frota.");
      } finally {
        setLoading(false);
      }
    }

    calculate();
  }, [data.purchaseOrder]);

  function updateVehicleType(
    index: number,
    vehicleType: VehicleType
  ) {
    const updated = [...editableVehicles];

    updated[index].type = vehicleType;

    setEditableVehicles(updated);
  }

  function increaseQuantity(index: number) {
    const updated = [...editableVehicles];

    updated[index].quantity += 1;

    setEditableVehicles(updated);
  }

  function decreaseQuantity(index: number) {
    const updated = [...editableVehicles];

    if (updated[index].quantity > 1) {
      updated[index].quantity -= 1;
    }

    setEditableVehicles(updated);
  }

  function addVehicle(vehicleType: VehicleType) {
    const vehicle = new Vehicle(
      VEHICLE_CAPACITY[vehicleType],
      vehicleType,
      1
    );

    setEditableVehicles([
      ...editableVehicles,
      vehicle,
    ]);

    setShowVehicleSelector(false);
  }

  function removeVehicle(index: number) {
    const updated = editableVehicles.filter(
      (_, i) => i !== index
    );

    setEditableVehicles(updated);
  }

  if (loading) {
    return <p style={{ textAlign: "center", padding: "20px" }}>Processando cubagem e alocando frota...</p>;
  }

  return (
    <>
      <div style={styles.stepHeader}>
        <span>Etapa 3 de 5</span>
        <h2>Volumetria e Frota</h2>
      </div>

      <div style={styles.summaryCard}>
        <p>
          <strong>Volume Total:</strong>{" "} {updatedOrder?.total_volume_m3} m³
        </p>

        <hr style={{ margin: "15px 0", border: "0", borderTop: "1px solid #ccc" }} />
        
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
          Frota Sugerida para o Transporte:
        </p>

        {editableVehicles.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            {editableVehicles.map((vehicle, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "15px",
                  background: "#f9fafb",
                }}
              >
                <div style={{ marginBottom: "10px" }}>
                  <label
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Tipo de veículo
                  </label>

                  <select
                    value={vehicle.type}
                    onChange={(e) =>
                      updateVehicleType(
                        index,
                        e.target.value as VehicleType
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "8px",
                      marginTop: "5px",
                    }}
                  >
                    {Object.values(VehicleType).map(
                      (type) => (
                        <option
                          key={type}
                          value={type}
                        >
                          {type}
                        </option>
                      )
                    )}
                  </select>
                </div>
                
                <div style={{ marginTop: "10px" }}>
                    <label
                      style={{
                        fontWeight: "bold",
                        display: "block",
                        marginBottom: "5px",
                      }}
                    >
                      Capacidade (m³)
                    </label>

                    <input
                      type="number"
                      min={1}
                      value={vehicle.capacity_m3}
                      onChange={(e) => {
                        const updated = [...editableVehicles];

                        updated[index].capacity_m3 = 
                          e.target.value === ""
                            ? "" as unknown as number
                            : Number(e.target.value);

                        setEditableVehicles(updated);
                      }}
                      style={{
                        width: "140px",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid #ccc", 
                      }}
                    />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >
                  <button
                    style={styles.secondaryButton}
                    onClick={() =>
                      decreaseQuantity(index)
                    }
                  >
                    -
                  </button>

                  <strong>
                    {vehicle.quantity}
                  </strong>

                  <button
                    style={styles.button}
                    onClick={() =>
                      increaseQuantity(index)
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  style={{
                    marginTop: "10px",
                    background: "#ef4444",
                    color: "#fff",
                    border: "none",
                    padding: "8px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    removeVehicle(index)
                  }
                >
                  Remover veículo
                </button>
              </div>
            ))}

            <div style={{ marginTop: "10px" }}>
              {!showVehicleSelector ? (
                <button
                  style={styles.button}
                  onClick={() =>
                    setShowVehicleSelector(true)
                  }
                >
                  + Adicionar Veículo
                </button>
              ) : (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <select
                    defaultValue="" 
                    onChange={(e) => {
                      if (!e.target.value) return;

                      addVehicle(
                        e.target.value as VehicleType
                      );
                    }}
                    style={{
                      padding: "10px",
                      borderRadius: "6px",
                    }}
                    >
                      <option value="" disabled hidden>
                        Selecione um veículo
                      </option>

                      {Object.values(VehicleType).map(
                        (type) => (
                          <option
                            key={type}
                            value={type}
                          >
                            {type}
                          </option>
                        )
                      )}
                  </select>

                  <button
                    style={styles.secondaryButton}
                    onClick={() =>
                      setShowVehicleSelector(false)
                    }
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p style={{ color: "orange" }}>
            Nenhum veículo foi necessário ou
            volume zerado.
          </p>
        )}
      </div>

      <div style={styles.buttonGroup}>
        <button
          style={styles.secondaryButton}
          onClick={back}
        >
          Voltar
        </button>

        <button
          style={styles.button}
          onClick={() => {
            if (!updatedOrder) return;

            const updatedPurchaseOrder = PurchaseOrder.fromDict(
              updatedOrder.toDict() as unknown as ApiDataPayload
            );

            updatedPurchaseOrder.vehicles.length = 0;

            editableVehicles.forEach((vehicle) => {
              updatedPurchaseOrder.add_vehicle(vehicle);
            });

            next({
              purchaseOrder: updatedPurchaseOrder,
            });
          }}
        >
          Ir para o Frete
        </button>
      </div>
    </>
  );
}