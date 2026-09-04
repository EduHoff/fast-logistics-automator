"use client";

import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="w-full border-b bg-background px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="font-bold">Fast Logistics</span>
      </div>

      <Image
        src="/Logo-FAST-Ariam.png"
        alt="FAST Logo"
        width={180}
        height={60}
        priority
      />

      <nav className="flex gap-4 text-sm font-medium">
        <Link href="/dashboard" className="hover:underline">Dashboard</Link>
        <Link href="/orcamento" className="hover:underline">Novo Orçamento</Link>
      </nav>
    </header>
  );
}