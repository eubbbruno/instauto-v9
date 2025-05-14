import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestão para Oficinas Mecânicas | Instauto",
  description: "Cadastre sua oficina no Instauto, receba orçamentos de motoristas, e gerencie tudo com nosso painel profissional ERP + CRM.",
  keywords: "oficina mecânica, gestão de oficina, software para oficina, orçamentos para oficina, erp para oficina, sistema para mecânica",
  openGraph: {
    title: "Gestão para Oficinas Mecânicas | Instauto",
    description: "Cadastre sua oficina no Instauto, receba orçamentos de motoristas, e gerencie tudo com nosso painel profissional ERP + CRM.",
    url: "https://instauto.com.br/oficinas",
    siteName: "Instauto",
    images: [
      {
        url: "https://instauto.com.br/og-image-oficinas.jpg",
        width: 1200,
        height: 630,
        alt: "Instauto para Oficinas Mecânicas"
      }
    ],
    locale: "pt_BR",
    type: "website"
  }
};

export default function OficinasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
} 