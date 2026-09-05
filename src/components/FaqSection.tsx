import React, { useState } from 'react';
import { defaultFAQs } from '../data/defaultData';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FAQItem } from '../types';

interface FaqSectionProps {
  faqs?: FAQItem[];
}

export const FaqSection: React.FC<FaqSectionProps> = ({ faqs = defaultFAQs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-[#070b16] relative border-t border-slate-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-base text-slate-300">
            Everything you need to know about the format, payment security, and delivery of The Money Maker.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-slate-900 border-emerald-500/40 shadow-lg'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-base sm:text-lg font-bold text-white font-['Outfit']">
                    {faq.question}
                  </span>
                  <div className={`p-1.5 rounded-full bg-slate-800 text-emerald-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-emerald-500/20' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm sm:text-base text-slate-300 leading-relaxed border-t border-slate-800/80">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Contact Help Note */}
        <div className="mt-10 p-5 rounded-2xl bg-slate-900/70 border border-slate-800 text-center">
          <p className="text-sm text-slate-300">
            Have another query not answered above? Write directly to{' '}
            <a href="mailto:support@the-money-maker.in" className="text-emerald-400 underline font-semibold">
              support@the-money-maker.in
            </a>{' '}
            or WhatsApp our support desk.
          </p>
        </div>

      </div>
    </section>
  );
};
