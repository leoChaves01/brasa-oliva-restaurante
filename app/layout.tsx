import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.brasaeoliva.com.br"),
  title: "Brasa & Oliva Restaurante | Cozinha contemporânea",
  description:
    "Ingredientes brasileiros, técnica contemporânea e uma mesa feita para bons encontros.",
  openGraph: {
    title: "Brasa & Oliva Restaurante",
    description: "Cozinha com fogo, afeto e tempo.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brasa & Oliva Restaurante",
    description: "Cozinha com fogo, afeto e tempo.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
