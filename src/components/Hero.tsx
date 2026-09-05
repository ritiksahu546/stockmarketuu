import React from 'react';
import { ShieldCheck, Download, Sparkles, CheckCircle2, ArrowRight, Eye, Star } from 'lucide-react';
import { BookMockup } from './BookMockup';
import { ProductConfig } from '../types';

interface HeroProps {
  product: ProductConfig;
  onBuyClick: () => void;
  onPreviewClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ product, onBuyClick, onPreviewClick }) => {
  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <section className="relative pt-6 pb-16 lg:pt-12 lg:pb-24 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Value Pitch & Conversion Controls */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold tracking-wide shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>{product.coverBadge || '2026 Updated Practical Guide'}</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="text-slate-300">By {product.author}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-[1.15] tracking-tight font-['Outfit']">
              Stock Market Ko <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Zero Se Samjho</span> — Ek Practical Beginner's Guide
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              {product.supportingText}
            </p>

            {/* Quick Benefits Bullet List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-sm text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>200 Pages in Simple Hindi & English</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>NSE, BSE, NIFTY 50 & Demat Demystified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>High-Probability Candlestick Patterns</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1:2 Risk-Reward & Capital Defense Rules</span>
              </div>
            </div>

            {/* Pricing Card & CTA Box */}
            <div className="pt-3">
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border border-emerald-500/25 shadow-xl max-w-xl">
                
                {/* Price Display */}
                <div className="flex flex-wrap items-baseline gap-3 mb-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-slate-400 text-sm font-medium">Limited Deal:</span>
                    <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                      ₹{product.price}
                    </span>
                  </div>
                  <span className="text-slate-500 line-through text-lg font-mono">
                    ₹{product.originalPrice}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider uppercase">
                    SAVE {discountPercent}% TODAY
                  </span>
                </div>

                {/* Primary CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    id="hero-buy-now-cta"
                    onClick={onBuyClick}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-slate-950 font-extrabold text-base tracking-wide shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:brightness-105 transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>BUY NOW — ₹{product.price}</span>
                    <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                  </button>

                  <button
                    id="hero-preview-cta"
                    onClick={onPreviewClick}
                    className="py-3.5 px-5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <span>Look Inside</span>
                  </button>
                </div>

                {/* Sub-CTA Trust micro-badges */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-[11px] sm:text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 justify-center">
                    <Download className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">Instant PDF</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-center">
                    <Star className="w-3.5 h-3.5 text-emerald-400 shrink-0 fill-emerald-400" />
                    <span className="truncate">Beginner Friendly</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Social validation note */}
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>Includes 200+ Pages PDF • No recurring fees • One-time purchase</span>
            </p>

          </div>

          {/* Right Column: 3D Book Presentation */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <BookMockup 
              title={product.title}
              author={product.author}
              price={product.price}
              pages={product.pages}
            />
          </div>

        </div>
      </div>
    </section>
  );
};
