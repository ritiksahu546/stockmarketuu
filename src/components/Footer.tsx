import React from 'react';
import { TrendingUp, Mail, ShieldAlert, Heart, Lock } from 'lucide-react';
import { ProductConfig } from '../types';
import { LegalModalType } from './LegalModals';

interface FooterProps {
  product: ProductConfig;
  onOpenLegal: (type: LegalModalType) => void;
  onAdminClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ product, onOpenLegal, onAdminClick }) => {
  return (
    <footer className="bg-[#03060f] border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand & About */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <TrendingUp className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight font-['Outfit']">
                THE MONEY MAKER
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              The premier practical Indian stock market handbook authored by {product.author}. Empowering retail learners with clear concepts, risk rules, and financial literacy.
            </p>
            <div className="flex items-center gap-4 text-slate-300">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">
                X / Twitter
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">
                YouTube
              </a>
              <a href="https://telegram.org" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">
                Telegram Channel
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">
                Instagram
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Quick Navigation</p>
            <ul className="space-y-2 text-sm">
              <li><a href="#chapters" className="hover:text-emerald-400 transition-colors">12 Chapters Breakdown</a></li>
              <li><a href="#preview" className="hover:text-emerald-400 transition-colors">Look Inside (Sample Pages)</a></li>
              <li><a href="#benefits" className="hover:text-emerald-400 transition-colors">Why This E-Book</a></li>
              <li><a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing & Inclusions</a></li>
              <li><a href="#testimonials" className="hover:text-emerald-400 transition-colors">Reader Reviews</a></li>
              <li><a href="#faq" className="hover:text-emerald-400 transition-colors">Frequently Asked Questions</a></li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div className="md:col-span-4 space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Policies & Support</p>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onOpenLegal('refund')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Refund & Cancellation Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('privacy')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('terms')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Terms and Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('contact')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Contact Support Desk
                </button>
              </li>
              <li className="pt-2 text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>support@the-money-maker.in</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Mandatory Educational Disclaimer in Footer */}
        <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800/90 text-xs text-slate-400 leading-relaxed space-y-1.5">
          <div className="flex items-center gap-2 text-slate-200 font-bold">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <span>Official Regulatory & Financial Disclaimer:</span>
          </div>
          <p>
            "This e-book is provided for educational and informational purposes only. It does not constitute investment advice, financial advice, or a recommendation to buy or sell any security. Market investments are subject to risk. Readers should conduct their own research and consult a qualified financial professional where appropriate."
          </p>
          <p className="text-[11px] text-slate-400 pt-1">
            Neither author {product.author} nor the publication brand guarantees profits, investment returns, or financial outcomes. Past performance illustrated in educational chart patterns is not indicative of future market results.
          </p>
        </div>

        {/* Bottom copyright & Admin Link */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} The Money Maker by {product.author}. All rights reserved. Handcrafted for Indian Investors.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Razorpay RBI-Compliant Gateway</span>
            <span>•</span>
            <button
              onClick={onAdminClick}
              className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
              title="Seller Admin Portal"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
