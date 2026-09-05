import { ProductConfig, Order, AdminAnalytics } from '../types';

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

export const api = {
  async getConfig(): Promise<{ product: ProductConfig; gateway: any }> {
    const res = await fetch('/api/config');
    if (!res.ok) throw new Error('Failed to fetch config');
    return res.json();
  },

  async createOrder(data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  }): Promise<CreateOrderResponse> {
    const res = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to initialize payment');
    }
    return res.json();
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
    const res = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Payment verification failed');
    }
    return res.json();
  },

  async adminLogin(password: string): Promise<{ success: boolean; token: string }> {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Authentication failed');
    }
    return res.json();
  },

  async getAdminData(): Promise<{
    product: ProductConfig;
    orders: Order[];
    analytics: AdminAnalytics;
    razorpayConfigured: boolean;
  }> {
    const res = await fetch('/api/admin/data');
    if (!res.ok) throw new Error('Failed to fetch admin data');
    return res.json();
  },

  async updateProduct(productUpdates: Partial<ProductConfig>): Promise<{ success: boolean; product: ProductConfig }> {
    const res = await fetch('/api/admin/update-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productUpdates)
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
  }
};
