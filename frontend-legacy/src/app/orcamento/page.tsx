"use client";

import { WizardComponent } from "./OrcamentoWizard";
import { styles } from "./styles";

export default function OrcamentoPage() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Novo Orçamento</h1>
        <WizardComponent />
      </div>
    </div>
  );
}