import React, { useState, useEffect } from 'react';
import { ProductConfig } from '../types';
import { 
  CheckCircle2, ArrowRight, ShieldCheck, Clock, Download, 
  Smartphone, BookOpen, AlertCircle, Award 
} from 'lucide-react';

interface PricingSectionProps {
  product: ProductConfig;
  onBuyClick: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ product, onBuyClick }) => {
  // Launch offer countdown calculation
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: product.offerExpiryHours || 14,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const includedItems = [
    'Complete 200-Page High-Resolution E-Book (PDF)',
    'Full Coverage of 12 Major Stock Market Chapters',
    'High-Probability Candlestick Cheat Sheet (Printable)',
    'NSE / BSE Demat Account Opening Checklist',
    '1:2 Risk-to-Reward Position Sizing Calculator Guide',
    'Free Lifetime Revisions & Future Edition Updates',
    'Instant Secure Download Link via Screen & Email'
  ];

  return (
    <section id="pricing" className="py-20 bg-[#050811] relative overflow-hidden border-t border-slate-800/80">
      {/* Background Accent */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>One-Time Simple Investment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
            Start Your Stock Market Journey Today
          </h2>
          <p className="mt-2 text-base text-slate-300">
            For less than the price of a single restaurant meal, get lifetime access to practical stock market wisdom.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#0e162a] via-[#090f1d] to-[#060a15] border-2 border-emerald-500/40 shadow-2xl p-6 sm:p-10">
          
          {/* Top Floating Badge */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5">
            <span>LIMITED-TIME LAUNCH OFFER • SAVE {discountPercent}%</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-3">
            
            {/* Left: What's Included */}
            <div className="md:col-span-7 space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
                {product.title} (Digital Edition)
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Authored by {product.author} • Instant Download • No Recurring Fees
              </p>

              <div className="pt-2 space-y-2.5">
                {includedItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Price, Timer & Big CTA */}
            <div className="md:col-span-5 p-6 rounded-2xl bg-slate-950/70 border border-slate-800 text-center space-y-5">
              
              {/* Genuine Launch Timer */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Launch Discount Active</span>
                </div>
                <div className="flex items-center justify-center gap-2 font-mono text-sm font-bold text-white">
                  <span className="px-2 py-1 rounded bg-slate-800 text-emerald-400">
                    {String(timeLeft.hours).padStart(2, '0')}h
                  </span>
                  <span>:</span>
                  <span className="px-2 py-1 rounded bg-slate-800 text-emerald-400">
                    {String(timeLeft.minutes).padStart(2, '0')}m
                  </span>
                  <span>:</span>
                  <span className="px-2 py-1 rounded bg-slate-800 text-emerald-400">
                    {String(timeLeft.seconds).padStart(2, '0')}s
                  </span>
                </div>
              </div>

              {/* Price Numbers */}
              <div className="space-y-1">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono">
                    ₹{product.price}
                  </span>
                  <span className="text-lg text-slate-500 line-through font-mono">
                    ₹{product.originalPrice}
                  </span>
                </div>
                <p className="text-xs text-emerald-400 font-medium">All taxes & fees included</p>
              </div>

              {/* Big BUY NOW CTA */}
              <button
                id="pricing-buy-now-cta"
                onClick={onBuyClick}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:brightness-105 text-slate-950 font-extrabold text-base tracking-wide shadow-xl shadow-emerald-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>BUY NOW — ₹{product.price}</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>

              {/* Instant Delivery Notice */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant PDF Download After Payment</span>
              </div>

              {/* Payment Methods Badges */}
              <div className="pt-3 border-t border-slate-800/80">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Accepted Payment Modes</p>
                <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-slate-300">
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">UPI (GPay, PhonePe, Paytm)</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">RuPay / Visa / Master</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">NetBanking</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-emerald-400 mt-2 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>256-Bit SSL Encrypted & Verified via Razorpay</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Mandatory Educational Disclaimer Near Purchase Section */}
        <div className="mt-8 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 leading-relaxed flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-200">Mandatory Educational Disclaimer: </span>
            This e-book is provided for educational and informational purposes only. It does not constitute investment advice, financial advice, or a recommendation to buy or sell any security. Market investments are subject to risk. Readers should conduct their own research and consult a qualified financial professional where appropriate.
          </div>
        </div>

      </div>
    </section>
  );
};
