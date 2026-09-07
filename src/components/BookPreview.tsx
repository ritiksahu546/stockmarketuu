import React, { useState } from 'react';
import { samplePreviewPages } from '../data/defaultData';
import { BookOpen, Eye, ArrowRight, ShieldCheck, CheckCircle2, Maximize2, X } from 'lucide-react';

interface BookPreviewProps {
  onBuyClick: () => void;
}

export const BookPreview: React.FC<BookPreviewProps> = ({ onBuyClick }) => {
  const [selectedPage, setSelectedPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentPage = samplePreviewPages[selectedPage];

  return (
    <section id="preview" className="py-20 bg-[#050811] relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Eye className="w-3.5 h-3.5" />
            <span>Look Inside The Guide</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
            Sample Pages & Chart Illustrations
          </h2>
          <p className="mt-3 text-base text-slate-300">
            Preview authentic snippets from the actual 200-page manuscript. Notice the crisp diagrams, visual risk formulas, and clear bilingual explanations.
          </p>
        </div>

        {/* Preview Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap justify-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800">
            {samplePreviewPages.map((page, idx) => (
              <button
                key={page.id}
                onClick={() => setSelectedPage(idx)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedPage === idx
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {page.label}
              </button>
            ))}
          </div>
        </div>

        {/* E-Book Simulated Page Reader */}
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl bg-[#090e1c] border border-slate-800 shadow-2xl overflow-hidden">
            
            {/* Header bar of reader */}
            <div className="px-6 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="font-semibold text-slate-200">{currentPage.chapter}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-emerald-400">Sample Page Preview</span>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 transition-colors p-1"
                  title="Expand Fullscreen Preview"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Preview Inside</span>
                </button>
              </div>
            </div>

            {/* Page Content Body */}
            <div className="p-6 sm:p-10 min-h-[420px] flex flex-col justify-between bg-gradient-to-b from-[#0a1122] to-[#060b17]">
              
              {/* Conditional Page Visuals */}
              {currentPage.previewType === 'cover' && (
                <div className="flex flex-col items-center justify-center text-center py-6 space-y-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider">
                    OFFICIAL 2026 EDITION
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight uppercase">
                    THE MONEY MAKER
                  </h3>
                  <p className="text-emerald-300 font-medium text-base">
                    Stock Market Ko Zero Se Samjho — Ek Practical Beginner's Guide
                  </p>
                  <p className="text-slate-400 text-sm max-w-lg">
                    By Abhishek ji • 200 Pages • Complete Indian Equities, Technical & Fundamental Framework
                  </p>
                  <div className="pt-4 flex flex-wrap justify-center gap-3 text-xs">
                    <span className="px-3 py-1.5 rounded-md bg-slate-800/80 border border-slate-700 text-slate-200">
                      NSE & BSE Mechanics
                    </span>
                    <span className="px-3 py-1.5 rounded-md bg-slate-800/80 border border-slate-700 text-slate-200">
                      Candlestick Cheat Sheets
                    </span>
                    <span className="px-3 py-1.5 rounded-md bg-slate-800/80 border border-slate-700 text-slate-200">
                      Risk Management Math
                    </span>
                  </div>
                </div>
              )}

              {currentPage.previewType === 'mechanics' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-3">
                    <h4 className="text-lg font-bold text-white font-['Outfit']">
                      Chapter 4: How NSE and BSE Actually Operate
                    </h4>
                    <p className="text-xs text-emerald-400 font-mono">Section 4.2 • Trade Settlement & Depository Role</p>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Jab aap kisi broker (Zerodha, Groww, AngelOne wagera) ke terminal par "BUY" button press karte hain, toh share broker ke paas nahi rehta. Share direct <strong>CDSL ya NSDL</strong> (Depositories) ke electronic locker me transfer hota hai.
                  </p>
                  
                  {/* Visual Diagram */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                      <p className="text-xs font-bold text-emerald-400">1. Trader / Investor</p>
                      <p className="text-[11px] text-slate-400 mt-1">Places Market/Limit Order on Trading Terminal</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                      <p className="text-xs font-bold text-teal-400">2. Exchange (NSE/BSE)</p>
                      <p className="text-[11px] text-slate-400 mt-1">Matches Buyer with Seller in Microseconds</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                      <p className="text-xs font-bold text-blue-400">3. Depository (CDSL/NSDL)</p>
                      <p className="text-[11px] text-slate-400 mt-1">Safely Credits Shares to your Demat ID</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-500/10 border-l-4 border-emerald-500 text-xs text-emerald-200">
                    <strong>Rule to Remember:</strong> Indian stock markets operate on a fast <strong>T+1 Settlement Cycle</strong>. Agar aapne Monday ko delivery shares kharide, toh Tuesday shaam tak shares aapke Demat me credit ho jaate hain.
                  </div>
                </div>
              )}

              {currentPage.previewType === 'candlestick' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-3">
                    <h4 className="text-lg font-bold text-white font-['Outfit']">
                      Chapter 7: The Hammer Pattern (Bottom Reversal)
                    </h4>
                    <p className="text-xs text-emerald-400 font-mono">Section 7.3 • High-Probability Reversal Signals</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center">
                      {/* Candlestick visualization */}
                      <div className="flex flex-col items-center py-4">
                        <div className="w-[1.5px] h-3 bg-emerald-400" />
                        <div className="w-14 h-8 bg-emerald-500 rounded-xs flex items-center justify-center text-[10px] font-bold text-slate-950">
                          Body
                        </div>
                        <div className="w-[2px] h-20 bg-emerald-400" />
                      </div>
                      <p className="text-xs font-bold text-emerald-400">Bullish Hammer</p>
                      <p className="text-[10px] text-slate-400 text-center mt-1">
                        Lower shadow is at least 2x the body length
                      </p>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <p className="font-semibold text-white">Anatomy & Psychology:</p>
                      <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                        <li>Sellers ne price ko aggressively neeche push kiya.</li>
                        <li>Support level par strong buyers (Institutional Bulls) ne absorb kiya.</li>
                        <li>Close price high ke bohot close hua — showing buyer dominance.</li>
                        <li><strong>Entry Rule:</strong> Next candle ke Hammer high cross karne par entry.</li>
                        <li><strong>Stop Loss:</strong> Strictly placed just below the Hammer wick low.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {currentPage.previewType === 'risk' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-3">
                    <h4 className="text-lg font-bold text-white font-['Outfit']">
                      Chapter 9: The 1.5% Risk Management Math
                    </h4>
                    <p className="text-xs text-emerald-400 font-mono">Section 9.1 • Why Capital Preservation Beats Stock Picking</p>
                  </div>

                  <p className="text-sm text-slate-300">
                    Stock market me profit banne se pehle loss control karna aana chahiye. Agar aapka risk har trade par fixed nahi hai, toh 10 acche trades ka profit 1 kharab trade me saaf ho jayega.
                  </p>

                  <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/20 font-mono text-xs space-y-2">
                    <p className="text-emerald-400 font-bold">Position Sizing Formula:</p>
                    <p className="text-slate-200">
                      Max Allowed Loss (INR) = Total Capital × 0.015 (1.5%)
                    </p>
                    <p className="text-slate-200">
                      Quantity to Buy = Max Allowed Loss ÷ (Entry Price - Stop Loss Price)
                    </p>
                    <p className="text-slate-400 text-[11px] pt-1">
                      Example: ₹1,00,000 capital → Max loss ₹1,500. If entry is ₹500 and SL is ₹485 (Risk ₹15), Quantity = 100 shares.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-300">Mandatory Risk-Reward Target:</span>
                    <span className="font-bold text-emerald-400">Minimum 1:2 or 1:3</span>
                  </div>
                </div>
              )}

              {/* Bottom Quick Callout */}
              <div className="pt-6 mt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>Showing page {selectedPage + 1} of 200 total pages</span>
                </div>
                <button
                  id="preview-cta-buy-now"
                  onClick={onBuyClick}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wide shadow-md flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>GET FULL 200-PAGE PDF FOR ₹1</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Fullscreen Reader Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-3xl rounded-2xl bg-[#090e1c] border border-emerald-500/40 shadow-2xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">The Money Maker — Manuscript Sample Reader</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 text-sm text-slate-300">
              <p className="font-bold text-emerald-400">Key Highlights Inside The Full Edition:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>All 12 Chapters fully formatted with printable summary checklists.</li>
                <li>Over 65+ high-definition Indian candlestick chart screenshots.</li>
                <li>Demat account fee comparison and CDSL account verification checklist.</li>
                <li>Free lifetime access with future revisions and updates included.</li>
              </ul>
            </div>
            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  onBuyClick();
                }}
                className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md"
              >
                Buy Now — ₹1
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
