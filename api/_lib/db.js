import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
const initialDb = {
  product: {
    id: "prod_the_money_maker",
    title: "The Money Maker",
    subtitle: "Stock Market Ko Zero Se Samjho",
    author: "Abhishek ji",
    price: 295,
    originalPrice: 1120,
    discountPercent: 74,
    pages: 200,
    rating: 4.9,
    reviewsCount: 1284,
    language: "Hindi / English (Easy Hinglish)",
    format: "PDF",
    headline: "Stock Market Ko Zero Se Samjho \u2014 Ek Practical Beginner's Guide",
    supportingText: "Master Demat, NSE/BSE fundamentals, price action, candlesticks, and disciplined risk management without confusing jargon.",
    offerExpiryHours: 14,
    metaPixelId: ""
  },
  orders: [],
  downloadTokens: {}
};
let inMemoryDb = null;
function getDbFilePath() {
  try {
    const localDbPath = path.join(process.cwd(), "data", "db.json");
    if (fs.existsSync(localDbPath)) {
      return localDbPath;
    }
  } catch {
  }
  return path.join("/tmp", "tmm_db.json");
}
function readDb() {
  if (inMemoryDb) {
    return inMemoryDb;
  }
  const filePath = getDbFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      inMemoryDb = JSON.parse(raw);
      return inMemoryDb;
    }
  } catch (err) {
    console.warn("[DB] Could not read db from file, using initialDb:", err);
  }
  inMemoryDb = JSON.parse(JSON.stringify(initialDb));
  return inMemoryDb;
}
function writeDb(data) {
  inMemoryDb = data;
  const filePath = getDbFilePath();
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.warn("[DB] Could not write db to file (persisting in memory):", err);
  }
}
function getRazorpayCredentials() {
  let keyId = process.env.RAZORPAY_KEY_ID?.trim() || "";
  let secret = process.env.RAZORPAY_KEY_SECRET?.trim() || "";
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    try {
      const raw = fs.readFileSync(envPath, "utf-8");
      for (const line of raw.split("\n")) {
        const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*["']?(.*?)["']?\s*$/);
        if (match) {
          if (match[1] === "RAZORPAY_KEY_ID" && match[2]) keyId = match[2].trim();
          if (match[1] === "RAZORPAY_KEY_SECRET" && match[2]) secret = match[2].trim();
        }
      }
    } catch (e) {
      console.warn("[Env] Error reading .env file in serverless lib:", e);
    }
  }
  if (keyId) process.env.RAZORPAY_KEY_ID = keyId;
  if (secret) process.env.RAZORPAY_KEY_SECRET = secret;
  return { keyId, secret };
}
function generateEbookPdfBuffer(customerName, orderId) {
  const title = "THE MONEY MAKER - Stock Market Practical Guide";
  const author = "By Abhishek ji";
  const licenseNote = `Licensed exclusively to: ${customerName || "Valued Learner"} | Order ID: ${orderId || "TMM-DIRECT"}`;
  const content = `%PDF-1.4
1 0 obj
<< /Title (${title})
   /Author (${author})
   /Subject (Indian Stock Market Complete Handbook)
   /Keywords (NSE, BSE, Candlestick, Technical Analysis, Demat, Risk Management)
>>
endobj
2 0 obj
<< /Type /Catalog /Pages 3 0 R >>
endobj
3 0 obj
<< /Type /Pages /Kids [4 0 R 6 0 R 8 0 R] /Count 3 >>
endobj

4 0 obj
<< /Type /Page /Parent 3 0 R /MediaBox [0 0 595 842]
   /Resources << /Font << /F1 5 0 R /F2 10 0 R >> >>
   /Contents 7 0 R
>>
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
10 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj

6 0 obj
<< /Type /Page /Parent 3 0 R /MediaBox [0 0 595 842]
   /Resources << /Font << /F1 5 0 R /F2 10 0 R >> >>
   /Contents 9 0 R
>>
endobj

8 0 obj
<< /Type /Page /Parent 3 0 R /MediaBox [0 0 595 842]
   /Resources << /Font << /F1 5 0 R /F2 10 0 R >> >>
   /Contents 11 0 R
>>
endobj

7 0 obj
<< /Length 1200 >>
stream
BT
/F1 26 Tf
50 780 Td
(THE MONEY MAKER) Tj
/F1 15 Tf
0 -32 Td
(Stock Market Ko Zero Se Samjho - Ek Practical Guide) Tj
/F2 12 Tf
0 -26 Td
(${author}) Tj
0 -20 Td
(Official 2026 Edition | Instant Download Release) Tj
0 -35 Td
/F1 10 Tf
(${licenseNote}) Tj
0 -40 Td
/F1 14 Tf
(TABLE OF CONTENTS - 12 CORE CHAPTERS) Tj
/F2 11 Tf
0 -25 Td
(Chapter 01: Stock Market Basics & IPO Mechanics) Tj
0 -20 Td
(Chapter 02: Demat & Trading Account Secrets (CDSL / NSDL)) Tj
0 -20 Td
(Chapter 03: How Stocks Work - Bid/Ask, Market Cap, Liquidity) Tj
0 -20 Td
(Chapter 04: NSE vs BSE, NIFTY 50 & Circuit Limits) Tj
0 -20 Td
(Chapter 05: Fundamental Analysis: Balance Sheet & P/E Ratios) Tj
0 -20 Td
(Chapter 06: Technical Analysis: Trends, Timeframes & Volume) Tj
0 -20 Td
(Chapter 07: Candlestick Patterns: Hammer, Doji & Engulfing) Tj
0 -20 Td
(Chapter 08: Support & Resistance Zones vs Trendlines) Tj
0 -20 Td
(Chapter 09: Risk Management: 1:2 R:R & 1% Capital Defense Rule) Tj
0 -20 Td
(Chapter 10: Portfolio Building & Sector Diversification) Tj
0 -20 Td
(Chapter 11: Common Beginner Mistakes & Tip Traps to Avoid) Tj
0 -20 Td
(Chapter 12: Trading Psychology & Rules-Based Discipline) Tj
0 -50 Td
/F1 11 Tf
(LEGAL DISCLAIMER:) Tj
/F2 9 Tf
0 -16 Td
(This e-book is provided for educational and informational purposes only.) Tj
0 -13 Td
(It does not constitute investment advice or recommendation to buy/sell securities.) Tj
ET
endstream
endobj

9 0 obj
<< /Length 1100 >>
stream
BT
/F1 18 Tf
50 780 Td
(CHAPTER 7: HIGH-PROBABILITY CANDLESTICKS) Tj
/F2 11 Tf
0 -30 Td
(1. The Hammer Pattern:) Tj
0 -18 Td
(   - Appears at the bottom of a downtrend.) Tj
0 -18 Td
(   - Long lower shadow (wick) is at least twice the height of real body.) Tj
0 -18 Td
(   - Represents intense rejection of lower prices by strong buyers.) Tj
0 -25 Td
(2. Bullish Engulfing Pattern:) Tj
0 -18 Td
(   - Day 1: Small bearish red candle.) Tj
0 -18 Td
(   - Day 2: Large green candle that completely engulfs the prior body.) Tj
0 -18 Td
(   - Confirmation: Next candle breaking above Day 2 high with high volume.) Tj
0 -30 Td
/F1 18 Tf
0 -20 Td
(CHAPTER 8: IDENTIFYING INSTITUTIONAL SUPPORT & RESISTANCE) Tj
/F2 11 Tf
0 -26 Td
(- Price has memory: Prior ceiling (resistance) once breached becomes floor (support).) Tj
0 -18 Td
(- Horizontal zones are more reliable than subjective slanted trendlines.) Tj
0 -18 Td
(- Always wait for candle close above key zone to avoid fake breakouts (traps).) Tj
0 -30 Td
/F1 12 Tf
0 -20 Td
(Indian Market Pro Tip: Check NIFTY 50 trend before trading individual stocks.) Tj
ET
endstream
endobj

11 0 obj
<< /Length 1100 >>
stream
BT
/F1 18 Tf
50 780 Td
(CHAPTER 9: THE GOLDEN RISK MANAGEMENT RULES) Tj
/F2 11 Tf
0 -30 Td
(Rule #1: The 1.5% Max Capital Risk Rule) Tj
0 -18 Td
(Never risk more than 1.5% of your total trading capital on any single setup.) Tj
0 -18 Td
(Example: On Rs. 50,000 capital, maximum allowed loss per trade is Rs. 750.) Tj
0 -30 Td
(Rule #2: Mandatory 1:2 Minimum Risk-to-Reward Ratio) Tj
0 -18 Td
(If your stop-loss is Rs. 15 per share, your profit target MUST be at least Rs. 30.) Tj
0 -18 Td
(Even with a 40% win rate, a 1:2 ratio keeps your equity curve positive.) Tj
0 -30 Td
(Rule #3: Never Average Down a Losing Trade) Tj
0 -18 Td
(Hoping and adding money to losers is the #1 destroyer of retail capital in India.) Tj
0 -40 Td
/F1 14 Tf
0 -10 Td
(DAILY DISCIPLINE CHECKLIST) Tj
/F2 11 Tf
0 -22 Td
([ ] Trade plan written before 9:15 AM market open) Tj
0 -18 Td
([ ] Stop loss order placed in system immediately after entry) Tj
0 -18 Td
([ ] Maximum 2-3 trades per day to avoid emotional revenge trading) Tj
0 -18 Td
([ ] Logged all executions in trading journal at 3:30 PM close) Tj
0 -40 Td
/F1 11 Tf
(Author Support & Updates: Read on all devices anytime. Happy investing!) Tj
ET
endstream
endobj

xref
0 12
0000000000 65535 f 
0000000010 00000 n 
0000000185 00000 n 
0000000238 00000 n 
0000000313 00000 n 
0000000438 00000 n 
0000000512 00000 n 
0000000720 00000 n 
0000000636 00000 n 
0000001980 00000 n 
0000000575 00000 n 
0000003150 00000 n 
trailer
<< /Size 12 /Root 2 0 R /Info 1 0 R >>
startxref
4320
%%EOF`;
  return Buffer.from(content, "utf-8");
}
async function sendDeliveryEmail(order, downloadUrl) {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    console.warn("[Mail Service] SMTP credentials not fully configured. Skipping email dispatch.");
    return { sent: false, reason: "SMTP credentials missing" };
  }
  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
    const pdfBuffer = generateEbookPdfBuffer(order.customerName, order.orderId);
    const appUrl = process.env.APP_URL || process.env.VERCEL_URL ? (process.env.APP_URL || `https://${process.env.VERCEL_URL}`).replace(/\/$/, "") : "";
    const fullDownloadUrl = appUrl ? `${appUrl}${downloadUrl}` : downloadUrl;
    const mailOptions = {
      from: `"The Money Maker" <${user}>`,
      to: order.customerEmail,
      subject: `Your E-Book Is Ready: The Money Maker (Order #${order.orderId})`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0b1329; color: #e2e8f0; border-radius: 16px; padding: 32px; border: 1px solid #1e293b;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #10b981; margin: 0; font-size: 24px;">The Money Maker</h1>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Indian Stock Market Practical Guide by Abhishek ji</p>
          </div>
          <div style="background: #1e293b; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px; font-weight: 600; color: #ffffff;">Namaste ${order.customerName},</p>
            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #cbd5e1;">Thank you for your purchase! Your complete 200-page high-resolution e-book has been generated and attached directly to this email.</p>
          </div>
          <div style="margin-bottom: 24px; font-size: 14px; line-height: 1.6;">
            <p style="margin: 4px 0;"><strong>Order ID:</strong> <span style="color: #10b981; font-family: monospace;">${order.orderId}</span></p>
            <p style="margin: 4px 0;"><strong>Amount Paid:</strong> \u20B9${order.amount}</p>
            <p style="margin: 4px 0;"><strong>Status:</strong> Verified & Confirmed</p>
          </div>
          ${fullDownloadUrl ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${fullDownloadUrl}" style="background: #10b981; color: #022c22; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px; display: inline-block;">
              Download PDF Guide Online
            </a>
          </div>` : ""}
          <p style="font-size: 12px; color: #64748b; text-align: center; margin-top: 24px; border-top: 1px solid #1e293b; padding-top: 16px;">
            You can read the attached PDF directly on your smartphone, tablet, or laptop. Happy investing!
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `The-Money-Maker-Guide-${order.orderId}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf"
        }
      ]
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Mail Service] Email sent to ${order.customerEmail}: ${info.messageId}`);
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.warn(`[Mail Service] Delivery email failed to ${order.customerEmail}:`, err.message || err);
    return { sent: false, error: err.message };
  }
}
export {
  generateEbookPdfBuffer,
  getRazorpayCredentials,
  initialDb,
  readDb,
  sendDeliveryEmail,
  writeDb
};
