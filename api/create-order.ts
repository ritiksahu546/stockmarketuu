import { readDb, writeDb, getRazorpayCredentials } from './_lib/db.js';

export interface OrderRecord {
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
  downloadCount?: number;
  downloadLimit?: number;
  lastDownloadedAt?: string;
}

export default async function handler(req: any, res: any) {
  // Always return application/json
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed. Only POST requests are supported.'
    });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ success: false, error: 'Invalid JSON body in request' });
      }
    }
    body = body || {};

    const { customerName, customerEmail, customerPhone } = body;

    // 1. Validation
    if (!customerName || typeof customerName !== 'string' || !customerName.trim()) {
      return res.status(400).json({ success: false, error: 'Customer full name is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerEmail || !emailRegex.test(customerEmail.trim())) {
      return res.status(400).json({ success: false, error: 'A valid email address is required for e-book delivery' });
    }

    const cleanPhone = String(customerPhone || '').replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      return res.status(400).json({ success: false, error: 'A valid 10-digit mobile number is required' });
    }

    const db = readDb();
    const amountInInr = db.product.price || 295;
    const amountInPaise = amountInInr * 100; // 29500 paise
    const internalOrderId = `TMM-${Date.now().toString().slice(-6)}`;

    const { keyId: razorpayKeyId, secret: razorpaySecret } = getRazorpayCredentials();

    let razorpayOrderId = `order_sim_${Date.now()}`;
    let isRealGateway = false;

    // 2. Real Razorpay Order Creation via official API
    if (razorpayKeyId && razorpaySecret) {
      try {
        const authHeader = 'Basic ' + Buffer.from(`${razorpayKeyId}:${razorpaySecret}`).toString('base64');
        const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: 'INR',
            receipt: internalOrderId,
            notes: {
              productName: db.product.title,
              customerName: customerName.trim(),
              customerEmail: customerEmail.trim(),
              customerPhone: cleanPhone
            }
          })
        });

        if (rzpResponse.ok) {
          const orderData = await rzpResponse.json();
          razorpayOrderId = orderData.id;
          isRealGateway = true;
        } else {
          const errText = await rzpResponse.text();
          console.warn('[Razorpay Order] API returned non-OK status:', errText);
          // Fall back to simulator so testing never halts
        }
      } catch (rErr: any) {
        console.warn('[Razorpay Order] Request failed, using fallback:', rErr?.message || rErr);
      }
    }

    // 3. Save Order in DB
    const newOrder: OrderRecord = {
      id: `ord_${Date.now()}`,
      orderId: internalOrderId,
      razorpayOrderId,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: cleanPhone,
      amount: amountInInr,
      currency: 'INR',
      status: 'created',
      createdAt: new Date().toISOString(),
      downloadCount: 0,
      downloadLimit: 5
    };

    db.orders.unshift(newOrder);
    writeDb(db);

    // 4. Return successful response
    return res.status(200).json({
      success: true,
      orderId: internalOrderId,
      razorpayOrderId,
      amount: amountInPaise,
      amountInInr,
      currency: 'INR',
      keyId: razorpayKeyId || '',
      isRealGateway,
      productName: db.product.title,
      customer: {
        name: customerName.trim(),
        email: customerEmail.trim(),
        phone: cleanPhone
      }
    });
  } catch (err: any) {
    console.error('[Create Order] Unexpected error:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Unable to initialize order. Please try again.'
    });
  }
}
