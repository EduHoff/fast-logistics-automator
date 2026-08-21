"use client";

import { useState, useEffect } from "react";
import { StepUploadOrder } from "./steps/StepUploadOrder";
import { StepRevisao } from "./steps/StepRevisao";
import { StepVolumetria } from "./steps/StepVolumetria";
import { StepFrete } from "./steps/StepFrete";
import { StepFinal } from "./steps/StepFinal";
import { WizardData } from "./types";
import { ApiDataPayload, PurchaseOrder } from "@/domain/entities/PurchaseOrder";

export function WizardComponent() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>({});

  useEffect(() => {
    const savedOrder = localStorage.getItem("purchase_order");
    const savedStep = localStorage.getItem("wizard_step");
    
    if (savedOrder) {
      try {
        const parsed = JSON.parse(savedOrder);
        const richOrder = PurchaseOrder.fromDict(parsed);

        const targetStep = savedStep ? parseInt(savedStep, 10) : 1;

        setTimeout(() => {
          setData({ purchaseOrder: richOrder });
          setStep(targetStep);
        }, 0);
        
      } catch (e) {
        console.error("Erro ao restaurar pedido do localStorage:", e);
      }
    }
  }, []);

  function next(newData: Partial<WizardData>) {
    let nextStep = 0;

    setData((prev) => {
      const updated = { ...prev, ...newData };
      
      if (updated.purchaseOrder && !(updated.purchaseOrder instanceof PurchaseOrder)) {
        updated.purchaseOrder = PurchaseOrder.fromDict(
          updated.purchaseOrder as unknown as ApiDataPayload
        );
      }
      return updated;
    });

    setStep((prev) => {
      nextStep = prev + 1;
      localStorage.setItem("wizard_step", String(nextStep));
      return nextStep;
    });
  }

  function back() {
    setStep((prev) => {
      const prevStep = prev - 1;
      localStorage.setItem("wizard_step", String(prevStep));
      return prevStep;
    });
  }

  switch (step) {
    case 0:
      return <StepUploadOrder next={next} data={data} />;
    case 1:
      return <StepRevisao data={data} next={next} back={back} />;
    case 2:
      return <StepVolumetria data={data} next={next} back={back} />;
    case 3:
      return <StepFrete data={data} next={next} back={back} />;
    case 4:
      return (
        <StepFinal
          purchaseOrder={data.purchaseOrder!}
          back={back}
          onSuccess={() => {
            setData({}); 
            setStep(0); 
            localStorage.removeItem("purchase_order");
            localStorage.removeItem("wizard_step");
          }}
        />
      );
    default:
      return <div>Fim do Fluxo</div>;
  }
}