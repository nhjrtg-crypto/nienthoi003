import React from 'react';
import { motion } from 'motion/react';

interface CherryBlossomTreeProps {
  className?: string;
}

export const CherryBlossomTree: React.FC<CherryBlossomTreeProps> = ({
  className = 'w-full h-full',
}) => {
  return (
    <div className={`pointer-events-none select-none overflow-hidden ${className}`}>
      <svg viewBox="0 0 300 355" className="w-full h-full" fill="none" preserveAspectRatio="xMidYMax meet">
        <defs>
          <linearGradient id="sakuraTrunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3F1D0B" />
            <stop offset="35%" stopColor="#6E3314" />
            <stop offset="70%" stopColor="#8A4318" />
            <stop offset="100%" stopColor="#4A200C" />
          </linearGradient>

          <linearGradient id="sakuraBranchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5C280E" />
            <stop offset="50%" stopColor="#7E3A15" />
            <stop offset="100%" stopColor="#9C4C1D" />
          </linearGradient>

          <radialGradient id="sakuraCloudDeep" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FCE7F3" stopOpacity="0.95" />
            <stop offset="65%" stopColor="#FBCFE8" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#F9A8D4" stopOpacity="0.4" />
          </radialGradient>

          <radialGradient id="sakuraCloudSoft" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
            <stop offset="40%" stopColor="#FFF1F2" stopOpacity="0.92" />
            <stop offset="80%" stopColor="#FCE7F3" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FBCFE8" stopOpacity="0.3" />
          </radialGradient>

          <radialGradient id="sakuraCloudHighlight" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="60%" stopColor="#FFF5F7" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FDF2F8" stopOpacity="0.65" />
          </radialGradient>

          <g id="sakuraSingleFlower">
            <path d="M0 0 C-1.8 -3.5 -3.5 -6.5 0 -7.5 C3.5 -6.5 1.8 -3.5 0 0" fill="#FFFFFF" stroke="#FBCFE8" strokeWidth="0.4" />
            <path d="M0 0 C-1.8 -3.5 -3.5 -6.5 0 -7.5 C3.5 -6.5 1.8 -3.5 0 0" fill="#FFFFFF" stroke="#FBCFE8" strokeWidth="0.4" transform="rotate(72)" />
            <path d="M0 0 C-1.8 -3.5 -3.5 -6.5 0 -7.5 C3.5 -6.5 1.8 -3.5 0 0" fill="#FFFFFF" stroke="#FBCFE8" strokeWidth="0.4" transform="rotate(144)" />
            <path d="M0 0 C-1.8 -3.5 -3.5 -6.5 0 -7.5 C3.5 -6.5 1.8 -3.5 0 0" fill="#FFFFFF" stroke="#FBCFE8" strokeWidth="0.4" transform="rotate(216)" />
            <path d="M0 0 C-1.8 -3.5 -3.5 -6.5 0 -7.5 C3.5 -6.5 1.8 -3.5 0 0" fill="#FFFFFF" stroke="#FBCFE8" strokeWidth="0.4" transform="rotate(288)" />
            <circle cx="0" cy="0" r="1.3" fill="#FCE7F3" />
            <circle cx="0" cy="0" r="0.65" fill="#FDE047" />
          </g>
        </defs>

        <g transform="translate(26, 88) scale(0.85, 0.74)">
          <ellipse cx="220" cy="346" rx="38" ry="6" fill="#2E5528" fillOpacity="0.4" />

          <ellipse cx="185" cy="344" rx="3.5" ry="1.6" fill="#FBCFE8" transform="rotate(-15 185 344)" />
          <ellipse cx="196" cy="347" rx="3.8" ry="1.9" fill="#FFF1F2" transform="rotate(25 196 347)" />
          <ellipse cx="206" cy="349" rx="3.2" ry="1.5" fill="#FCE7F3" transform="rotate(-35 206 349)" />
          <ellipse cx="236" cy="347" rx="4" ry="1.8" fill="#FBCFE8" transform="rotate(12 236 347)" />
          <ellipse cx="248" cy="345" rx="3.5" ry="1.7" fill="#FFF1F2" transform="rotate(-20 248 345)" />
          <ellipse cx="258" cy="348" rx="2.8" ry="1.4" fill="#FCE7F3" transform="rotate(45 258 348)" />
          <ellipse cx="222" cy="351" rx="3.6" ry="1.8" fill="#FFFFFF" transform="rotate(-8 222 351)" />

          <path d="M212 344 C200 345 188 348 178 350 C192 347 206 344 214 340 Z" fill="#3F1D0B" />
          <path d="M228 344 C238 345 252 347 264 350 C252 346 239 344 227 340 Z" fill="#4A200C" />

          <path
            d="M224 182 C204 172 165 158 138 148 C112 136 86 124 62 115 L66 110 C92 118 118 128 144 140 C168 150 196 162 222 170 Z"
            fill="url(#sakuraBranchGrad)"
          />
          <path d="M138 148 C124 132 110 114 95 92 L99 88 C114 108 128 124 144 140 Z" fill="url(#sakuraBranchGrad)" />
          <path d="M110 134 C94 144 75 152 56 158 L54 154 C72 148 90 140 106 130 Z" fill="url(#sakuraBranchGrad)" />
          <path
            d="M212 166 C232 153 251 134 276 110 L281 115 C256 139 237 158 219 174 Z"
            fill="url(#sakuraBranchGrad)"
          />

          <path
            d="M208 344 C210 300 213 256 215 215 C217 182 214 156 208 132 C203 112 198 94 192 72 C188 56 182 42 176 30 L182 28 C190 40 196 56 202 74 C208 96 214 116 219 135 C225 158 228 184 226 215 C224 256 226 300 232 344 Z"
            fill="url(#sakuraTrunkGrad)"
          />

          <g filter="drop-shadow(0 2px 4px rgba(244, 114, 182, 0.12))">
            <circle cx="55" cy="118" r="28" fill="url(#sakuraCloudDeep)" />
            <circle cx="95" cy="85" r="32" fill="url(#sakuraCloudDeep)" />
            <circle cx="138" cy="48" r="34" fill="url(#sakuraCloudDeep)" />
            <circle cx="178" cy="42" r="36" fill="url(#sakuraCloudDeep)" />
            <circle cx="225" cy="52" r="34" fill="url(#sakuraCloudDeep)" />
            <circle cx="268" cy="95" r="32" fill="url(#sakuraCloudDeep)" />
            <circle cx="282" cy="142" r="24" fill="url(#sakuraCloudDeep)" />
            <circle cx="82" cy="155" r="24" fill="url(#sakuraCloudDeep)" />
          </g>

          <g>
            <circle cx="42" cy="105" r="24" fill="url(#sakuraCloudSoft)" />
            <circle cx="68" cy="125" r="22" fill="url(#sakuraCloudSoft)" />
            <circle cx="35" cy="120" r="18" fill="url(#sakuraCloudSoft)" />
            <circle cx="80" cy="80" r="26" fill="url(#sakuraCloudSoft)" />
            <circle cx="108" cy="98" r="28" fill="url(#sakuraCloudSoft)" />
            <circle cx="115" cy="130" r="24" fill="url(#sakuraCloudSoft)" />
            <circle cx="125" cy="45" r="28" fill="url(#sakuraCloudSoft)" />
            <circle cx="155" cy="35" r="32" fill="url(#sakuraCloudSoft)" />
            <circle cx="190" cy="38" r="30" fill="url(#sakuraCloudSoft)" />
            <circle cx="165" cy="65" r="30" fill="url(#sakuraCloudSoft)" />
            <circle cx="215" cy="45" r="28" fill="url(#sakuraCloudSoft)" />
            <circle cx="245" cy="65" r="28" fill="url(#sakuraCloudSoft)" />
            <circle cx="220" cy="85" r="32" fill="url(#sakuraCloudSoft)" />
            <circle cx="262" cy="115" r="26" fill="url(#sakuraCloudSoft)" />
            <circle cx="285" cy="118" r="20" fill="url(#sakuraCloudSoft)" />
            <circle cx="270" cy="150" r="22" fill="url(#sakuraCloudSoft)" />
          </g>

          <g>
            <circle cx="50" cy="98" r="16" fill="url(#sakuraCloudHighlight)" />
            <circle cx="90" cy="72" r="18" fill="url(#sakuraCloudHighlight)" />
            <circle cx="140" cy="32" r="20" fill="url(#sakuraCloudHighlight)" />
            <circle cx="175" cy="28" r="22" fill="url(#sakuraCloudHighlight)" />
            <circle cx="205" cy="35" r="19" fill="url(#sakuraCloudHighlight)" />
            <circle cx="235" cy="55" r="18" fill="url(#sakuraCloudHighlight)" />
            <circle cx="258" cy="85" r="17" fill="url(#sakuraCloudHighlight)" />
            <circle cx="102" cy="115" r="16" fill="url(#sakuraCloudHighlight)" />
            <circle cx="250" cy="132" r="15" fill="url(#sakuraCloudHighlight)" />
          </g>

          <use href="#sakuraSingleFlower" x="35" y="100" transform="scale(1.15)" />
          <use href="#sakuraSingleFlower" x="58" y="85" transform="scale(0.95)" />
          <use href="#sakuraSingleFlower" x="78" y="115" transform="scale(1.2)" />
          <use href="#sakuraSingleFlower" x="98" y="68" transform="scale(1.05)" />
          <use href="#sakuraSingleFlower" x="122" y="90" transform="scale(1.25)" />
          <use href="#sakuraSingleFlower" x="135" y="38" transform="scale(1.1)" />
          <use href="#sakuraSingleFlower" x="160" y="25" transform="scale(1.3)" />
          <use href="#sakuraSingleFlower" x="182" y="55" transform="scale(1.15)" />
          <use href="#sakuraSingleFlower" x="208" y="28" transform="scale(1.2)" />
          <use href="#sakuraSingleFlower" x="228" y="70" transform="scale(1.3)" />
          <use href="#sakuraSingleFlower" x="252" y="52" transform="scale(1.05)" />
          <use href="#sakuraSingleFlower" x="272" y="105" transform="scale(1.15)" />
          <use href="#sakuraSingleFlower" x="282" y="138" transform="scale(0.95)" />
          <use href="#sakuraSingleFlower" x="245" y="145" transform="scale(1.1)" />
          <use href="#sakuraSingleFlower" x="65" y="148" transform="scale(1.05)" />
          <use href="#sakuraSingleFlower" x="110" y="142" transform="scale(1.15)" />
        </g>
      </svg>

      {[
        { startX: '65%', startY: '28%', delay: 0, duration: 6.2, size: 9 },
        { startX: '45%', startY: '38%', delay: 1.6, duration: 5.6, size: 8 },
        { startX: '78%', startY: '42%', delay: 3.2, duration: 6.8, size: 8.5 },
        { startX: '32%', startY: '32%', delay: 4.5, duration: 5.9, size: 7.5 },
        { startX: '55%', startY: '48%', delay: 2.3, duration: 6.4, size: 8 },
        { startX: '85%', startY: '52%', delay: 0.8, duration: 7.1, size: 7 },
      ].map((petal, pIdx) => (
        <motion.div
          key={pIdx}
          animate={{
            x: [0, -25, -60, -95],
            y: [0, 45, 95, 150],
            rotate: [0, 75, 170, 290],
            opacity: [0, 0.95, 0.9, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: petal.duration,
            delay: petal.delay,
            ease: 'easeInOut',
          }}
          className="absolute pointer-events-none drop-shadow-xs"
          style={{
            left: petal.startX,
            top: petal.startY,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
          }}
        >
          <svg viewBox="0 0 10 10" className="w-full h-full">
            <path
              d="M5 0 C2.8 0 0.8 2.2 1.8 5 C2.8 7.8 5 10 5 10 C5 10 7.2 7.8 8.2 5 C9.2 2.2 7.2 0 5 0 Z"
              fill="#FBCFE8"
              stroke="#F472B6"
              strokeWidth="0.5"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};
