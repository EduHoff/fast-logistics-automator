"use client";

import { styles } from "../styles";
import { WizardData } from "../types";
import { getUFAbbreviation } from "@/domain/enums/UF";

interface StepRevisaoProps {
  data: WizardData;
  next: (data: Partial<WizardData>) => void;
  back: () => void;
}

export function StepRevisao({ data, next, back }: StepRevisaoProps) {
  const purchaseOrder = data.purchaseOrder;

  return (
    <>
      <div style={styles.stepHeader}>
        <span>Etapa 2 de 5</span>
        <h2>Revisão dos Itens</h2>
      </div>

      <div style={styles.summaryCard}>
        <p>
          <strong>Pedido:</strong> {purchaseOrder?.order_number}
        </p>

        <p>
          <strong>Cliente:</strong> {purchaseOrder?.customer_name}
        </p>

        <p>
          <strong>Cidade:</strong>{" "}
          {purchaseOrder?.city} - {purchaseOrder ? getUFAbbreviation(purchaseOrder.uf) : ""}
        </p>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Código</th>
              <th>Descrição</th>
              <th>Qtd</th>
              <th>Un</th>
            </tr>
          </thead>

          <tbody>
            {purchaseOrder?.items?.map((item, index: number) => (
              <tr key={index}>
                <td>{item.code}</td>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>{String(item.unit)}</td> 
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.buttonGroup}>
        <button style={styles.secondaryButton} onClick={back}>
          Voltar
        </button>

        <button
          style={styles.button}
          onClick={() => next({ purchaseOrder })}
        >
          Próximo
        </button>
      </div>
    </>
  );
}