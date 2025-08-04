import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans } from "next/font/google";
import { NotificacaoProvider } from "@/contexts/NotificacaoContext";
import { AuthProvider } from "@/contexts/SupabaseAuthContext";
import { ToastProvider } from "@/components/ui/toast";
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
          <AuthProvider>
            <NotificacaoProvider>
              {children}
            </NotificacaoProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
