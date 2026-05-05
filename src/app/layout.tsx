import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Capsule — Confection Premium Made in Tunisia",
  description:
    "Marques indépendantes : confiez votre confection à l'excellence tunisienne. MOQ dès 50 pièces, devis en ligne, livraison express en Europe. T-shirts, Hoodies, Vestes.",
  keywords: [
    "confection tunisie",
    "fabrication vêtement",
    "petite série textile",
    "MOQ 50",
    "usine textile tunisie",
    "marque indépendante",
    "manufacturing",
  ],
  openGraph: {
    title: "Capsule — Confection Premium Made in Tunisia",
    description:
      "Votre usine de confection en Tunisie. MOQ 50 pièces, devis express, livraison 24h bateau.",
    type: "website",
  },
};

import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
