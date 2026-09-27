import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Menu, X, Sparkles, Send } from 'lucide-react';
import { useHeaderScroll } from '../utils/useHeaderScroll';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onNavigateToNovels?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate, onNavigateToNovels }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHeaderVisible = useHeaderScroll({ threshold: 40, delta: 6 });
  const shouldShowHeader = isHeaderVisible || mobileMenuOpen;

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform ${
        shouldShowHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      } ${
        isScrolled
          ? 'bg-[#060713]/75 glass-header border-b border-indigo-900/40 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)]'
          : 'bg-transparent py-5 sm:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo (AM with glowing pink dot - exact from screenshot) */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-1 group cursor-pointer text-left focus:outline-hidden"
          title="Alex Morgan - Home"
        >
          <span className="font-tektur font-extrabold text-2xl sm:text-3xl tracking-tight text-white group-hover:text-purple-200 transition-colors">
            AM
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-[0_0_12px_#EC4899] group-hover:scale-125 transition-transform" />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="relative py-1 text-sm font-medium transition-colors cursor-pointer group focus:outline-hidden"
              >
                <span
                  className={`${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  } transition-colors tracking-wide`}
                >
                  {link.label}
                </span>

                {/* Active Indicator Underline (Glowing Pink Pill) */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-[0_0_10px_rgba(236,72,153,0.8)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Novel Platform Portal Link */}
          {onNavigateToNovels && (
            <button
              onClick={() => {
                onNavigateToNovels();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.4)] hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] border border-pink-400/40 transition-all cursor-pointer"
              title="Khám phá Trang Chủ Đăng & Đọc Tiểu Thuyết Vũ Trụ"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-200" />
              <span>CosmoNovels</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </button>
          )}

          {/* Theme / Lunar Sphere Toggle (Matches Moon icon button in screenshot top-right) */}
          <button
            onClick={() => {
              // Smooth scroll to top
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0E0F24]/80 hover:bg-purple-950/50 border border-indigo-800/40 hover:border-purple-500/50 text-purple-300 flex items-center justify-center shadow-lg transition-all cursor-pointer group"
            title="Cosmic Night Mode Active"
          >
            <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-purple-300 group-hover:rotate-12 transition-transform shadow-[0_0_8px_rgba(192,132,252,0.6)]" />
          </button>

          {/* Contact Fast CTA */}
          <button
            onClick={() => handleNavClick('contact')}
            className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/50 hover:to-pink-600/50 border border-purple-500/40 text-purple-200 hover:text-white transition-all shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Hire Me</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-900/60 border border-indigo-900/40 text-slate-300 md:hidden cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#070817]/95 backdrop-blur-xl border-b border-indigo-900/40 overflow-hidden"
          >
            <div className="px-6 py-5 space-y-3">
              {onNavigateToNovels && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigateToNovels();
                  }}
                  className="w-full text-left py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-between shadow-md"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Vào Trang Tiểu Thuyết Vũ Trụ (CosmoNovels)</span>
                  </span>
                  <span>→</span>
                </button>
              )}
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`w-full text-left py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                      activeSection === link.id
                        ? 'bg-purple-950/50 text-white border border-pink-500/40'
                        : 'text-slate-300 hover:bg-slate-900/40 hover:text-white'
                    }`}
                  >
                    <span>{link.label}</span>
                    {activeSection === link.id && (
                      <span className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_#EC4899]" />
                    )}
                  </button>
                );
              })}

              <div className="pt-3 border-t border-indigo-900/30 flex items-center justify-end">
                <button
                  onClick={() => handleNavClick('contact')}
                  className="flex items-center gap-1.5 text-xs text-white py-2 px-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 font-semibold cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Get in Touch</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
