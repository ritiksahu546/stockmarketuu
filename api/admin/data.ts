import { readDb } from '../lib/db.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method Not Allowed' });

  try {
    const db = readDb();
    const totalOrders = db.orders.length;
    const verifiedOrders = db.orders.filter(o => o.status === 'paid').length;
    const totalRevenue = db.orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + o.amount, 0);
    const conversionRate = totalOrders > 0 ? Number(((verifiedOrders / totalOrders) * 100).toFixed(1)) : 0;

    return res.status(200).json({
      product: db.product,
      orders: db.orders,
      analytics: {
        totalRevenue,
        totalOrders,
        verifiedOrders,
        conversionRate
      },
      razorpayConfigured: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || 'Failed to fetch admin data' });
  }
}
