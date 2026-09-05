import React from 'react';
import { TrendingUp, ShieldCheck, Award, BookOpen } from 'lucide-react';

interface BookMockupProps {
  title?: string;
  author?: string;
  price?: number;
  pages?: number;
  className?: string;
}

export const BookMockup: React.FC<BookMockupProps> = ({
  title = "THE MONEY MAKER",
  author = "Abhishek ji",
  pages = 200,
  className = ""
}) => {
  return (
    <div className={`relative flex items-center justify-center p-4 select-none ${className}`}>
      {/* Ambient background glow */}
      <div className="absolute w-72 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />

      {/* 3D Book Container */}
      <div className="book-container relative">
        <div 
          id="hero-book-cover"
          className="book-cover-3d relative w-64 sm:w-72 md:w-80 h-[380px] sm:h-[420px] md:h-[450px] rounded-r-xl rounded-l-sm bg-gradient-to-br from-slate-900 via-[#0a1224] to-[#04101e] border border-emerald-500/30 p-6 flex flex-col justify-between overflow-hidden shadow-2xl"
        >
          {/* Book Spine crease effect */}
          <div className="absolute top-0 bottom-0 left-0 w-5 bg-gradient-to-r from-black/80 via-slate-800/40 to-transparent border-r border-emerald-500/20" />
          <div className="absolute top-0 bottom-0 left-5 w-[1px] bg-white/10" />

          {/* Glossy lighting reflection across cover */}
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-gradient-to-br from-emerald-400/15 via-white/5 to-transparent rounded-full blur-xl pointer-events-none transform -rotate-12" />

          {/* Top Header Badge */}
          <div className="relative pl-4 flex items-center justify-between z-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide">
              <Award className="w-3.5 h-3.5" />
              2026 EDITION
            </span>
            <span className="text-[11px] font-mono text-emerald-400/80 uppercase tracking-wider">
              PRACTICAL GUIDE
            </span>
          </div>

          {/* Center Title & Graphic */}
          <div className="relative pl-4 my-auto z-10">
            <div className="flex items-center gap-2 mb-2 text-emerald-400 text-xs font-medium tracking-widest uppercase">
              <TrendingUp className="w-4 h-4" />
              <span>INDIAN STOCK MARKET</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight uppercase font-['Outfit'] drop-shadow-md">
              {title}
            </h3>

            <p className="text-emerald-300 text-xs sm:text-sm font-medium mt-1">
              Zero Se Samjho — Complete Handbook
            </p>

            {/* Stylized Candlestick Chart Silhouette */}
            <div className="mt-5 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 backdrop-blur-xs">
              <div className="flex items-end justify-between h-14 px-2 pt-2 gap-1.5">
                {/* Candle 1 */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <div className="w-[1px] h-3 bg-red-400" />
                  <div className="w-full h-5 bg-red-500/80 rounded-xs" />
                  <div className="w-[1px] h-2 bg-red-400" />
                </div>
                {/* Candle 2 */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <div className="w-[1px] h-2 bg-emerald-400" />
                  <div className="w-full h-7 bg-emerald-500/80 rounded-xs" />
                  <div className="w-[1px] h-1 bg-emerald-400" />
                </div>
                {/* Candle 3 (Hammer) */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <div className="w-[1px] h-1 bg-emerald-400" />
                  <div className="w-full h-4 bg-emerald-400 rounded-xs" />
                  <div className="w-[1px] h-8 bg-emerald-400" />
                </div>
                {/* Candle 4 (Big Bullish) */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <div className="w-[1px] h-2 bg-emerald-400" />
                  <div className="w-full h-11 bg-emerald-500 rounded-xs" />
                  <div className="w-[1px] h-1 bg-emerald-400" />
                </div>
                {/* Candle 5 */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                  <div className="w-[1px] h-3 bg-emerald-300" />
                  <div className="w-full h-9 bg-emerald-400 rounded-xs" />
                  <div className="w-[1px] h-2 bg-emerald-300" />
                </div>
              </div>
              <div className="flex justify-between items-center mt-1 pt-1 border-t border-slate-800 text-[9px] text-slate-400 font-mono">
                <span>NIFTY 50 / BANKNIFTY</span>
                <span className="text-emerald-400 font-bold">+2.4%</span>
              </div>
            </div>
          </div>

          {/* Book Bottom Author & Feature Badges */}
          <div className="relative pl-4 pt-3 border-t border-slate-800/80 z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">Written by</p>
                <p className="text-sm font-bold text-white tracking-wide">{author}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-emerald-400 font-semibold">{pages} Pages</p>
                <p className="text-[10px] text-slate-400">Hindi / English</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Page Thickness Layer underneath */}
        <div className="absolute right-0 top-3 bottom-3 w-4 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 rounded-r-md -z-10 shadow-lg transform translate-x-3 -rotate-y-12" />
        <div className="absolute right-0 top-1.5 bottom-1.5 w-6 bg-slate-800 rounded-r-lg -z-20 transform translate-x-4 -rotate-y-12 shadow-2xl opacity-60" />
      </div>

      {/* Floating Trust Pill */}
      <div className="absolute -bottom-2 sm:-bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 border border-emerald-500/40 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-xl flex items-center gap-2 text-xs text-slate-200">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Instant PDF Download</span>
        <span className="text-emerald-400">•</span>
        <span>Mobile & Tablet Ready</span>
      </div>
    </div>
  );
};
