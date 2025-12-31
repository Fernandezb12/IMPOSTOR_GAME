import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SWRegister } from "@/components/pwa-register";
import { UXBridge } from "@/components/ux-bridge";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Impostor – ¿Quién es el Espía?",
  description:
    "Party game de roles ocultos para jugar en un solo teléfono. Descubre al impostor antes de que sea tarde.",
  manifest: "/manifest.webmanifest",
  themeColor: "#0b0d17",
  icons: [
    { rel: "icon", url: "/icon.svg" },
    { rel: "apple-touch-icon", url: "/icon.svg" }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={cn(inter.variable)}>
      <body className="bg-surface-900 text-white">
        <div className="min-h-screen bg-grid-glow">
          <SWRegister />
          <UXBridge />
          {children}
        </div>
      </body>
    </html>
  );
}
