"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthValidator({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  function isTokenExpired(token: string): boolean {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
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

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !savedUser || isTokenExpired(token)) {
      if (token || savedUser) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("purchase_order");
      }
      
      if (pathname !== "/login" && pathname !== "/register") {
        router.push("/login");
      }
      return;
    }

    if (pathname === "/login" || pathname === "/register") {
      const user = JSON.parse(savedUser);
      if (user.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/orcamento");
      }
    }
  }, [pathname, router]);

  return <>{children}</>;
}