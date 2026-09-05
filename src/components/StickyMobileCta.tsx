import React, { useState, useEffect } from 'react';
import { ProductConfig } from '../types';
import { ArrowRight, ShieldCheck, Download } from 'lucide-react';

interface StickyMobileCtaProps {
  product: ProductConfig;
  onBuyClick: () => void;
}

export const StickyMobileCta: React.FC<StickyMobileCtaProps> = ({ product, onBuyClick }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling past 300px
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-[#060a15]/95 backdrop-blur-md border-t border-slate-800/90 shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-white font-mono">
              ₹{product.price}
            </span>
            <span className="text-xs text-slate-500 line-through font-mono">
              ₹{product.originalPrice}
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <Download className="w-3 h-3" />
            <span>Instant PDF Download</span>
          </span>
        </div>

        <button
          id="mobile-sticky-buy-btn"
          onClick={onBuyClick}
          className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-slate-950 font-extrabold text-sm tracking-wide shadow-lg shadow-emerald-500/25 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>GET E-BOOK NOW</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
