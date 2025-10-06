// Servidor MercadoPago - Apenas para uso em API routes
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'

// Configuração do MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: {
    timeout: 5000,
    idempotencyKey: 'abc'
  }
})

export interface PaymentItem {
  id: string
  title: string
  description?: string
  quantity: number
  unit_price: number
  currency_id?: string
}

export interface PaymentPayer {
  name: string
  surname: string
  email: string
  phone?: {
    area_code: string
    number: string
  }
  identification?: {
    type: string
    number: string
  }
  address?: {
    street_name: string
    street_number: number
    zip_code: string
  }
}

export interface CreatePreferenceData {
  items: PaymentItem[]
  payer: PaymentPayer
  back_urls?: {
    success: string
    failure: string
    pending: string
  }
  auto_return?: 'approved' | 'all'
  external_reference?: string
  notification_url?: string
  payment_methods?: {
    excluded_payment_methods?: Array<{ id: string }>
    excluded_payment_types?: Array<{ id: string }>
    installments?: number
  }
}

class MercadoPagoService {
  private preference: Preference
  private payment: Payment

  constructor() {
    this.preference = new Preference(client)
    this.payment = new Payment(client)
  }

  // Criar preferência de pagamento
  async createPreference(data: CreatePreferenceData) {
    try {
      const preferenceData = {
        items: data.items.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          quantity: item.quantity,
          unit_price: item.unit_price,
          currency_id: item.currency_id || 'BRL'
        })),
        payer: {
          name: data.payer.name,
          surname: data.payer.surname,
          email: data.payer.email,
          phone: data.payer.phone,
          identification: data.payer.identification,
          address: data.payer.address
        },
        back_urls: data.back_urls || {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/pagamento/sucesso`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/pagamento/erro`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/pagamento/pendente`
        },
        auto_return: data.auto_return || 'approved',
        external_reference: data.external_reference,
        notification_url: data.notification_url || `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
        payment_methods: {
          excluded_payment_methods: data.payment_methods?.excluded_payment_methods || [],
          excluded_payment_types: data.payment_methods?.excluded_payment_types || [],
          installments: data.payment_methods?.installments || 12
        },
        statement_descriptor: 'INSTAUTO',
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
      }

      const response = await this.preference.create({ body: preferenceData })
      return response
    } catch (error) {
      console.error('Erro ao criar preferência MercadoPago:', error)
      throw error
    }
  }

  // Buscar informações de um pagamento
  async getPayment(paymentId: string) {
    try {
      const response = await this.payment.get({ id: paymentId })
      return response
    } catch (error) {
      console.error('Erro ao buscar pagamento:', error)
      throw error
    }
  }

  // Processar webhook
  async processWebhook(body: any) {
    try {
      const { type, data } = body

      switch (type) {
        case 'payment':
          const payment = await this.getPayment(data.id)
          return this.handlePaymentUpdate(payment)
        
        case 'plan':
          // Processar atualização de plano
          return this.handlePlanUpdate(data)
        
        case 'subscription':
          // Processar atualização de assinatura
          return this.handleSubscriptionUpdate(data)
        
        default:
          console.log('Tipo de webhook não processado:', type)
          return { processed: false, type }
      }
    } catch (error) {
      console.error('Erro ao processar webhook:', error)
      throw error
    }
  }

  private async handlePaymentUpdate(payment: any) {
    const { status, external_reference, transaction_amount, payer } = payment

    // Aqui você integraria com seu banco de dados
    // Por exemplo, atualizar status do pedido, ativar plano PRO, etc.
    
    console.log('Payment Update:', {
      status,
      external_reference,
      amount: transaction_amount,
      payer_email: payer?.email
    })

    switch (status) {
      case 'approved':
        // Pagamento aprovado - ativar serviço
        await this.activateService(external_reference, payment)
        break
      
      case 'pending':
        // Pagamento pendente - aguardar confirmação
        await this.setPendingStatus(external_reference, payment)
        break
      
      case 'rejected':
        // Pagamento rejeitado - notificar usuário
        await this.handleRejectedPayment(external_reference, payment)
        break
    }

    return { processed: true, status, external_reference }
  }

  private async handlePlanUpdate(data: any) {
    // Implementar lógica de atualização de plano
    console.log('Plan Update:', data)
    return { processed: true, type: 'plan' }
  }

  private async handleSubscriptionUpdate(data: any) {
    // Implementar lógica de atualização de assinatura
    console.log('Subscription Update:', data)
    return { processed: true, type: 'subscription' }
  }

  private async activateService(externalReference: string, payment: any) {
    // Implementar ativação do serviço
    // Por exemplo: atualizar plano do usuário no Supabase
    console.log('Ativando serviço para:', externalReference)
  }

  private async setPendingStatus(externalReference: string, payment: any) {
    // Implementar status pendente
    console.log('Status pendente para:', externalReference)
  }

  private async handleRejectedPayment(externalReference: string, payment: any) {
    // Implementar tratamento de pagamento rejeitado
    console.log('Pagamento rejeitado para:', externalReference)
  }

  // Criar pagamento PIX
  async createPixPayment(data: {
    transaction_amount: number
    description: string
    payer: PaymentPayer
    external_reference?: string
  }) {
    try {
      const paymentData = {
        transaction_amount: data.transaction_amount,
        description: data.description,
        payment_method_id: 'pix',
        payer: {
          email: data.payer.email,
          first_name: data.payer.name,
          last_name: data.payer.surname,
          identification: data.payer.identification
        },
        external_reference: data.external_reference,
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`
      }

      const response = await this.payment.create({ body: paymentData })
      return response
    } catch (error) {
      console.error('Erro ao criar pagamento PIX:', error)
      throw error
    }
  }
}

// Instância singleton
export const mercadoPagoService = new MercadoPagoService()

// Tipos para export
export type { CreatePreferenceData, PaymentItem, PaymentPayer }
