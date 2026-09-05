import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const TickerBar: React.FC = () => {
  const indices = [
    { name: 'NIFTY 50', val: '24,852.15', chg: '+142.30 (+0.58%)', up: true },
    { name: 'SENSEX', val: '81,455.40', chg: '+428.10 (+0.53%)', up: true },
    { name: 'BANKNIFTY', val: '51,320.80', chg: '+385.90 (+0.76%)', up: true },
    { name: 'INDIA VIX', val: '12.85', chg: '-0.42 (-3.16%)', up: false },
    { name: 'RELIANCE', val: '2,940.00', chg: '+24.50 (+0.84%)', up: true },
    { name: 'HDFCBANK', val: '1,685.20', chg: '+18.10 (+1.08%)', up: true },
    { name: 'TCS', val: '4,150.00', chg: '+12.00 (+0.29%)', up: true },
  ];

  return (
    <div className="w-full bg-[#030712] border-y border-slate-800/80 py-2 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-6 overflow-x-auto no-scrollbar text-xs">
        <div className="flex items-center gap-1.5 shrink-0 text-emerald-400 font-semibold uppercase tracking-wider text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span>LIVE MARKET WATCH</span>
        </div>
        <div className="flex items-center gap-8 shrink-0">
          {indices.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-slate-300 font-medium">{item.name}</span>
              <span className="font-mono text-slate-100 font-bold">{item.val}</span>
              <span className={`inline-flex items-center gap-0.5 font-mono text-[11px] ${item.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                {item.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {item.chg}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
