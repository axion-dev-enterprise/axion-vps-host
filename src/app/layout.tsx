import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Manrope, Space_Grotesk } from "next/font/google";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "PontoTecc | Catalogo de Celulares e Assistencia Especializada",
  description: "Catalogo com celulares reais, imagens atualizadas e fluxo rapido para solicitar orcamento e atendimento especializado.",
  icons: {
    icon: "/logopontotec.png",
    apple: "/logopontotec.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${manrope.variable} ${spaceGrotesk.variable} bg-bg-app font-sans antialiased`}>{children}</body>
    </html>
  );
}
