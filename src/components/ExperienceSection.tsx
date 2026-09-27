import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, Calendar, MapPin, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { EXPERIENCE_TIMELINE } from '../data/portfolioData';

export const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="relative py-24 sm:py-32 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-950/40 border border-pink-800/40 text-pink-300 text-xs font-mono mb-4"
          >
            <Briefcase className="w-3.5 h-3.5 text-pink-400" />
            <span>CAREER TRAJECTORY</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-tektur font-bold text-white tracking-tight"
          >
            Milestones & Professional{' '}
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Experience
            </span>
          </motion.h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base">
            Track record of shipping impactful software for venture-backed hypergrowth startups and global creative agencies.
          </p>
        </div>

        {/* Timeline Stream */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Glowing Line */}
          <div className="absolute top-4 bottom-4 left-4 sm:left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-indigo-800 shadow-[0_0_10px_rgba(236,72,153,0.5)]" />

          <div className="space-y-12 sm:space-y-16">
            {EXPERIENCE_TIMELINE.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={item.id}
                  className={`relative flex flex-col sm:flex-row items-start ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  } gap-6 sm:gap-12`}
                >
                  {/* Center Node Orbit */}
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#07091B] border-2 border-pink-400 shadow-[0_0_15px_#EC4899] flex items-center justify-center z-20">
                    <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping opacity-75" />
                  </div>

                  {/* Empty Spacer on opposite side for desktop layout */}
                  <div className="hidden sm:block sm:w-1/2" />

                  {/* Content Card */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="w-full sm:w-1/2 pl-12 sm:pl-0"
                  >
                    <div className="p-6 sm:p-7 rounded-3xl bg-[#0C0E26]/90 border border-indigo-900/50 hover:border-purple-500/50 transition-all shadow-xl backdrop-blur-md">
                      
                      {/* Meta Pill */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-pink-400">
                          <Calendar className="w-3 h-3" />
                          {item.period}
                        </span>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-900 border border-indigo-900/50 text-slate-400">
                          {item.type}
                        </span>
                      </div>

                      {/* Title & Company */}
                      <h3 className="text-lg sm:text-xl font-bold font-tektur text-white mb-1">
                        {item.role}
                      </h3>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-purple-300 font-medium mb-4">
                        <span>{item.company}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-400 text-xs">
                          <MapPin className="w-3 h-3" />
                          {item.location}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                        {item.description}
                      </p>

                      {/* Highlights */}
                      <div className="space-y-2 mb-4">
                        {item.highlights.map((hl, hIndex) => (
                          <div key={hIndex} className="flex items-start gap-2 text-xs text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                            <span>{hl}</span>
                          </div>
                        ))}
                      </div>

                      {/* Tech Chips */}
                      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-indigo-950">
                        {item.technologies.map((t, tIndex) => (
                          <span
                            key={tIndex}
                            className="px-2.5 py-0.5 rounded-md text-[10px] font-mono bg-slate-900/80 text-slate-400 border border-indigo-900/30"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
