import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  onExploreProjects: () => void;
  onGetInTouch?: () => void;
  onOpenCardModal?: (cardType: 'uiux' | 'interactions' | 'frontend') => void;
  onNavigateToNovels?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreProjects,
  onNavigateToNovels,
}) => {
  // Typewriter effect state
  const roles = [
    'Creative Developer',
    'UI/UX Designer',
    'Frontend Architect',
    'Motion & 3D Crafter',
  ];
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(120);

  // Orbital system hover & mouse tilt state
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 15;
      const y = (e.clientY / innerHeight - 0.5) * 15;
      setMouseTilt({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Smooth Typewriter cycling
  useEffect(() => {
    const targetRole = roles[currentRoleIndex];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(targetRole.substring(0, displayText.length + 1));
        setTypingSpeed(90);

        if (displayText.length === targetRole.length) {
          // Pause before deleting
          setTypingSpeed(1800);
          setIsDeleting(true);
        }
      } else {
        setDisplayText(targetRole.substring(0, displayText.length - 1));
        setTypingSpeed(45);

        if (displayText.length === 0) {
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
          setTypingSpeed(300);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentRoleIndex, typingSpeed, roles]);

  return (
    <section
      id="home"
      className="relative min-h-screen pt-28 pb-16 lg:py-0 flex flex-col justify-center overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Typography & Actions (Exact match to screenshot) */}
          <div className="lg:col-span-6 xl:col-span-6 z-10 space-y-6 sm:space-y-7">
            
            {/* Status Pill Badge & Novel Portal Link */}
            <div className="flex flex-wrap items-center gap-3">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A0D22]/85 border border-indigo-900/50 shadow-inner"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10B981]" />
                </span>
                <span className="text-xs font-medium text-slate-300 tracking-wide">
                  Available for freelance & contract
                </span>
              </motion.div>

              {onNavigateToNovels && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  onClick={() => {
                    onNavigateToNovels();
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-950/80 to-pink-950/80 hover:from-purple-900 hover:to-pink-900 border border-pink-500/50 text-xs font-bold text-pink-300 hover:text-white shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all cursor-pointer group"
                >
                  <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin-slow" />
                  <span>Khám phá CosmoNovels Platform →</span>
                </motion.button>
              )}
            </div>

            {/* Title Block */}
            <div className="space-y-2">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="block text-xs sm:text-sm font-semibold tracking-widest text-[#93C5FD] uppercase font-mono"
              >
                HELLO, I'M
              </motion.span>

              {/* Glowing Name Heading */}
              <motion.h1
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="font-tektur font-extrabold text-4xl sm:text-5xl md:text-6xl xl:text-7xl tracking-tight leading-none"
              >
                <span className="bg-gradient-to-r from-[#D8B4FE] via-[#A78BFA] to-[#818CF8] bg-clip-text text-transparent text-glow-purple">
                  Alex Morgan
                </span>
              </motion.h1>

              {/* Dynamic Typewriter Role */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="flex items-center text-xl sm:text-2xl md:text-3xl font-jakarta font-semibold text-slate-200 pt-1"
              >
                <span className="text-slate-400 font-normal mr-2">A</span>
                <span className="text-white font-bold">{displayText}</span>
                <span className="w-0.5 h-6 sm:h-7 bg-purple-400 ml-1 animate-pulse shadow-[0_0_8px_#C084FC]" />
              </motion.div>
            </div>

            {/* Description Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-sm sm:text-base md:text-lg text-slate-300/90 max-w-xl leading-relaxed font-normal"
            >
              I craft high-performance digital products and immersive visual
              experiences at the intersection of clean design and custom code.
            </motion.p>

            {/* Call to Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              {/* Primary Vibrant Explore Button */}
              <button
                onClick={() => {
                  onExploreProjects();
                }}
                className="group relative px-7 py-3.5 rounded-full font-semibold text-sm sm:text-base text-white overflow-hidden shadow-[0_0_25px_rgba(236,72,153,0.4)] hover:shadow-[0_0_35px_rgba(236,72,153,0.6)] transition-all duration-300 cursor-pointer flex items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #A855F7 0%, #C084FC 30%, #EC4899 100%)',
                }}
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* Right Column: Planetary Orbit System (Exact match to screenshot) */}
          <div className="lg:col-span-6 xl:col-span-6 relative flex items-center justify-center min-h-[420px] sm:min-h-[480px] lg:min-h-[540px]">
            
            {/* Interactive 3D Parallax Container */}
            <div
              className="relative w-full max-w-[500px] aspect-square flex items-center justify-center transition-transform duration-300 ease-out"
              style={{
                transform: `perspective(1000px) rotateY(${mouseTilt.x}deg) rotateX(${-mouseTilt.y}deg)`,
              }}
            >
              {/* Outer Glow Cloud */}
              <div className="absolute w-72 h-72 rounded-full bg-purple-600/15 blur-3xl animate-pulse-slow" />
              <div className="absolute w-96 h-96 rounded-full bg-pink-600/10 blur-3xl" />

              {/* Orbit 3 (Outer Ring - 420px) */}
              <div className="absolute w-[360px] sm:w-[420px] h-[360px] sm:h-[420px] rounded-full border border-indigo-900/30">
                {/* Orbiting Satellite Particle on Outer Track */}
                <div className="absolute inset-0 animate-orbit-3">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_#C084FC]" />
                </div>
              </div>

              {/* Orbit 2 (Middle Ring - 310px with dashed accent) */}
              <div className="absolute w-[270px] sm:w-[310px] h-[270px] sm:h-[310px] rounded-full border border-dashed border-indigo-800/40">
                {/* Orbiting Satellite Particle on Middle Track */}
                <div className="absolute inset-0 animate-orbit-2">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 rounded-full bg-pink-400 shadow-[0_0_12px_#F472B6]" />
                  <div className="absolute top-1/4 right-0 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#67E8F9]" />
                </div>
              </div>

              {/* Orbit 1 (Inner Ring - 210px) */}
              <div className="absolute w-[180px] sm:w-[210px] h-[180px] sm:h-[210px] rounded-full border border-indigo-700/50">
                <div className="absolute inset-0 animate-orbit-1">
                  <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#FFFFFF]" />
                </div>
              </div>

              {/* Central Glowing Planet Orb (Matches screenshot perfectly) */}
              <div className="relative z-10 flex items-center justify-center">
                {/* Outermost multi-stage radiant glow rings */}
                <div className="absolute w-44 h-44 rounded-full bg-purple-600/20 blur-xl animate-pulse-slow" />
                <div className="absolute w-32 h-32 rounded-full bg-pink-500/25 blur-lg" />

                {/* Planet Sphere */}
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-[0_0_40px_rgba(236,72,153,0.7)] flex items-center justify-center cursor-pointer transform hover:scale-110 transition-transform duration-300"
                  style={{
                    background:
                      'radial-gradient(circle at 35% 35%, #F472B6 0%, #C084FC 40%, #7E22CE 75%, #4C1D95 100%)',
                  }}
                  title="Cosmic Core"
                >
                  <Sparkles className="w-5 h-5 text-white/90 animate-spin-slow opacity-80" />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom SCROLL Indicator (Exact match to screenshot) */}
        <div className="pt-12 sm:pt-16 pb-4 text-center">
          <button
            onClick={() => {
              const el = document.getElementById('welcome-intro') || document.getElementById('about');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex flex-col items-center gap-2 text-[10px] sm:text-xs font-mono tracking-widest text-slate-500 hover:text-slate-300 transition-colors uppercase cursor-pointer"
          >
            <span>SCROLL</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce text-purple-400" />
          </button>
        </div>
      </div>
    </section>
  );
};
