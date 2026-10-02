export interface PaymentRequest {
  orderReference: string;
  amount: number; // in NGN
  customerEmail: string;
  customerName: string;
  currency: string;
  simulateFailure?: boolean;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
  timestamp: string;
  provider: 'mock_paystack' | 'paystack' | 'flutterwave' | 'stripe';
}

export interface IPaymentProvider {
  processPayment(request: PaymentRequest): Promise<PaymentResult>;
}

/**
 * Mock Nigerian Payment Provider simulating Paystack / Flutterwave NGN checkout
 */
export class MockNigerianPaymentProvider implements IPaymentProvider {
  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    // Simulate real gateway network latency (800ms - 1400ms)
    await new Promise((resolve) => setTimeout(resolve, 1100));

    if (request.simulateFailure) {
      return {
        success: false,
        message: 'Transaction declined: Mock simulated card failure. (No funds deducted).',
        timestamp: new Date().toISOString(),
        provider: 'mock_paystack',
      };
    }

    const mockTxId = `TXN_EDA_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    return {
      success: true,
      transactionId: mockTxId,
      message: 'Payment verified and approved successfully via ÈDÁ Test Gateway.',
      timestamp: new Date().toISOString(),
      provider: 'mock_paystack',
    };
  }
}

class PaymentServiceManager {
  private provider: IPaymentProvider;

  constructor(provider?: IPaymentProvider) {
    this.provider = provider || new MockNigerianPaymentProvider();
  }

  setProvider(provider: IPaymentProvider) {
    this.provider = provider;
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    return this.provider.processPayment(request);
  }
}

export const paymentService = new PaymentServiceManager();
