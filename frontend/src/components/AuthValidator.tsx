"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserRole } from "@/types";

function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length < 2 || !parts[1]) return true;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const { exp } = JSON.parse(jsonPayload);
    const now = Math.floor(Date.now() / 1000);

    return exp < now;
  } catch {
    return true;
  }
}

export function AuthValidator({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Usamos microtask (queueMicrotask) para adiar a atualização de estado
    // evitando o alerta de setState síncrono no efeito.
    queueMicrotask(() => {
      const savedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      const isPublicRoute = pathname === "/login" || pathname === "/register";

      if (!token || !savedUser || isTokenExpired(token)) {
        if (token || savedUser) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("purchase_order");
        }

        if (!isPublicRoute) {
          router.push("/login");
        }
        setIsChecking(false);
        return;
      }

      if (isPublicRoute) {
        try {
          const user = JSON.parse(savedUser);
          if (user.role === UserRole.ADMIN) {
            router.push("/dashboard");
          } else {
            router.push("/orcamento");
          }
        } catch {
          router.push("/login");
        }
      }

      setIsChecking(false);
    });
  }, [pathname, router]);

  const isPublicRoute = pathname === "/login" || pathname === "/register";
  if (isChecking && !isPublicRoute) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 text-sm font-medium text-slate-500">
        Carregando sessão...
      </div>
    );
  }

  return <>{children}</>;
}