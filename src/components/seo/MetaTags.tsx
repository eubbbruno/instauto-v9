import Head from 'next/head'

interface MetaTagsProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  siteName?: string
}

export default function MetaTags({
  title = 'InstaAuto - Conectando Motoristas e Oficinas',
  description = 'A plataforma que conecta motoristas às melhores oficinas do Brasil. Agendamento rápido, diagnóstico IA, chat tempo real e pagamentos seguros.',
  keywords = 'oficina mecânica, manutenção automotiva, agendamento, diagnóstico, chat tempo real, pagamentos, PIX, cartão, boleto',
  image = '/images/og-image.jpg',
  url = 'https://instauto.com.br',
  type = 'website',
  siteName = 'InstaAuto'
}: MetaTagsProps) {
  const fullTitle = title.includes('InstaAuto') ? title : `${title} | InstaAuto`
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="InstaAuto" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="pt_BR" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:creator" content="@instauto" />
      
      {/* Additional SEO */}
      <meta name="theme-color" content="#0047CC" />
      <meta name="msapplication-TileColor" content="#0047CC" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="InstaAuto" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "InstaAuto",
            "description": description,
            "url": "https://instauto.com.br",
            "logo": "https://instauto.com.br/images/logo-of.svg",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+55-11-4000-0000",
              "contactType": "customer service",
              "availableLanguage": "Portuguese"
            },
            "sameAs": [
              "https://facebook.com/instauto",
              "https://instagram.com/instauto",
              "https://linkedin.com/company/instauto"
            ],
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "BR",
              "addressRegion": "SP",
              "addressLocality": "São Paulo"
            }
          })
        }}
      />
    </Head>
  )
}

// Meta tags específicas para páginas
export const PageMetaTags = {
  home: {
    title: 'InstaAuto - Conectando Motoristas e Oficinas',
    description: 'A plataforma que conecta motoristas às melhores oficinas do Brasil. Agendamento rápido, diagnóstico IA, chat tempo real e pagamentos seguros.',
    keywords: 'oficina mecânica, manutenção automotiva, agendamento online, diagnóstico veicular'
  },
  
  motoristas: {
    title: 'Para Motoristas - Encontre a Oficina Ideal',
    description: 'Encontre oficinas próximas, agende serviços, converse em tempo real e tenha diagnóstico IA do seu veículo. Tudo em uma plataforma.',
    keywords: 'oficina próxima, agendamento mecânico, diagnóstico carro, chat oficina'
  },
  
  oficinas: {
    title: 'Para Oficinas - Gerencie seu Negócio',
    description: 'Plataforma completa para oficinas: gestão de agendamentos, chat com clientes, relatórios, pagamentos online e muito mais.',
    keywords: 'gestão oficina, agendamentos online, sistema oficina, pagamentos PIX'
  },
  
  chat: {
    title: 'Chat Tempo Real - Converse com Oficinas',
    description: 'Converse diretamente com oficinas em tempo real. Tire dúvidas, negocie preços e acompanhe seu serviço.',
    keywords: 'chat oficina, conversa tempo real, atendimento online'
  },
  
  diagnostico: {
    title: 'Diagnóstico IA - Identifique Problemas do Veículo',
    description: 'Use nossa IA avançada para diagnosticar problemas do seu veículo. Análise de sintomas, fotos e sugestões de reparo.',
    keywords: 'diagnóstico veicular, IA automotiva, problemas carro, análise sintomas'
  }
}
