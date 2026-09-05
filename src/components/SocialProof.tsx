import React from 'react';
import { defaultTestimonials } from '../data/defaultData';
import { Star, ShieldCheck, MessageSquare, Quote } from 'lucide-react';
import { Testimonial } from '../types';

interface SocialProofProps {
  testimonials?: Testimonial[];
}

export const SocialProof: React.FC<SocialProofProps> = ({
  testimonials = defaultTestimonials
}) => {
  return (
    <section id="testimonials" className="py-20 bg-[#060a15] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Reader Experiences</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
            What Early Readers Are Saying
          </h2>
          <p className="mt-3 text-base text-slate-300">
            Real feedback from working professionals, students, and retail investors who started their market journey with Abhishek ji's guide.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/30 transition-all flex flex-col justify-between relative group"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-slate-800 group-hover:text-emerald-500/20 transition-colors pointer-events-none" />

              <div>
                {/* Star Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                  ))}
                  <span className="text-xs font-bold text-emerald-400 ml-1.5">{item.rating}.0</span>
                </div>

                {/* Review Text */}
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed italic">
                  "{item.review}"
                </p>
              </div>

              {/* Author Info */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-sm flex items-center justify-center">
                    {item.avatarText}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{item.name}</span>
                      {item.verified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" title="Verified Purchase" />
                      )}
                    </h4>
                    <p className="text-xs text-slate-400">{item.role} • {item.location}</p>
                  </div>
                </div>

                <span className="text-[11px] text-slate-500 font-mono">{item.date}</span>
              </div>

            </div>
          ))}
        </div>

        {/* Notice for Admin / Transparency */}
        <div className="text-center mt-10">
          <p className="text-xs text-slate-400">
            Reviews are collected from verified purchasers. Individual experiences and learning pace may vary.
          </p>
        </div>

      </div>
    </section>
  );
};
