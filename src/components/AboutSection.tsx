import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Code, Compass, Award, Rocket, Check, Download, ExternalLink } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const [resumeDownloaded, setResumeDownloaded] = useState(false);
  const stats = [
    { label: 'Years of Craft', value: '6+', description: 'Specialized in frontend & spatial web' },
    { label: 'Projects Shipped', value: '45+', description: 'From startups to enterprise' },
    { label: 'Design & Code Awards', value: '15+', description: 'Awwwards, FWA & CSSDA' },
    { label: 'Client Satisfaction', value: '99.8%', description: 'Worldwide collaboration' },
  ];

  const philosophies = [
    {
      title: 'Design with Intent',
      desc: 'Form follows emotion. Every pixel, margin, and typography hierarchy must serve a distinct purpose.',
      icon: Compass,
    },
    {
      title: 'Code with Precision',
      desc: 'Writing clean, resilient, and performant TypeScript that scales seamlessly with zero runtime friction.',
      icon: Code,
    },
    {
      title: 'Immerse with Motion',
      desc: 'Harnessing subtle physics, spring curves, and spatial depth to create tactile digital realism.',
      icon: Sparkles,
    },
  ];

  return (
    <section id="about" className="relative py-24 sm:py-32 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-800/40 text-purple-300 text-xs font-mono mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>ORIGIN & MISSION</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-tektur font-bold text-white tracking-tight"
          >
            Pioneering the Future of the{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              Spatial & Interactive Web
            </span>
          </motion.h2>
        </div>

        {/* Two-Column About Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          {/* Left: Bio & Highlights */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold font-jakarta text-slate-100">
              Hi, I'm Alex — an engineer with a designer's heart and a creator's curiosity.
            </h3>

            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
              Over the past 6+ years, I’ve dedicated myself to bridging the chasm between complex
              computational logic and soulful visual aesthetics. I don't just build websites; I design
              interactive ecosystems where typography, performance, and motion harmoniously coexist.
            </p>

            <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
              Whether architecting a multi-tenant React 19 design system, crafting GPU-accelerated
              WebGL visualizers, or refining sub-pixel micro-interactions for SaaS founders, my goal
              remains constant: <strong className="text-slate-200">make the digital world feel tangible, responsive, and wonderfully alive.</strong>
            </p>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {philosophies.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#0C0E24]/80 border border-indigo-900/40 hover:border-purple-500/40 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-300 mb-3">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">{p.title}</h4>
                    <p className="text-xs text-slate-400 leading-normal">{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Interactive Bio Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#101230]/90 to-[#0A0C1E]/90 border border-indigo-800/50 shadow-2xl backdrop-blur-xl">
              
              {/* Card Aura */}
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Status Header */}
              <div className="flex items-center justify-between pb-6 border-b border-indigo-900/40 mb-6">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 p-0.5 shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                      alt="Alex Morgan Portrait"
                      className="w-full h-full object-cover rounded-[14px]"
                    />
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0B0D23]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Alex Morgan</h4>
                    <span className="text-xs text-slate-400">San Francisco, CA</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-pink-400 font-semibold block">STATUS</span>
                  <span className="text-xs text-emerald-400 font-medium">Ready for Projects</span>
                </div>
              </div>

              {/* Quick specs */}
              <div className="space-y-3 text-xs sm:text-sm text-slate-300 mb-6">
                <div className="flex justify-between py-1.5 border-b border-indigo-950/60">
                  <span className="text-slate-400">Primary Stack</span>
                  <span className="font-mono text-purple-300 font-medium">React 19, TypeScript, Next.js</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-indigo-950/60">
                  <span className="text-slate-400">Creative Stack</span>
                  <span className="font-mono text-pink-300 font-medium">Three.js, GSAP, Canvas 2D</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-indigo-950/60">
                  <span className="text-slate-400">Experience Level</span>
                  <span className="font-mono text-indigo-300 font-medium">Senior / Staff Hybrid</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Timezone</span>
                  <span className="font-mono text-slate-200">PST (UTC-8) • Global Async</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <a
                  href="#contact"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold text-center transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  <span>Start a Conversation</span>
                </a>
                <button
                  onClick={() => {
                    setResumeDownloaded(true);
                    setTimeout(() => setResumeDownloaded(false), 3000);
                  }}
                  className={`p-2.5 rounded-xl border transition-colors cursor-pointer flex items-center justify-center ${
                    resumeDownloaded
                      ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-900/80 hover:bg-slate-800 border-indigo-800/40 text-slate-300 hover:text-white'
                  }`}
                  title={resumeDownloaded ? 'Resume Downloaded' : 'Download Resume PDF'}
                >
                  {resumeDownloaded ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Counters Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-[#090B1E]/80 border border-indigo-900/40 backdrop-blur-md">
          {stats.map((stat, i) => (
            <div key={i} className="text-center sm:text-left sm:border-r last:border-r-0 border-indigo-900/30 px-2 sm:px-4">
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-tektur bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-200">{stat.label}</div>
              <div className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">{stat.description}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
