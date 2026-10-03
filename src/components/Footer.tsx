import React from 'react';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  isNovelPlatform?: boolean;
  borderClass?: string;
  bgClass?: string;
  theme?: string;
  isDarkMode?: boolean;
  isHomePage?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  isNovelPlatform = false,
  borderClass,
  bgClass,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isNovelPlatform) {
    return (
      <footer className={`mt-auto w-full relative py-6 sm:py-8 border-t transition-colors z-10 ${borderClass || 'border-black/10 dark:border-white/10'} ${bgClass || 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-4">
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="flex items-center text-center sm:text-left">
              <span className="opacity-60 text-xs sm:text-sm">
                © {new Date().getFullYear()} Niên Thời - Jouriee65
              </span>
            </div>

            {/* Total Reads Counter with Reload button & Back to top */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap justify-center sm:justify-end">
              {/* Back to top button */}
              <button
                onClick={scrollToTop}
                className="p-2.5 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer shadow-xs"
                title="Cuộn lên đầu trang"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* WordPress & Wattpad logos - Dưới cùng nằm ở giữa */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <a
              href="https://nienthoi003.wordpress.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-black/10 dark:border-white/10 bg-black/[0.04] dark:bg-white/[0.05] hover:bg-[#21759B]/15 hover:border-[#21759B]/50 text-stone-600 dark:text-stone-300 hover:text-[#21759B] dark:hover:text-[#42b0e8] transition-all cursor-pointer shadow-xs group"
              title="Niên Thời trên WordPress (https://nienthoi003.wordpress.com/)"
              aria-label="WordPress"
            >
              <svg role="img" viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current transition-transform duration-200 group-hover:scale-110" xmlns="http://www.w3.org/2000/svg">
                <title>WordPress</title>
                <path d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.11m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.15-2.85-.15-.585-.03-.661.855-.075.885 0 0 .54.061 1.125.09l1.68 4.605-2.37 7.08L5.354 6.9c.649-.03 1.234-.1 1.234-.1.585-.075.516-.93-.065-.896 0 0-1.746.138-2.874.138-.2 0-.438-.008-.69-.015C4.911 3.15 8.235 1.215 12 1.215c2.809 0 5.365 1.072 7.286 2.833-.046-.003-.091-.009-.141-.009-1.06 0-1.812.923-1.812 1.914 0 .89.513 1.643 1.06 2.531.411.72.89 1.643.89 2.977 0 .915-.354 1.994-.821 3.479l-1.075 3.585-3.9-11.61.001.014zM12 22.784c-1.059 0-2.081-.153-3.048-.437l3.237-9.406 3.315 9.087c.024.053.05.101.078.149-1.12.393-2.325.609-3.582.609M1.211 12c0-1.564.336-3.05.935-4.39L7.29 21.709C3.694 19.96 1.212 16.271 1.211 12M12 0C5.385 0 0 5.385 0 12s5.385 12 12 12 12-5.385 12-12S18.615 0 12 0"/>
              </svg>
            </a>
            <a
              href="https://www.wattpad.com/user/Qingxiya52"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-black/10 dark:border-white/10 bg-black/[0.04] dark:bg-white/[0.05] hover:bg-[#FF6122]/15 hover:border-[#FF6122]/50 text-stone-600 dark:text-stone-300 hover:text-[#FF6122] dark:hover:text-[#ff7843] transition-all cursor-pointer shadow-xs group"
              title="Niên Thời trên Wattpad (https://www.wattpad.com/user/Qingxiya52)"
              aria-label="Wattpad"
            >
              <svg role="img" viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current transition-transform duration-200 group-hover:scale-110" xmlns="http://www.w3.org/2000/svg">
                <title>Wattpad</title>
                <path d="M13.034 3.09c-1.695.113-3.9 2.027-6.9 6.947.245-2.758.345-4.716-.857-5.743-.823-.702-2.764-.974-3.926.536C.18 6.349-.09 9.312.024 12.432c.238 6.518 2.544 8.487 4.59 8.487h.001c3.623 0 4.13-4.439 6.604-8.4-.09 1.416-.008 2.668.266 3.532 1.078 3.398 4.784 3.663 6.467.21 2.374-4.87 3.058-6.016 5.453-9.521 1.58-2.314-.252-3.812-2.374-2.735-1.09.554-2.86 1.935-5.065 4.867.387-2.23.28-5.996-2.932-5.782z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative py-10 border-t border-indigo-950/80 z-10 bg-[#04050E]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-5">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand & Copy */}
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-xs sm:text-sm">
              © 2026 Niên Thời - Jouriee65
            </span>
          </div>

          {/* Visitor counter & Back to Top */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center sm:justify-end">
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-full bg-[#0E1026] hover:bg-purple-950/60 border border-indigo-800/40 text-slate-300 hover:text-white transition-all cursor-pointer shadow-md"
              title="Scroll to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* WordPress & Wattpad logos - Dưới cùng nằm ở giữa */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <a
            href="https://nienthoi003.wordpress.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full border border-indigo-900/50 bg-[#0E1026]/70 hover:bg-[#21759B]/20 hover:border-[#21759B]/50 text-slate-400 hover:text-[#3895c4] transition-all cursor-pointer shadow-md group"
            title="Niên Thời trên WordPress (https://nienthoi003.wordpress.com/)"
            aria-label="WordPress"
          >
            <svg role="img" viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current transition-transform duration-200 group-hover:scale-110" xmlns="http://www.w3.org/2000/svg">
              <title>WordPress</title>
              <path d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.11m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.15-2.85-.15-.585-.03-.661.855-.075.885 0 0 .54.061 1.125.09l1.68 4.605-2.37 7.08L5.354 6.9c.649-.03 1.234-.1 1.234-.1.585-.075.516-.93-.065-.896 0 0-1.746.138-2.874.138-.2 0-.438-.008-.69-.015C4.911 3.15 8.235 1.215 12 1.215c2.809 0 5.365 1.072 7.286 2.833-.046-.003-.091-.009-.141-.009-1.06 0-1.812.923-1.812 1.914 0 .89.513 1.643 1.06 2.531.411.72.89 1.643.89 2.977 0 .915-.354 1.994-.821 3.479l-1.075 3.585-3.9-11.61.001.014zM12 22.784c-1.059 0-2.081-.153-3.048-.437l3.237-9.406 3.315 9.087c.024.053.05.101.078.149-1.12.393-2.325.609-3.582.609M1.211 12c0-1.564.336-3.05.935-4.39L7.29 21.709C3.694 19.96 1.212 16.271 1.211 12M12 0C5.385 0 0 5.385 0 12s5.385 12 12 12 12-5.385 12-12S18.615 0 12 0"/>
            </svg>
          </a>
          <a
            href="https://www.wattpad.com/user/Qingxiya52"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full border border-indigo-900/50 bg-[#0E1026]/70 hover:bg-[#FF6122]/20 hover:border-[#FF6122]/50 text-slate-400 hover:text-[#ff7843] transition-all cursor-pointer shadow-md group"
            title="Niên Thời trên Wattpad (https://www.wattpad.com/user/Qingxiya52)"
            aria-label="Wattpad"
          >
            <svg role="img" viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current transition-transform duration-200 group-hover:scale-110" xmlns="http://www.w3.org/2000/svg">
              <title>Wattpad</title>
              <path d="M13.034 3.09c-1.695.113-3.9 2.027-6.9 6.947.245-2.758.345-4.716-.857-5.743-.823-.702-2.764-.974-3.926.536C.18 6.349-.09 9.312.024 12.432c.238 6.518 2.544 8.487 4.59 8.487h.001c3.623 0 4.13-4.439 6.604-8.4-.09 1.416-.008 2.668.266 3.532 1.078 3.398 4.784 3.663 6.467.21 2.374-4.87 3.058-6.016 5.453-9.521 1.58-2.314-.252-3.812-2.374-2.735-1.09.554-2.86 1.935-5.065 4.867.387-2.23.28-5.996-2.932-5.782z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};
