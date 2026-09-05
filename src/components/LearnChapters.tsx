import React, { useState } from 'react';
import { 
  TrendingUp, ShieldCheck, BarChart3, Building2, LineChart, 
  Activity, Flame, Layers, Compass, PieChart, AlertTriangle, Brain, 
  ChevronRight, CheckCircle2
} from 'lucide-react';
import { Chapter } from '../types';

interface LearnChaptersProps {
  chapters: Chapter[];
  onSelectChapterPreview?: (chapterNumber: number) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  TrendingUp: <TrendingUp className="w-5 h-5 text-emerald-400" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
  BarChart3: <BarChart3 className="w-5 h-5 text-emerald-400" />,
  Building2: <Building2 className="w-5 h-5 text-emerald-400" />,
  LineChart: <LineChart className="w-5 h-5 text-emerald-400" />,
  Activity: <Activity className="w-5 h-5 text-emerald-400" />,
  Flame: <Flame className="w-5 h-5 text-emerald-400" />,
  Layers: <Layers className="w-5 h-5 text-emerald-400" />,
  Compass: <Compass className="w-5 h-5 text-emerald-400" />,
  PieChart: <PieChart className="w-5 h-5 text-emerald-400" />,
  AlertTriangle: <AlertTriangle className="w-5 h-5 text-amber-400" />,
  Brain: <Brain className="w-5 h-5 text-emerald-400" />,
};

export const LearnChapters: React.FC<LearnChaptersProps> = ({ chapters }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'foundations' | 'technical' | 'risk'>('all');

  const filteredChapters = chapters.filter((c) => {
    if (activeTab === 'foundations') return c.number <= 4;
    if (activeTab === 'technical') return c.number >= 5 && c.number <= 8;
    if (activeTab === 'risk') return c.number >= 9;
    return true;
  });

  return (
    <section id="chapters" className="py-20 bg-[#070b16] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>Comprehensive 200-Page Curriculum</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
            What You Will Learn Inside The Book
          </h2>
          <p className="mt-3 text-base text-slate-300">
            A structured, 12-chapter roadmap taking you from complete novice to a self-reliant, disciplined investor in the Indian equity markets.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${activeTab === 'all' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800/80 text-slate-300 hover:text-white'}`}
            >
              All 12 Chapters
            </button>
            <button
              onClick={() => setActiveTab('foundations')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${activeTab === 'foundations' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800/80 text-slate-300 hover:text-white'}`}
            >
              Foundations (Ch 1-4)
            </button>
            <button
              onClick={() => setActiveTab('technical')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${activeTab === 'technical' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800/80 text-slate-300 hover:text-white'}`}
            >
              Analysis & Candlesticks (Ch 5-8)
            </button>
            <button
              onClick={() => setActiveTab('risk')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${activeTab === 'risk' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800/80 text-slate-300 hover:text-white'}`}
            >
              Risk & Psychology (Ch 9-12)
            </button>
          </div>
        </div>

        {/* 12 Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChapters.map((chapter) => (
            <div
              key={chapter.number}
              id={`chapter-card-${chapter.number}`}
              className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 group flex flex-col justify-between"
            >
              <div>
                {/* Top Chapter Tag & Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center group-hover:border-emerald-500/40 transition-colors">
                    {iconMap[chapter.iconName] || <TrendingUp className="w-5 h-5 text-emerald-400" />}
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-slate-800/80 text-emerald-400 border border-slate-700">
                    Chapter {chapter.number < 10 ? `0${chapter.number}` : chapter.number}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {chapter.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  {chapter.description}
                </p>
              </div>

              {/* Bullet Key Points */}
              <div className="mt-5 pt-4 border-t border-slate-800/70 space-y-1.5">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Key Takeaways:</p>
                {chapter.highlights.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner Note */}
        <div className="mt-12 p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/25 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="text-sm font-bold text-white">Need a quick glance inside before purchasing?</p>
            <p className="text-xs text-slate-400">Explore authentic interactive sample pages from Chapters 4, 7, and 9 below.</p>
          </div>
          <a
            href="#preview"
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors whitespace-nowrap"
          >
            Open Interactive Preview Inside →
          </a>
        </div>

      </div>
    </section>
  );
};
