"use client";

import { WizardComponent } from "@/components/orcamento/OrcamentoWizard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrcamentoPage() {
  return (
    <div className="min-h-screen bg-background flex justify-center items-center p-4 md:p-8">
      <Card className="w-full max-w-4xl shadow-lg border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Novo Orçamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WizardComponent />
        </CardContent>
      </Card>
    </div>
  );
}