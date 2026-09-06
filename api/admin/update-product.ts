import { readDb, writeDb } from '../lib/db.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method Not Allowed' });

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Invalid JSON' }); }
    }
    const db = readDb();
    const { title, author, price, originalPrice, pages, headline, supportingText, metaPixelId } = body || {};

    if (title) db.product.title = title;
    if (author) db.product.author = author;
    if (price !== undefined) db.product.price = Number(price);
    if (originalPrice !== undefined) db.product.originalPrice = Number(originalPrice);
    if (pages !== undefined) db.product.pages = Number(pages);
    if (headline) db.product.headline = headline;
    if (supportingText) db.product.supportingText = supportingText;
    if (metaPixelId !== undefined) db.product.metaPixelId = metaPixelId;

    writeDb(db);
    return res.status(200).json({ success: true, product: db.product });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || 'Failed to update product' });
  }
}
