import { MercadoPagoConfig, Payment, Preference, PaymentRefund } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: {
    timeout: 10000,
    retries: 3,
  }
});

export const payment = new Payment(client);
export const preference = new Preference(client);
export const paymentRefund = new PaymentRefund(client);

export const createPixPayment = async (paymentData: {
  transaction_amount: number;
  email: string;
  description: string;
  external_reference?: string;
}) => {
  try {
    const paymentBody = {
      transaction_amount: paymentData.transaction_amount,
      description: paymentData.description,
      payment_method_id: 'pix',
      payer: {
        email: paymentData.email,
      },
      external_reference: paymentData.external_reference,
    };

    const result = await payment.create({ body: paymentBody });
    return result;
  } catch (error) {
    console.error('Erro ao criar pagamento PIX:', error);
    throw error;
  }
};

export const createRefund = async (paymentId: string, amount?: number) => {
  try {
    const refundBody = amount ? { amount } : {};
    const result = await paymentRefund.create({ 
      payment_id: paymentId, 
      body: refundBody 
    });
    return result;
  } catch (error) {
    console.error('Erro ao criar estorno:', error);
    throw error;
  }
}; 