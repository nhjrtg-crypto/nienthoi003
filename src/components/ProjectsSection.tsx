import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, ExternalLink, Github, ArrowUpRight, Sparkles, Star } from 'lucide-react';
import { PORTFOLIO_PROJECTS } from '../data/portfolioData';
import { Project } from '../types';

interface ProjectsSectionProps {
  onSelectProject: (project: Project) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onSelectProject }) => {
  const [filter, setFilter] = useState<'all' | 'web' | 'creative' | 'uiux' | 'saas'>('all');

  const categories = [
    { id: 'all', label: 'All Creations' },
    { id: 'web', label: 'Web Applications' },
    { id: 'creative', label: '3D & Creative Coding' },
    { id: 'uiux', label: 'Design Systems & UI/UX' },
    { id: 'saas', label: 'SaaS & Telemetry' },
  ];

  const filteredProjects =
    filter === 'all'
      ? PORTFOLIO_PROJECTS
      : PORTFOLIO_PROJECTS.filter((p) => p.category === filter);

  return (
    <section id="projects" className="relative py-24 sm:py-32 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-800/40 text-purple-300 text-xs font-mono mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>CURATED ARTIFACTS</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-tektur font-bold text-white tracking-tight"
          >
            Featured Digital{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              Products & Systems
            </span>
          </motion.h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base">
            Each project represents a distinct technical challenge and handcrafted interaction philosophy.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
          {categories.map((cat) => {
            const isActive = filter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setFilter(cat.id as any);
                }}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]'
                    : 'bg-[#0E1026]/80 hover:bg-[#151838] border border-indigo-900/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj, idx) => (
              <motion.div
                key={proj.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group relative rounded-3xl bg-[#0C0E28]/90 border border-indigo-900/50 hover:border-purple-500/60 transition-all duration-500 shadow-xl overflow-hidden flex flex-col justify-between hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]"
              >
                <div>
                  {/* Card Image Thumbnail */}
                  <div
                    onClick={() => {
                      onSelectProject(proj);
                    }}
                    className="relative h-52 sm:h-56 w-full overflow-hidden cursor-pointer bg-slate-950"
                  >
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0C0E28] via-transparent to-black/30" />

                    {/* Featured Star Badge */}
                    {proj.featured && (
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-pink-500/90 text-white shadow-md flex items-center gap-1 backdrop-blur-sm">
                        <Star className="w-3 h-3 fill-current" />
                        Featured
                      </span>
                    )}

                    {/* Quick View Floating Action */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-9 h-9 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-lg backdrop-blur-sm">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <div className="text-[11px] font-mono text-purple-400 font-semibold uppercase tracking-wider mb-1.5">
                      {proj.categoryLabel}
                    </div>

                    <h3
                      onClick={() => {
                        onSelectProject(proj);
                      }}
                      className="text-xl font-bold font-tektur text-white group-hover:text-purple-200 transition-colors cursor-pointer mb-2"
                    >
                      {proj.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {proj.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {proj.tags.slice(0, 3).map((t, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-md text-[10px] font-mono bg-slate-900/90 border border-indigo-900/40 text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                      {proj.tags.length > 3 && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-900/50 text-slate-500">
                          +{proj.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-indigo-950/60">
                  <button
                    onClick={() => {
                      onSelectProject(proj);
                    }}
                    className="text-xs font-semibold text-purple-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Read Case Study</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        title="GitHub Code"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {proj.demoUrl && (
                      <a
                        href={proj.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 hover:text-white transition-colors"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
