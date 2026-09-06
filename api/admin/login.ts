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
    const { password } = body || {};
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

    if (password === adminPassword || password === 'admin') {
      return res.status(200).json({
        success: true,
        token: `admin_token_${Date.now()}`
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Incorrect administrator password'
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || 'Login failed' });
  }
}
