"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { User as UserType, UserRole } from "@/types";
import { logoutUser } from "@/services/auth";

export function UserNavDrawer() {
  const [user, setUser] = useState<UserType | null>(() => {
    if (typeof window === "undefined") return null;
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  const handleOpenChange = (open: boolean) => {
    if (open && typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(null);
        }
      }
    }
  };

  return (
    <Sheet onOpenChange={handleOpenChange}>
      <SheetTrigger
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        aria-label="Abrir menu"
      >
        <Menu className="h-6 w-6" />
      </SheetTrigger>

      <SheetContent side="right" className="flex flex-col justify-between w-80">
        <div className="space-y-6 pt-4">
          <SheetHeader className="text-left">
            <SheetTitle>Menu do Usuário</SheetTitle>
          </SheetHeader>

          <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
            <div className="p-2 bg-background rounded-full border mt-0.5">
              <UserIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col truncate w-full">
              <span className="text-sm font-semibold truncate capitalize">
                {user?.name || "Usuário"}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {user?.email || "Sem e-mail"}
              </span>
              {user?.id && (
                <span className="text-[10px] text-slate-400 font-mono mt-1 truncate">
                  ID: {user.id}
                </span>
              )}
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            {user?.role === UserRole.ADMIN && (
              <Link
                href="/dashboard"
                className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors"
              >
                Dashboard
              </Link>
            )}
            <Link
              href="/orcamento"
              className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors"
            >
              Novo Orçamento
            </Link>
          </nav>
        </div>

        <div className="border-t pt-4">
          <Button
            variant="destructive"
            className="w-full flex items-center justify-center gap-2"
            onClick={logoutUser}
          >
            <LogOut className="h-4 w-4" />
            Sair da Conta
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}