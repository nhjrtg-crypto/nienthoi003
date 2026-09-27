import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code2, Sparkles, PenTool, Terminal, Layers, Cpu, Check, Zap } from 'lucide-react';
import { SKILL_CATEGORIES } from '../data/portfolioData';

export const SkillsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('frontend');

  const iconsMap: Record<string, React.ElementType> = {
    Code2,
    Sparkles,
    PenTool,
    Terminal,
  };

  const currentCategory = SKILL_CATEGORIES.find((c) => c.id === activeTab) || SKILL_CATEGORIES[0];

  return (
    <section id="skills" className="relative py-24 sm:py-32 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 text-xs font-mono mb-4"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>ARSENAL & PROFICIENCY</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-tektur font-bold text-white tracking-tight"
          >
            Tech Stack & Specialized{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Disciplines
            </span>
          </motion.h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base">
            From low-level canvas shaders to scalable multi-brand design architectures.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-4 mb-12">
          {SKILL_CATEGORIES.map((cat) => {
            const Icon = iconsMap[cat.icon] || Layers;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveTab(cat.id);
                }}
                className={`px-4 sm:px-6 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2.5 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/80 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                    : 'bg-[#0A0C20]/80 hover:bg-[#121430] border border-indigo-900/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-pink-400' : 'text-slate-400'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="p-6 sm:p-10 rounded-3xl bg-[#0B0D23]/90 border border-indigo-800/50 backdrop-blur-xl shadow-2xl relative overflow-hidden"
          >
            {/* Ambient Background Gradient */}
            <div className="absolute top-0 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="mb-8 max-w-2xl">
              <h3 className="text-xl sm:text-2xl font-bold font-tektur text-white mb-2">
                {currentCategory.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                {currentCategory.description}
              </p>
            </div>

            {/* Skill Bars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {currentCategory.skills.map((skill, index) => (
                <div
                  key={index}
                  className="p-4 sm:p-5 rounded-2xl bg-[#060817]/70 border border-indigo-950/80 hover:border-indigo-700/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-pink-400" />
                      {skill.name}
                    </span>
                    <span className="text-xs font-mono font-semibold text-purple-300">
                      {skill.experience}
                    </span>
                  </div>

                  {/* Meter Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden mb-2.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-400 shadow-[0_0_8px_rgba(236,72,153,0.5)]"
                    />
                  </div>

                  {skill.highlight && (
                    <div className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      <span>{skill.highlight}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Floating Tech Chips Galaxy */}
            <div className="mt-10 pt-8 border-t border-indigo-900/30 flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-xs font-mono uppercase text-slate-400 tracking-wider mr-2">
                Ecosystem & Tools:
              </span>
              {[
                'React 19',
                'Next.js 15',
                'TypeScript',
                'Tailwind CSS v4',
                'GSAP',
                'Three.js',
                'Framer Motion',
                'Figma Tokens',
                'WebGL / GLSL',
                'D3.js',
                'Zustand',
                'Storybook',
                'Node.js',
                'Docker',
                'Git / GitHub Actions',
              ].map((tool, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-[#101330] border border-indigo-800/40 text-slate-300 hover:text-white hover:border-pink-500/50 transition-colors"
                >
                  {tool}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
