import { readDb, writeDb, generateEbookPdfBuffer } from '../_lib/db.js';

export default async function handler(req: any, res: any) {
  const token = req.query.token as string;
  if (!token) {
    return res.status(400).json({ error: 'Download token is required' });
  }

  try {
    const db = readDb();
    const tokenRecord = db.downloadTokens[token];

    if (!tokenRecord) {
      return res.status(404).json({ error: 'Invalid or expired download link. Please contact support.' });
    }

    if (new Date(tokenRecord.expiresAt) < new Date()) {
      return res.status(410).json({ error: 'This download link has expired. Please contact support to refresh your link.' });
    }

    if (tokenRecord.downloadCount >= tokenRecord.maxDownloads) {
      return res.status(429).json({ error: `Download limit of ${tokenRecord.maxDownloads} reached.` });
    }

    tokenRecord.downloadCount += 1;
    const order = db.orders.find(o => o.orderId === tokenRecord.orderId);
    if (order) {
      order.downloadCount = (order.downloadCount || 0) + 1;
      order.lastDownloadedAt = new Date().toISOString();
    }
    writeDb(db);

    const customerName = order?.customerName || 'Valued Learner';
    const pdfBuffer = generateEbookPdfBuffer(customerName, tokenRecord.orderId);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="The-Money-Maker-Stock-Market-Guide-${tokenRecord.orderId}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    return res.status(200).send(pdfBuffer);
  } catch (err: any) {
    console.error('[Download API] Error:', err);
    return res.status(500).json({ error: 'Failed to generate download file' });
  }
}
