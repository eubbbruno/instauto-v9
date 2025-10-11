'use client'

// Google Analytics 4
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date | object,
      config?: object
    ) => void
    dataLayer: any[]
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || ''

// Inicializar Google Analytics
export const initGA = () => {
  if (!GA_TRACKING_ID || typeof window === 'undefined') return

  // Carregar script do GA4
  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
  script.async = true
  document.head.appendChild(script)

  // Inicializar dataLayer
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }

  window.gtag('js', new Date())
  window.gtag('config', GA_TRACKING_ID, {
    page_title: document.title,
    page_location: window.location.href,
  })
}

// Rastrear pageview
export const trackPageView = (url: string, title?: string) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined') return

  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
    page_title: title || document.title,
  })
}

// Rastrear eventos
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
  customParameters?: object
) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined') return

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    ...customParameters,
  })
}

// Eventos específicos do InstaAuto
export const AnalyticsEvents = {
  // Autenticação
  login: (method: 'email' | 'google' | 'facebook', userType: 'motorista' | 'oficina') => {
    trackEvent('login', 'auth', method, undefined, { user_type: userType })
  },

  signup: (method: 'email' | 'google' | 'facebook', userType: 'motorista' | 'oficina') => {
    trackEvent('sign_up', 'auth', method, undefined, { user_type: userType })
  },

  // Chat
  chatStarted: (userType: 'motorista' | 'oficina') => {
    trackEvent('chat_started', 'engagement', userType)
  },

  messageSent: (userType: 'motorista' | 'oficina') => {
    trackEvent('message_sent', 'engagement', userType)
  },

  // Agendamentos
  appointmentCreated: (oficinaId: string, serviceType?: string) => {
    trackEvent('appointment_created', 'conversion', serviceType, undefined, { oficina_id: oficinaId })
  },

  appointmentCancelled: (reason?: string) => {
    trackEvent('appointment_cancelled', 'conversion', reason)
  },

  // Pagamentos
  paymentStarted: (planType: 'free' | 'pro', method: 'pix' | 'credit' | 'boleto', amount: number) => {
    trackEvent('begin_checkout', 'ecommerce', planType, amount, { payment_method: method })
  },

  paymentCompleted: (planType: 'free' | 'pro', method: 'pix' | 'credit' | 'boleto', amount: number) => {
    trackEvent('purchase', 'ecommerce', planType, amount, { 
      payment_method: method,
      currency: 'BRL',
      transaction_id: `${planType}_${Date.now()}`
    })
  },

  paymentFailed: (planType: 'free' | 'pro', method: 'pix' | 'credit' | 'boleto', error?: string) => {
    trackEvent('payment_failed', 'ecommerce', planType, undefined, { 
      payment_method: method,
      error_message: error 
    })
  },

  // Busca
  searchOficinas: (location?: string, filters?: object) => {
    trackEvent('search', 'engagement', 'oficinas', undefined, { location, ...filters })
  },

  oficinaViewed: (oficinaId: string, source?: string) => {
    trackEvent('view_item', 'engagement', 'oficina', undefined, { 
      oficina_id: oficinaId,
      source 
    })
  },

  // IA Diagnóstico
  diagnosticStarted: (vehicleType?: string) => {
    trackEvent('diagnostic_started', 'engagement', 'ai', undefined, { vehicle_type: vehicleType })
  },

  diagnosticCompleted: (confidence: number, vehicleType?: string) => {
    trackEvent('diagnostic_completed', 'engagement', 'ai', confidence, { vehicle_type: vehicleType })
  },

  // Mapas
  mapViewed: (location?: string) => {
    trackEvent('map_viewed', 'engagement', 'maps', undefined, { location })
  },

  routeCalculated: (distance?: number, duration?: number) => {
    trackEvent('route_calculated', 'engagement', 'maps', distance, { duration })
  },

  // Engajamento
  timeOnPage: (seconds: number, page: string) => {
    trackEvent('time_on_page', 'engagement', page, seconds)
  },

  featureUsed: (feature: string, userType: 'motorista' | 'oficina') => {
    trackEvent('feature_used', 'engagement', feature, undefined, { user_type: userType })
  },

  errorOccurred: (errorType: string, page: string, message?: string) => {
    trackEvent('error_occurred', 'technical', errorType, undefined, { 
      page,
      error_message: message 
    })
  }
}

// Hook para analytics
export const useAnalytics = () => {
  const trackPageView = (url: string, title?: string) => {
    AnalyticsEvents.timeOnPage(Date.now(), url)
    trackPageView(url, title)
  }

  return {
    trackPageView,
    trackEvent,
    events: AnalyticsEvents
  }
}

// Componente para inicializar analytics
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    initGA()
  }, [])

  return <>{children}</>
}

// Middleware para rastrear navegação
export const trackNavigation = (url: string) => {
  trackPageView(url)
}