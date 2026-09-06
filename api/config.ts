import { readDb, getRazorpayCredentials } from './_lib/db.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const db = readDb();
    const { keyId, secret: keySecret } = getRazorpayCredentials();

    return res.status(200).json({
      product: db.product,
      gateway: {
        provider: 'Razorpay',
        currency: 'INR',
        keyId,
        isConfigured: Boolean(keyId && keySecret)
      }
    });
  } catch (err: any) {
    console.error('[Config API] Error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve configuration'
    });
  }
}
