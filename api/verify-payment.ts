import crypto from 'crypto';
import { readDb, writeDb, sendDeliveryEmail, OrderRecord, getRazorpayCredentials } from './_lib/db.js';

export default async function handler(req: any, res: any) {
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
        return res.status(400).json({ success: false, error: 'Invalid JSON body' });
      }
    }
    body = body || {};

    const {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      customerName,
      customerEmail,
      customerPhone
    } = body;

    const { secret: razorpaySecret } = getRazorpayCredentials();

    // 1. Signature Verification
    if (razorpaySecret && razorpaySignature) {
      const generatedSignature = crypto
        .createHmac('sha256', razorpaySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      if (generatedSignature !== razorpaySignature) {
        console.error('[Verify Payment] Signature mismatch:', { generated: generatedSignature, received: razorpaySignature });
        return res.status(400).json({
          success: false,
          error: 'Payment verification failed: Invalid Razorpay Signature. Transaction could not be confirmed.'
        });
      }
    }

    // 2. Locate or create order record
    const db = readDb();
    let order = db.orders.find(o => o.orderId === orderId || o.razorpayOrderId === razorpayOrderId);

    const downloadToken = `tmm_sec_${crypto.randomBytes(16).toString('hex')}`;
    const nowIso = new Date().toISOString();

    if (!order) {
      order = {
        id: `ord_${Date.now()}`,
        orderId: orderId || `TMM-${Date.now().toString().slice(-6)}`,
        razorpayOrderId: razorpayOrderId || `order_${Date.now()}`,
        razorpayPaymentId: razorpayPaymentId || `pay_${Date.now()}`,
        customerName: customerName || 'Learner',
        customerEmail: customerEmail || '',
        customerPhone: customerPhone || '',
        amount: db.product.price || 295,
        currency: 'INR',
        status: 'paid',
        createdAt: nowIso,
        paidAt: nowIso,
        downloadToken,
        downloadCount: 0,
        downloadLimit: 5
      };
      db.orders.unshift(order);
    } else {
      order.status = 'paid';
      order.razorpayPaymentId = razorpayPaymentId || `pay_${Date.now()}`;
      order.paidAt = nowIso;
      order.downloadToken = downloadToken;
    }

    // 3. Register secure download access token
    db.downloadTokens[downloadToken] = {
      orderId: order.orderId,
      email: order.customerEmail,
      createdAt: nowIso,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      downloadCount: 0,
      maxDownloads: 5
    };

    writeDb(db);

    // 4. Send confirmation email with PDF attached asynchronously
    sendDeliveryEmail(order, `/api/download/${downloadToken}`).catch((err) => {
      console.warn('[Mail Service] Background delivery error:', err);
    });

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      orderId: order.orderId,
      paymentId: order.razorpayPaymentId,
      downloadToken,
      downloadUrl: `/api/download/${downloadToken}`,
      amount: order.amount,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      paidAt: order.paidAt
    });
  } catch (err: any) {
    console.error('[Verify Payment] Error:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Payment verification failed'
    });
  }
}
