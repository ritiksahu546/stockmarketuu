import React from 'react';
import { defaultBenefits } from '../data/defaultData';
import { 
  BookOpen, CheckCircle2, Sparkles, GraduationCap, Download, Smartphone, 
  ShieldCheck, Zap, HelpCircle
} from 'lucide-react';

const benefitIcons: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="w-6 h-6 text-emerald-400" />,
  CheckCircle2: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
  Sparkles: <Sparkles className="w-6 h-6 text-emerald-400" />,
  GraduationCap: <GraduationCap className="w-6 h-6 text-emerald-400" />,
  Download: <Download className="w-6 h-6 text-emerald-400" />,
  Smartphone: <Smartphone className="w-6 h-6 text-emerald-400" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
  Zap: <Zap className="w-6 h-6 text-emerald-400" />,
  HelpCircle: <HelpCircle className="w-6 h-6 text-emerald-400" />
};

export const WhyThisBook: React.FC = () => {
  return (
    <section id="benefits" className="py-20 bg-[#070c18] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Why Readers Choose Abhishek Ji's Guide</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
            Designed Specifically for Indian Market Beginners
          </h2>
          <p className="mt-3 text-base text-slate-300">
            Cut through social media noise, Telegram group tips, and expensive courses. Learn timeless principles of risk, reward, and wealth creation.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {defaultBenefits.map((benefit) => (
            <div
              key={benefit.id}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/30 transition-all duration-200 hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center mb-5 group-hover:border-emerald-500/40 transition-colors">
                {benefitIcons[benefit.iconName] || <Zap className="w-6 h-6 text-emerald-400" />}
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                {benefit.title}
              </h3>
              <p className="mt-2.5 text-sm text-slate-300 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Comparison Box: Typical Internet Noise vs The Money Maker */}
        <div className="mt-16 rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden">
          <div className="p-6 sm:p-8">
            <h3 className="text-xl font-bold text-white text-center mb-6 font-['Outfit']">
              The Reality Check: Expensive Online Courses vs. This Book
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Other Courses */}
              <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-3">
                <p className="text-sm font-bold text-rose-400 uppercase tracking-wider">
                  Typical Stock Market Courses & Groups
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>Cost between ₹5,000 to ₹35,000+</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>Push risky Options trading & fake screenshot hype</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>Leave you dependent on daily paid advisory tips</span>
                  </li>
                </ul>
              </div>

              {/* The Money Maker */}
              <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-3">
                <p className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                  The Money Maker E-Book (₹1 Only)
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>One-time ₹1 investment with instant lifetime download</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Focus on long-term capital safety, cash flows & genuine chart reading</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Makes you a self-sufficient, independent investor</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
