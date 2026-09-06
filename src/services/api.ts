import { ProductConfig, Order, AdminAnalytics } from '../types';
import { defaultProduct } from '../data/defaultData';

export interface CreateOrderResponse {
  success: boolean;
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  amountInInr: number;
  currency: string;
  keyId: string;
  isRealGateway: boolean;
  productName: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  orderId: string;
  paymentId: string;
  downloadToken: string;
  downloadUrl: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  paidAt: string;
}

/**
 * Robust fetch wrapper with automatic retry and exponential backoff.
 * Prevents transient startup and network dropouts from breaking the user experience.
 */
async function safeJsonFetch<T = any>(
  url: string,
  options?: RequestInit,
  retries = 2,
  backoffMs = 400
): Promise<T> {
  let lastErr: any = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);

      const contentType = res.headers.get('content-type') || '';
      let rawText = '';
      try {
        rawText = await res.text();
      } catch (readErr) {
        throw new Error('Failed to read response from server.');
      }

      let parsedJson: any = null;
      const isLikelyJson = contentType.includes('application/json') ||
        (rawText.trim().startsWith('{') && rawText.trim().endsWith('}')) ||
        (rawText.trim().startsWith('[') && rawText.trim().endsWith(']'));

      if (isLikelyJson) {
        try {
          parsedJson = JSON.parse(rawText);
        } catch (parseErr) {
          console.warn(`[API JSON Parse Warning] Malformed JSON from ${url}:`, parseErr);
        }
      }

      if (!res.ok) {
        if (parsedJson && (parsedJson.error || parsedJson.message)) {
          throw new Error(parsedJson.error || parsedJson.message);
        }

        if (rawText.includes('<html') || rawText.includes('The page') || res.status === 404) {
          throw new Error(
            `Server endpoint (${url}) returned HTTP ${res.status}. If deployed on Vercel, verify that environment variables (RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET) and API serverless functions are active.`
          );
        }

        throw new Error(`Server returned error HTTP ${res.status}: ${rawText.slice(0, 100) || 'Unknown error'}`);
      }

      if (parsedJson === null) {
        throw new Error('Received unexpected non-JSON response from server.');
      }

      return parsedJson as T;
    } catch (err: any) {
      lastErr = err;
      // Retry only for network errors or server booting (not for bad requests like 400 validation)
      if (attempt < retries && (!err.message || !err.message.startsWith('Server returned error HTTP 4'))) {
        await new Promise((resolve) => setTimeout(resolve, backoffMs * (attempt + 1)));
        continue;
      }
      break;
    }
  }

  // Gracefully report error after all retries exhausted
  console.warn(`[API Request Notice] Request to ${url} did not succeed:`, lastErr?.message || lastErr);
  throw new Error(lastErr?.message || 'Network connection issue. Please check your connectivity and try again.');
}

export const api = {
  async getConfig(): Promise<{ product: ProductConfig; gateway: any }> {
    try {
      return await safeJsonFetch('/api/config', undefined, 2, 400);
    } catch (err) {
      console.warn('[API] Using local default product configuration:', err);
      return {
        product: defaultProduct,
        gateway: {
          keyId: 'rzp_live_TYQkVsBBIO4qu4',
          isLiveConfigured: true,
          mode: 'live',
          supportedMethods: ['UPI (GPay, PhonePe, Paytm)', 'Cards', 'NetBanking', 'Wallets']
        }
      };
    }
  },

  async createOrder(data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  }): Promise<CreateOrderResponse> {
    return safeJsonFetch<CreateOrderResponse>('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async verifyPayment(data: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature?: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  }): Promise<VerifyPaymentResponse> {
    return safeJsonFetch<VerifyPaymentResponse>('/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async adminLogin(password: string): Promise<{ success: boolean; token: string }> {
    return safeJsonFetch<{ success: boolean; token: string }>('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
  },

  async getAdminData(): Promise<{
    product: ProductConfig;
    orders: Order[];
    analytics: AdminAnalytics;
    razorpayConfigured: boolean;
  }> {
    return safeJsonFetch('/api/admin/data');
  },

  async updateProduct(productUpdates: Partial<ProductConfig>): Promise<{ success: boolean; product: ProductConfig }> {
    return safeJsonFetch('/api/admin/update-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productUpdates)
    });
  }
};

