'use client'

export interface MercadoPagoItem {
  id: string
  title: string
  description?: string
  picture_url?: string
  category_id?: string
  quantity: number
  currency_id: 'BRL'
  unit_price: number
}

export interface MercadoPagoCustomer {
  name?: string
  surname?: string
  email?: string
  phone?: {
    area_code?: string
    number?: string
  }
  identification?: {
    type?: 'CPF' | 'CNPJ'
    number?: string
  }
  address?: {
    street_name?: string
    street_number?: number
    zip_code?: string
  }
}

export interface MercadoPagoPreference {
  items: MercadoPagoItem[]
  payer?: MercadoPagoCustomer
  back_urls?: {
    success?: string
    failure?: string
    pending?: string
  }
  auto_return?: 'approved' | 'all'
  payment_methods?: {
    excluded_payment_methods?: Array<{ id: string }>
    excluded_payment_types?: Array<{ id: string }>
    installments?: number
    default_installments?: number
  }
  notification_url?: string
  statement_descriptor?: string
  external_reference?: string
  expires?: boolean
  expiration_date_from?: string
  expiration_date_to?: string
  metadata?: Record<string, any>
}

export interface MercadoPagoResponse {
  id: string
  init_point: string
  sandbox_init_point: string
  date_created: string
  items: MercadoPagoItem[]
  payer: MercadoPagoCustomer
  back_urls: {
    success: string
    failure: string
    pending: string
  }
}

export interface PaymentData {
  amount: number
  description: string
  customerEmail: string
  customerName?: string
  customerPhone?: string
  customerDocument?: string
  paymentMethod?: 'pix' | 'credit_card' | 'boleto' | 'all'
  installments?: number
  externalReference?: string
  metadata?: Record<string, any>
}

export interface SubscriptionData {
  planId: 'oficina-pro' | 'oficina-premium'
  customerId: string
  customerEmail: string
  customerName: string
  customerDocument?: string
  frequency: 'monthly' | 'yearly'
  startDate?: string
}

class MercadoPagoClient {
  private baseUrl = '/api/payments'

  async createPaymentPreference(data: PaymentData): Promise<MercadoPagoResponse> {
    try {
      console.log('💳 Creating MercadoPago preference:', data)
      
      const response = await fetch(`${this.baseUrl}/create-preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao criar preferência de pagamento')
      }

      const result = await response.json()
      console.log('✅ MercadoPago preference created:', result.id)
      
      return result
    } catch (error) {
      console.error('❌ Error creating payment preference:', error)
      throw error
    }
  }

  async createSubscription(data: SubscriptionData): Promise<any> {
    try {
      console.log('🔄 Creating MercadoPago subscription:', data)
      
      const response = await fetch(`${this.baseUrl}/create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao criar assinatura')
      }

      const result = await response.json()
      console.log('✅ MercadoPago subscription created:', result.id)
      
      return result
    } catch (error) {
      console.error('❌ Error creating subscription:', error)
      throw error
    }
  }

  async getPaymentStatus(paymentId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/payment-status/${paymentId}`)
      
      if (!response.ok) {
        throw new Error('Erro ao consultar status do pagamento')
      }

      return await response.json()
    } catch (error) {
      console.error('❌ Error getting payment status:', error)
      throw error
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/cancel-subscription/${subscriptionId}`, {
        method: 'DELETE'
      })
      
      return response.ok
    } catch (error) {
      console.error('❌ Error canceling subscription:', error)
      return false
    }
  }

  // Utility methods
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  static validateCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]/g, '')
    
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false
    }

    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i)
    }
    
    let remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cpf.charAt(9))) return false

    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i)
    }
    
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    
    return remainder === parseInt(cpf.charAt(10))
  }

  static validateCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]/g, '')
    
    if (cnpj.length !== 14) return false

    if (/^(\d)\1{13}$/.test(cnpj)) return false

    let sum = 0
    let pos = 5
    
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cnpj.charAt(i)) * pos--
      if (pos < 2) pos = 9
    }
    
    let result = sum % 11 < 2 ? 0 : 11 - sum % 11
    if (result !== parseInt(cnpj.charAt(12))) return false

    sum = 0
    pos = 6
    
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cnpj.charAt(i)) * pos--
      if (pos < 2) pos = 9
    }
    
    result = sum % 11 < 2 ? 0 : 11 - sum % 11
    
    return result === parseInt(cnpj.charAt(13))
  }

  static formatDocument(document: string): string {
    const numbers = document.replace(/[^\d]/g, '')
    
    if (numbers.length === 11) {
      // CPF: 123.456.789-01
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    } else if (numbers.length === 14) {
      // CNPJ: 12.345.678/0001-90
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    }
    
    return document
  }

  static getPaymentMethodIcon(method: string): string {
    const icons: Record<string, string> = {
      'pix': '🔄',
      'credit_card': '💳',
      'debit_card': '💳',
      'boleto': '📄',
      'account_money': '💰',
      'wallet_connect': '📱',
      'bank_transfer': '🏦'
    }
    
    return icons[method] || '💳'
  }

  static getPaymentStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'approved': 'text-green-600',
      'pending': 'text-yellow-600',
      'in_process': 'text-blue-600',
      'rejected': 'text-red-600',
      'cancelled': 'text-gray-600',
      'refunded': 'text-purple-600'
    }
    
    return colors[status] || 'text-gray-600'
  }

  static getPaymentStatusText(status: string): string {
    const texts: Record<string, string> = {
      'approved': 'Aprovado',
      'pending': 'Pendente',
      'in_process': 'Processando',
      'rejected': 'Rejeitado',
      'cancelled': 'Cancelado',
      'refunded': 'Reembolsado'
    }
    
    return texts[status] || status
  }
}

export const mercadoPagoClient = new MercadoPagoClient()

// Plans configuration
export const PLANS = {
  'oficina-free': {
    id: 'oficina-free',
    name: 'Oficina FREE',
    price: 0,
    features: [
      'Até 3 conversas ativas',
      'Relatórios básicos',
      'Perfil público',
      'Suporte por email'
    ],
    color: 'green'
  },
  'oficina-pro': {
    id: 'oficina-pro',
    name: 'Oficina PRO',
    price: 89,
    monthlyPrice: 89,
    yearlyPrice: 890, // 2 months free
    features: [
      'Conversas ilimitadas',
      'Relatórios avançados + IA',
      'Recursos premium',
      'Suporte prioritário',
      'Marketing e SEO',
      'Templates profissionais',
      'Analytics detalhadas'
    ],
    color: 'amber'
  },
  'oficina-premium': {
    id: 'oficina-premium',
    name: 'Oficina PREMIUM',
    price: 189,
    monthlyPrice: 189,
    yearlyPrice: 1890, // 2 months free
    features: [
      'Tudo do PRO',
      'IA diagnóstico automático',
      'Integração ERP',
      'White-label',
      'API personalizada',
      'Suporte 24/7',
      'Consultor dedicado'
    ],
    color: 'purple'
  }
} as const

export type PlanId = keyof typeof PLANS
