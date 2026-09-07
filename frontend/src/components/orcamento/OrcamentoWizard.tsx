"use client";

import { useState, useEffect } from "react";
import { StepUploadOrder } from "./steps/StepUploadOrder";
import { StepRevisao } from "./steps/StepRevisao";
import { StepVolumetria } from "./steps/StepVolumetria";
import { StepFrete } from "./steps/StepFrete";
import { StepFinal } from "./steps/StepFinal";
import { WizardData, PurchaseOrder } from "./types";
import { Upload, FileText, Truck, DollarSign, CheckCircle2, Check } from "lucide-react";

const STEPS = [
  { id: 0, title: "Upload", icon: Upload },
  { id: 1, title: "Revisão", icon: FileText },
  { id: 2, title: "Volumetria", icon: Truck },
  { id: 3, title: "Frete", icon: DollarSign },
  { id: 4, title: "Resumo", icon: CheckCircle2 },
];

export function WizardComponent() {
  const [step, setStep] = useState<number>(0);
  const [data, setData] = useState<WizardData>({});

  useEffect(() => {
    const savedOrder = localStorage.getItem("purchase_order");
    const savedStep = localStorage.getItem("wizard_step");

    if (savedOrder) {
      try {
        const richOrder: PurchaseOrder = JSON.parse(savedOrder);
        const targetStep = savedStep ? parseInt(savedStep, 10) : 0;

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
    setData((prev: WizardData) => {
      const updated = { ...prev, ...newData };
      if (updated.purchaseOrder) {
        localStorage.setItem("purchase_order", JSON.stringify(updated.purchaseOrder));
      }
      return updated;
    });

    setStep((prev: number) => {
      const nextStep = prev + 1;
      localStorage.setItem("wizard_step", String(nextStep));
      return nextStep;
    });
  }

  function back() {
    setStep((prev: number) => {
      const prevStep = prev - 1;
      localStorage.setItem("wizard_step", String(prevStep));
      return prevStep;
    });
  }

  function renderStepContent() {
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

  return (
    <div className="space-y-8">
      <div className="w-full py-4 border-b bg-card rounded-lg p-4 shadow-sm">
        <nav aria-label="Progresso">
          <ol role="list" className="flex items-center justify-between w-full">
            {STEPS.map((stepItem, index) => {
              const Icon = stepItem.icon;
              const isCompleted = step > index;
              const isCurrent = step === index;

              return (
                <li
                  key={stepItem.id}
                  className={`relative flex flex-col items-center flex-1 ${
                    index !== STEPS.length - 1
                      ? "after:content-[''] after:w-full after:h-0.5 after:bg-border after:absolute after:top-5 after:left-[50%] after:z-0"
                      : ""
                  }`}
                >
                  <div
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                      isCompleted
                        ? "border-primary bg-primary text-primary-foreground"
                        : isCurrent
                        ? "border-primary bg-background text-primary ring-4 ring-primary/20"
                        : "border-muted-foreground/30 bg-background text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium truncate ${
                      isCurrent
                        ? "text-primary font-bold"
                        : isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {stepItem.title}
                  </span>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      <div className="bg-card p-6 rounded-lg border shadow-sm">
        {renderStepContent()}
      </div>
    </div>
  );
}
