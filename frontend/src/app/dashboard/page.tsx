"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-orange-600 dark:text-orange-500">
          Área do ADMIN
        </h1>

        <p className="text-muted-foreground">
          Painel de controle administrativo da Fast Logistics.
        </p>

        <div className="pt-4">
          <Button
            variant="outline"
            onClick={() => router.push("/login")}
          >
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
}
