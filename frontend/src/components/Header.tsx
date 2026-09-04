"use client";

import Image from "next/image";
import { UserNavDrawer } from "@/components/UserNavDrawer";

export function Header() {
  return (
    <header className="w-full border-b bg-background px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="font-bold">Fast Logistics</span>
      </div>

      <Image
        src="/fast-ariam-logo.png"
        alt="FAST Logo"
        width={180}
        height={60}
        priority
      />

      <UserNavDrawer />
    </header>
  );
}
