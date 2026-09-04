import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthValidator } from "@/components/AuthValidator";
import "./globals.css";
import { Header } from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fast Logistics",
  description: "Sistema de Automação de Orçamentos e Logística",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header/>
        <AuthValidator>{children}</AuthValidator>
      </body>
    </html>
  );
}
