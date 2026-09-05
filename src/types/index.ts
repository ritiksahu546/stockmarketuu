export interface ProductConfig {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  price: number;
  originalPrice: number;
  currency: string;
  pages: number;
  language: string;
  format: string;
  deliveryType: string;
  headline: string;
  supportingText: string;
  offerText: string;
  offerExpiryHours: number; // For launch countdown
  coverBadge: string;
  metaPixelId?: string;
}

export interface Chapter {
  number: number;
  title: string;
  description: string;
  iconName: string;
  highlights: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  review: string;
  avatarText: string;
  verified: boolean;
  date: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface Order {
  id: string;
  orderId: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  currency: string;
  status: 'created' | 'paid' | 'failed';
  createdAt: string;
  paidAt?: string;
  downloadToken?: string;
  downloadCount: number;
  downloadLimit: number;
  lastDownloadedAt?: string;
}

export interface PaymentVerificationRequest {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface AdminAnalytics {
  totalOrders: number;
  totalRevenue: number;
  successfulPayments: number;
  failedPayments: number;
  conversionRate: number;
  totalDownloads: number;
}
