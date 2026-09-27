import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, PenTool, Star, Code2, CheckCircle2, ArrowRight } from 'lucide-react';

interface CardDetailModalProps {
  cardType: 'uiux' | 'interactions' | 'frontend' | null;
  onClose: () => void;
  onNavigateToProjects: () => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  cardType,
  onClose,
  onNavigateToProjects,
}) => {
  if (!cardType) return null;

  const cardData = {
    uiux: {
      title: 'UI/UX Design & Spatial Systems',
      subtitle: 'Pixel Perfect & High-Fidelity Prototyping',
      icon: PenTool,
      gradient: 'from-purple-500 to-indigo-500',
      badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-950/40',
      description:
        'Bridging the gap between conceptual human-centered design and production-grade software. I create systematic design languages with mathematical spacing, accessible color contrast, and seamless micro-interactions.',
      capabilities: [
        'Atomic Design Systems & Figma Token Pipelines',
        'High-density Financial & Telemetry Dashboards',
        'Spatial Canvas & 3D Web UI Prototyping',
        'WCAG AA / AAA Accessibility Auditing & Implementation',
        'Rapid Interactive Wireframes & User Journey Mapping',
      ],
      stats: [
        { label: 'Figma Components', value: '1,200+' },
        { label: 'Design Systems Shipped', value: '14+' },
        { label: 'Avg Design System Adoption', value: '98%' },
      ],
    },
    interactions: {
      title: 'Interactions & Motion Design',
      subtitle: 'GSAP, Framer Motion & Physics Orchestration',
      icon: Star,
      gradient: 'from-pink-500 to-rose-500',
      badgeColor: 'text-pink-400 border-pink-500/30 bg-pink-950/40',
      description:
        'Motion is not merely decorative—it is the visual grammar that guides user attention, provides reassuring haptic-visual feedback, and turns standard web applications into unforgettable sensory experiences.',
      capabilities: [
        'Spring Physics & Smooth Drag Gestures',
        'Cinematic Scroll-Triggered Timelines & Storytelling',
        'HTML5 Canvas 2D Particle Simulators & Generative Art',
        'Shader Materials & WebGL Lighting Transitions',
        'Zero-Jank 60FPS Layout Shifts & Orchestration',
      ],
      stats: [
        { label: 'Frame Rate Target', value: '60 FPS' },
        { label: 'Awwwards Recognitions', value: '9 Awards' },
        { label: 'Micro-interaction Library', value: '80+ Specs' },
      ],
    },
    frontend: {
      title: 'Frontend Architecture & Performance',
      subtitle: 'React 19, Next.js 15, TypeScript & Web Standards',
      icon: Code2,
      gradient: 'from-cyan-500 to-blue-500',
      badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40',
      description:
        'Writing clean, modular, and enterprise-scalable TypeScript that renders instantaneously. Specializing in zero-bundle overhead, modern React Server Components, responsive Tailwind CSS layouts, and resilient state architecture.',
      capabilities: [
        'React 19 Server Components & Actions',
        'Next.js 15 App Router & Edge Runtime Optimization',
        'Strict TypeScript Type Safety & Custom Hooks',
        'Tailwind CSS v4 & Responsive Fluid Grids',
        'Real-time WebSockets & Optimistic State Sync',
      ],
      stats: [
        { label: 'Lighthouse Performance', value: '99/100' },
        { label: 'Codebase Test Coverage', value: '92%' },
        { label: 'Production Releases', value: '180+' },
      ],
    },
  };

  const data = cardData[cardType];
  const Icon = data.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="relative w-full max-w-2xl bg-[#0B0D23] border border-indigo-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden z-10"
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={() => {
              onClose();
            }}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-900/60 hover:bg-slate-800 border border-indigo-900/40 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="flex items-start gap-4 mb-6">
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${data.gradient} p-0.5 shadow-lg shrink-0`}
            >
              <div className="w-full h-full bg-[#0B0D23] rounded-[14px] flex items-center justify-center text-white">
                <Icon className="w-6 h-6" />
              </div>
            </div>
            <div>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${data.badgeColor} mb-1`}>
                FEATURED DOMAIN
              </span>
              <h3 className="text-xl sm:text-2xl font-tektur font-bold text-white">
                {data.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                {data.subtitle}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            {data.description}
          </p>

          {/* Capabilities List */}
          <div className="mb-6">
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3">
              Core Capabilities & Execution
            </h4>
            <div className="space-y-2">
              {data.capabilities.map((cap, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{cap}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/60 border border-indigo-950/60 mb-6">
            {data.stats.map((st, i) => (
              <div key={i} className="text-center">
                <div className="text-base sm:text-lg font-bold text-white font-tektur">
                  {st.value}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-400">
                  {st.label}
                </div>
              </div>
            ))}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-indigo-900/30">
            <button
              onClick={onClose}
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onNavigateToProjects();
              }}
              className="px-5 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <span>View Related Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
