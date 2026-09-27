import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Github, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="relative w-full max-w-3xl bg-[#0B0D23] border border-indigo-800/60 rounded-3xl overflow-hidden shadow-2xl z-10 my-8"
        >
          {/* Close Button */}
          <button
            onClick={() => {
              onClose();
            }}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Project Banner Image */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-950">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D23] via-[#0B0D23]/40 to-transparent" />
            
            {/* Category Tag on Image */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-purple-950/80 border border-purple-500/50 text-purple-300 backdrop-blur-md">
                  {project.categoryLabel}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-tektur text-white mt-2">
                  {project.title}
                </h3>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2">
                Executive Overview
              </h4>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                {project.fullOverview}
              </p>
            </div>

            {/* Metrics */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/60 border border-indigo-950/60">
                {project.metrics.map((m, i) => (
                  <div key={i} className="text-center">
                    <div className="text-base sm:text-xl font-bold font-tektur text-pink-300">
                      {m.value}
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tech Stack */}
            <div>
              <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2">
                Engineered With
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-[#131638] border border-indigo-800/40 text-purple-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-indigo-900/30">
              <button
                onClick={onClose}
                className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Back to Portfolio
              </button>

              <div className="flex items-center gap-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-indigo-800/40 text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>View Repository</span>
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 flex items-center gap-1.5 shadow-md transition-all"
                  >
                    <span>Launch Live Demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
