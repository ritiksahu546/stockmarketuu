import { ProductConfig, Chapter, Testimonial, FAQItem, Benefit } from '../types';

export const defaultProduct: ProductConfig = {
  id: 'ebook-money-maker',
  title: 'The Money Maker',
  subtitle: 'A Practical Step-by-Step Blueprint for Indian Stock Market Beginners',
  author: 'Abhishek ji',
  price: 2,
  originalPrice: 1120,
  currency: 'INR',
  pages: 200,
  language: 'Hindi & English (Easy Hinglish)',
  format: 'High-Resolution PDF',
  deliveryType: 'Instant Digital Download',
  headline: 'Stock Market Ko Zero Se Samjho — Ek Practical Beginner\'s Guide',
  supportingText: 'Master how the Indian stock market actually works without heavy technical jargon. Learn Demat setup, NSE/BSE fundamentals, price action, candlestick patterns, and risk management rules used by disciplined investors.',
  offerText: 'Special Limited-Time Launch Price (Save 74%)',
  offerExpiryHours: 14,
  coverBadge: '2026 Updated Edition',
};

export const defaultChapters: Chapter[] = [
  {
    number: 1,
    title: 'Stock Market Basics',
    description: 'Share bazaar kya hai, shares kyu issue hote hain, aur companies IPO ke through public se paisa kaise raise karti hain.',
    iconName: 'TrendingUp',
    highlights: ['What is a Share?', 'Primary vs Secondary Market', 'How Compounding Works in Equity']
  },
  {
    number: 2,
    title: 'Demat & Trading Account',
    description: 'Demat aur Trading account ke beech ka difference, Depository (CDSL/NSDL) ka role, aur safe broker chunne ka tareeqa.',
    iconName: 'ShieldCheck',
    highlights: ['Brokerage vs Hidden Charges', 'Step-by-Step Account Opening', 'Security & Two-Factor Auth']
  },
  {
    number: 3,
    title: 'How Stocks Work',
    description: 'Demand aur Supply ka rule, market capitalisation (Large, Mid, Small Cap), and company earnings impact on share price.',
    iconName: 'BarChart3',
    highlights: ['Bid vs Ask Spread', 'Market Cap Categorization', 'Dividends & Bonus Shares']
  },
  {
    number: 4,
    title: 'NSE & BSE',
    description: 'National Stock Exchange (NIFTY 50) aur Bombay Stock Exchange (SENSEX) kaise kaam karte hain aur market timings kya hain.',
    iconName: 'Building2',
    highlights: ['NIFTY 50 Index Composition', 'Trading Sessions (Pre-market & Regular)', 'Circuit Breakers & Upper/Lower Limits']
  },
  {
    number: 5,
    title: 'Fundamental Analysis',
    description: 'Company ke financials ko bina kisi accounting degree ke samajhna. P/E ratio, Debt-to-Equity, ROCE aur Balance sheet basics.',
    iconName: 'LineChart',
    highlights: ['P/E & P/B Ratios Explained', 'Cash Flow vs Paper Profits', 'Moat & Competitive Advantage']
  },
  {
    number: 6,
    title: 'Technical Analysis',
    description: 'Price charts ko read karne ki foundational principles. Timeframes, trends (Uptrend, Downtrend, Sideways) aur volume interpretation.',
    iconName: 'Activity',
    highlights: ['Chart Types (Candle vs Line)', 'Identifying Genuine Trends', 'Volume Confirmation Rule']
  },
  {
    number: 7,
    title: 'Candlestick Basics',
    description: 'Single aur Multi-candlestick patterns ki anatomy. Bullish Hammer, Bearish Engulfing, Morning Star aur Doji candles ka practical use.',
    iconName: 'Flame',
    highlights: ['Bullish & Bearish Candles', 'High-Probability Candle Signals', 'Wick Rejections & Fakeouts']
  },
  {
    number: 8,
    title: 'Support & Resistance',
    description: 'Bade institutional buyers aur sellers kahan khade hain. Key horizontal levels, trendlines aur breakout verification.',
    iconName: 'Layers',
    highlights: ['Horizontal Zones vs Slanted Lines', 'How Prior Resistance Becomes Support', 'Avoiding False Breakouts']
  },
  {
    number: 9,
    title: 'Risk Management',
    description: 'Capital ko protect karna sabse pehla rule hai. 1:2 Risk-Reward ratio, Stop-Loss placement aur 1-2% capital risk rule.',
    iconName: 'Compass',
    highlights: ['Calculating Maximum Loss Per Trade', 'Position Sizing Formula', 'Why Averaging Losers Destroys Wealth']
  },
  {
    number: 10,
    title: 'Portfolio Building',
    description: 'Apne goals aur risk profile ke mutabiq well-diversified equity portfolio banayein. Core & Satellite strategy.',
    iconName: 'PieChart',
    highlights: ['Sector Allocation Rules', 'Lump sum vs SIP in Direct Equities', 'Periodic Rebalancing Framework']
  },
  {
    number: 11,
    title: 'Common Beginner Mistakes',
    description: 'Tip culture se bachna, revenge trading, penny stocks ka illusion aur bina research ke F&O me jump karne ke khatre.',
    iconName: 'AlertTriangle',
    highlights: ['The Telegram Tip Trap', 'Why Penny Stocks are Dangerous', 'Over-trading & Brokerage Drain']
  },
  {
    number: 12,
    title: 'Trading Psychology',
    description: 'Greed, Fear aur FOMO ko discipline me badalna. Rules-based trading system aur professional trade journal maintain karna.',
    iconName: 'Brain',
    highlights: ['Mastering FOMO (Fear of Missing Out)', 'Dealing with Inevitable Drawdowns', 'Maintaining a Trade Logbook']
  }
];

export const defaultBenefits: Benefit[] = [
  {
    id: 'b1',
    title: 'Simple Hindi & English (Easy Hinglish)',
    description: 'No unnecessary financial jargon or complex mathematics. Written in crystal clear conversational language that anyone can understand easily.',
    iconName: 'BookOpen'
  },
  {
    id: 'b2',
    title: 'Real Indian Market Examples',
    description: 'Case studies based on familiar Indian companies (Tata, Reliance, Infosys) rather than obscure foreign stocks.',
    iconName: 'CheckCircle2'
  },
  {
    id: 'b3',
    title: 'Beginner-Friendly From Ground Zero',
    description: 'Starts with zero prior assumptions. Even if you have never bought a single share before, you will understand step-by-step.',
    iconName: 'Sparkles'
  },
  {
    id: 'b4',
    title: 'Structured Step-by-Step Learning',
    description: 'A logical progression: Account Setup → Market Fundamentals → Chart Reading → Risk Controls → Portfolio Execution.',
    iconName: 'GraduationCap'
  },
  {
    id: 'b5',
    title: 'Instant Digital PDF Download',
    description: 'Get immediate access to your downloadable PDF right after payment on your screen and in your email inbox.',
    iconName: 'Download'
  },
  {
    id: 'b6',
    title: 'Read on Any Device At Your Pace',
    description: 'Optimized formatting looks crisp on Android, iPhone, iPad, tablets, laptops, and desktop screens with lifetime reading access.',
    iconName: 'Smartphone'
  }
];

export const defaultTestimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Rahul Sharma',
    role: 'IT Professional',
    location: 'Bengaluru, Karnataka',
    rating: 5,
    review: 'Abhishek ji ne candlestick aur support-resistance ko itne simple tareeqe se samjhaya hai ki mujhe YouTube ke 50 videos dekhne ki zaroorat nahi padi. Best ₹295 investment for any beginner.',
    avatarText: 'RS',
    verified: true,
    date: '3 days ago'
  },
  {
    id: 't2',
    name: 'Pooja Verma',
    role: 'Small Business Owner',
    location: 'Jaipur, Rajasthan',
    rating: 5,
    review: 'Pehle mujhe share market se bohot darr lagta tha. Is e-book ke Chapter 9 (Risk Management) ne mera darr poora khatam kar diya. Position sizing rule follow karke ab relaxed rehti hoon.',
    avatarText: 'PV',
    verified: true,
    date: '1 week ago'
  },
  {
    id: 't3',
    name: 'Vikram Patel',
    role: 'Civil Engineer',
    location: 'Ahmedabad, Gujarat',
    rating: 5,
    review: 'Clear Hindi-English language without fake profit claims. The book emphasizes capital preservation first, which is what 95% of social media gurus hide. Highly recommended.',
    avatarText: 'VP',
    verified: true,
    date: '2 weeks ago'
  },
  {
    id: 't4',
    name: 'Amit Deshmukh',
    role: 'CA Aspirant',
    location: 'Pune, Maharashtra',
    rating: 5,
    review: 'The breakdown of NSE, BSE, and balance sheet ratios like ROCE & P/E is gold. Printable cheat sheets at the end are super useful during market hours.',
    avatarText: 'AD',
    verified: true,
    date: '3 weeks ago'
  }
];

export const defaultFAQs: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Is this ebook suitable for complete beginners?',
    answer: 'Yes, absolutely! The book is written specifically for beginners who have zero or minimal background in the stock market. We begin from the ground level — explaining what a share is, how demat accounts work, and build upward smoothly into technical & fundamental concepts.'
  },
  {
    id: 'faq-2',
    question: 'What format will I receive?',
    answer: 'You will receive a high-resolution, DRM-free DRM PDF file (200 pages). It contains full-color chart diagrams, tables, and printable quick-reference checklists.'
  },
  {
    id: 'faq-3',
    question: 'How will I receive the ebook after payment?',
    answer: 'Instantly! Immediately after completing the payment, your download button will appear on screen. In addition, an order confirmation email with your personal download link is dispatched to the email address you provide.'
  },
  {
    id: 'faq-4',
    question: 'Is the online payment secure?',
    answer: '100% secure. All payments are processed through Razorpay, India\'s leading RBI-compliant payment gateway using bank-grade 256-bit SSL encryption. We accept UPI (Google Pay, PhonePe, Paytm), NetBanking, Credit Cards, and Debit Cards.'
  },
  {
    id: 'faq-5',
    question: 'Can I read the ebook on my mobile phone?',
    answer: 'Yes! The PDF is formatted to be fully responsive and comfortable to read on smartphones (Android & iOS), tablets, iPads, laptops, and desktop computers.'
  },
  {
    id: 'faq-6',
    question: 'Do I need prior stock market knowledge or a finance degree?',
    answer: 'No prior finance education is needed. All terms are explained in simple conversational Hindi/English with real-world Indian examples (like buying everyday grocery items or vehicles).'
  },
  {
    id: 'faq-7',
    question: 'What is the refund policy?',
    answer: 'Since this is a digital e-book product delivered immediately upon payment, all sales are final. However, if you face any technical download difficulty, our support team will manually re-send your file within 2-4 hours.'
  },
  {
    id: 'faq-8',
    question: 'Can I download the e-book more than once?',
    answer: 'Yes! Your unique download link allows you up to 5 downloads across your devices so you can save a copy on your phone, tablet, and computer.'
  }
];

export const samplePreviewPages = [
  {
    id: 'page-1',
    label: 'Book Cover',
    title: 'The Money Maker: Zero Se Hero',
    chapter: 'Cover & Edition Overview',
    contentSnippet: 'Complete 200-Page Practical Guidebook for Retail Investors in India by Abhishek ji.',
    previewType: 'cover'
  },
  {
    id: 'page-2',
    label: 'Chapter 4',
    title: 'NSE vs BSE & Demat Architecture',
    chapter: 'Chapter 4: Market Mechanics',
    contentSnippet: 'Understand CDSL, NSDL, Broker Custody, and how trade settlement (T+1 cycle) works in Indian exchanges.',
    previewType: 'mechanics'
  },
  {
    id: 'page-3',
    label: 'Chapter 7',
    title: 'Candlestick Anatomy & High-Probability Patterns',
    chapter: 'Chapter 7: Candlestick Patterns',
    contentSnippet: 'Visualizing Hammer, Shooting Star, Bullish Engulfing, and Doji candles with Indian chart examples.',
    previewType: 'candlestick'
  },
  {
    id: 'page-4',
    label: 'Chapter 9',
    title: 'The 1:2 Risk-to-Reward & Capital Defense Rules',
    chapter: 'Chapter 9: Risk Management',
    contentSnippet: 'Never risk more than 1.5% of total capital on a single setup. The mathematical proof of long-term profitability.',
    previewType: 'risk'
  }
];
