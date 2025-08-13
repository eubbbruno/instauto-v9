import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans } from "next/font/google";
import { NotificacaoProvider } from "@/contexts/NotificacaoContext";
import { ToastProvider } from "@/components/ui/toast";
import PWAManager from "@/components/pwa/PWAManager";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-syne",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Instauto | Conectando Motoristas e Oficinas",
  description: "Plataforma SaaS que conecta motoristas a oficinas mecânicas e oferece um sistema completo de ERP + CRM para gestão de oficinas.",
  manifest: "/manifest.json",
  themeColor: "#1e40af",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "InstaAuto"
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover"
  },
  icons: {
    icon: [
      { url: "/images/logo.svg", type: "image/svg+xml" },
      { url: "/images/logo-192.png", sizes: "192x192", type: "image/png" },
      { url: "/images/logo-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/images/logo-192.png", sizes: "192x192", type: "image/png" }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${syne.variable} ${jakarta.variable}`} suppressHydrationWarning={true}>
      <body className="bg-white" suppressHydrationWarning={true}>
        <ToastProvider>
          <NotificacaoProvider>
            <PWAManager />
            {children}
          </NotificacaoProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
