import React, { useEffect, useRef } from 'react';
import { NovelThemeId } from '../utils/themeStyles';
import { DarkBackgroundOption } from '../types';

interface Star {
  x: number;
  y: number;
  size: number;
  layer: 1 | 2 | 3;
  color: string;
  baseAlpha: number;
  twinklePhase: number;
  twinkleSpeed: number;
  hasCrossFlare: boolean;
}

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  thickness: number;
  angle: number;
  alpha: number;
  active: boolean;
}

export interface CosmicStarsBackgroundProps {
  theme?: NovelThemeId;
  isDarkMode?: boolean;
  darkBgOption?: DarkBackgroundOption;
  bgSeed?: number;
  purpleBgEffectsEnabled?: boolean;
}

const CosmicStarsBackgroundComponent: React.FC<CosmicStarsBackgroundProps> = ({
  theme = 'cosmic',
  isDarkMode = true,
  darkBgOption = 'clay-spheres',
  bgSeed = 42,
  purpleBgEffectsEnabled = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  const isDarkModeRef = useRef(isDarkMode);
  isDarkModeRef.current = isDarkMode;

  const themeRef = useRef(theme);
  themeRef.current = theme;

  const darkBgOptionRef = useRef(darkBgOption);
  darkBgOptionRef.current = darkBgOption;

  const bgSeedRef = useRef(bgSeed);
  bgSeedRef.current = bgSeed;

  const purpleBgEffectsEnabledRef = useRef(purpleBgEffectsEnabled);
  purpleBgEffectsEnabledRef.current = purpleBgEffectsEnabled;

  const isCosmic = theme === 'cosmic' || (theme === 'amethyst-haze' && isDarkMode);

  const renderRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = Math.max(1, window.innerWidth || canvas.clientWidth || 300);
    let height = Math.max(1, window.innerHeight || canvas.clientHeight || 300);

    // High-DPI support
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const setupCanvas = () => {
      if (!canvas || !ctx) return;
      const w = Math.max(1, window.innerWidth || canvas.clientWidth || 300);
      const h = Math.max(1, window.innerHeight || canvas.clientHeight || 300);
      width = w;
      height = h;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    setupCanvas();

    const handleResize = () => {
      if (!canvas) return;
      setupCanvas();
      renderRef.current?.();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const safeW = width > 0 ? width : Math.max(1, window.innerWidth || 1);
      const safeH = height > 0 ? height : Math.max(1, window.innerHeight || 1);
      const tx = (e.clientX / safeW - 0.5) * 2;
      const ty = (e.clientY / safeH - 0.5) * 2;
      mousePos.current.targetX = Number.isFinite(tx) ? Math.max(-2, Math.min(2, tx)) : 0;
      mousePos.current.targetY = Number.isFinite(ty) ? Math.max(-2, Math.min(2, ty)) : 0;
      const isCosmicActive = themeRef.current === 'cosmic' || (themeRef.current === 'amethyst-haze' && isDarkModeRef.current);
      if (!isCosmicActive) {
        renderRef.current?.();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Cosmic palette for star glows (used in Cosmic theme / Purple Dark mode)
    const starColors = [
      '#FFFFFF', // Diamond White
      '#F8FAFC', // Bright Starlight
      '#E0E7FF', // Indigo Starlight
      '#DDD6FE', // Soft Purple Starlight
      '#FBCFE8', // Rose Pink Starlight
      '#BAE6FD', // Celestial Cyan Starlight
    ];

    // Generate ~32 well-dispersed, elegant stars (active for Cosmic theme / Purple Dark mode)
    const starCount = 32;
    const stars: Star[] = Array.from({ length: starCount }, (_, i) => {
      const rand = Math.random();
      let layer: 1 | 2 | 3 = 1;
      let size = 0.75 + Math.random() * 0.5;
      let hasCrossFlare = false;

      // Only 2 or 3 stars get the hero 4-point flare
      if (i < 2 || rand > 0.94) {
        layer = 3;
        size = 1.8 + Math.random() * 0.5;
        hasCrossFlare = true;
      } else if (rand > 0.75) {
        layer = 2;
        size = 1.1 + Math.random() * 0.4;
      }

      const cols = 8;
      const rows = 4;
      const col = i % cols;
      const row = Math.floor(i / cols) % rows;
      const gridX = (col / cols) * width + (Math.random() * 0.7 + 0.15) * (width / cols);
      const gridY = (row / rows) * height + (Math.random() * 0.7 + 0.15) * (height / rows);

      return {
        x: Math.min(width - 10, Math.max(10, gridX)),
        y: Math.min(height - 10, Math.max(10, gridY)),
        size,
        layer,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        baseAlpha: layer === 3 ? 0.85 : layer === 2 ? 0.55 : 0.35,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.012 + Math.random() * 0.02,
        hasCrossFlare,
      };
    });

    // Shooting stars pool (active for Cosmic theme / Purple Dark mode - moderate speed, 1-2 concurrent meteors)
    const meteors: Meteor[] = [];
    const activeMeteorTimers: NodeJS.Timeout[] = [];

    const spawnMeteor = (startX?: number, startY?: number) => {
      if (meteors.length >= 2) return;
      const x = startX !== undefined ? startX : Math.random() * width * 0.75 + width * 0.05;
      const y = startY !== undefined ? startY : Math.random() * (height * 0.30) + 10;
      meteors.push({
        x,
        y,
        length: 90 + Math.random() * 55,
        speed: 3.8 + Math.random() * 1.8, // Tốc độ vừa phải, mượt mà và êm dịu (khoảng 3.8 - 5.6 px/frame)
        thickness: 1.3 + Math.random() * 0.7,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.16,
        alpha: 1.0,
        active: true,
      });
    };

    // Hàm kích hoạt đợt sao băng: xuất hiện từ 1 đến 2 dải sao cùng lúc
    const triggerMeteorWave = () => {
      const isCosmicActive = themeRef.current === 'cosmic' || (themeRef.current === 'amethyst-haze' && isDarkModeRef.current);
      if (!isCosmicActive) return;
      if (themeRef.current === 'amethyst-haze' && !purpleBgEffectsEnabledRef.current) return;
      if (meteors.length >= 2) return;

      // Xác suất xuất hiện 1 hoặc 2 dải sao cùng lúc
      const count = Math.random() < 0.55 ? 2 : 1;

      if (count === 1) {
        if (meteors.length < 2) {
          spawnMeteor();
        }
      } else {
        // Xuất hiện 2 dải sao cùng lúc ở 2 vị trí khác nhau để ngắm trọn vẹn cả 2 vệt
        if (meteors.length === 0) {
          const x1 = Math.random() * width * 0.35 + width * 0.05;
          const y1 = Math.random() * (height * 0.22) + 10;
          spawnMeteor(x1, y1);

          const timer = setTimeout(() => {
            const stillActive = themeRef.current === 'cosmic' || (themeRef.current === 'amethyst-haze' && isDarkModeRef.current);
            if (stillActive && meteors.length < 2) {
              const x2 = Math.random() * width * 0.40 + width * 0.45;
              const y2 = Math.random() * (height * 0.28) + 15;
              spawnMeteor(x2, y2);
            }
          }, 180 + Math.random() * 220);
          activeMeteorTimers.push(timer);
        } else if (meteors.length === 1) {
          spawnMeteor();
        }
      }
    };

    // Tần suất xuất hiện sao băng đều đặn & nhịp nhàng (mỗi ~3.8s)
    let meteorInterval: NodeJS.Timeout | null = setInterval(() => {
      triggerMeteorWave();
    }, 3800);

    const initialMeteorTimer = setTimeout(() => {
      triggerMeteorWave();
    }, 800);

    // Cosmic theme luminous atmospheric nebulae (Violet, Magenta, Celestial Cyan)
    const cosmicPalette = {
      c1_0: 'rgba(139, 92, 246, 0.24)',
      c1_mid: 'rgba(126, 34, 206, 0.12)',
      c2_0: 'rgba(236, 72, 153, 0.20)',
      c2_mid: 'rgba(219, 39, 119, 0.09)',
      c3_0: 'rgba(56, 189, 248, 0.16)',
      c3_mid: 'rgba(14, 165, 233, 0.06)',
    };

    // Pseudo-random number generator for stable randomized sphere layouts
    function mulberry32(seed: number) {
      let a = (seed + 12345) | 0;
      return function () {
        let t = (a += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    interface ClaySpherePalette {
      highlight: string;
      bodyLight: string;
      bodyMid: string;
      shadow: string;
      dropShadow: string;
      bounceLight: string;
    }

    interface VividOrbColor {
      top: string;
      mid: string;
      dark: string;
      glow: string;
    }

    // Configuration for poster-inspired glassmorphism & crisp spheres background options
    interface ThemeBackgroundPalette {
      glowA: string;      // Vibrant primary glow
      glowB: string;      // Complementary secondary glow
      glowC: string;      // Atmospheric backdrop tint
      discHighlight: string;
      discGlow: string;
      rimRing: string;
      innerRim: string;
      overlayGrad: [string, string, string];
      // 3D Clay Spheres (Ảnh 1: Michal Malewicz Superbank)
      clay: ClaySpherePalette;
      // Vivid Glassmorphism Orbs (Ảnh 2: Skyline Motions Glassmorphism)
      vividOrbs: VividOrbColor[];
      // Legacy compatibility
      sphereTop: string;
      sphereMid: string;
      sphereDark: string;
      sphereRim: string;
      sphereGlint: string;
      sphereRing: string;
    }

    const getThemeBgPalette = (t: NovelThemeId): ThemeBackgroundPalette => {
      switch (t) {
        case 'amethyst-haze':
          return {
            glowA: 'rgba(168, 85, 247, 0.38)',
            glowB: 'rgba(147, 51, 234, 0.26)',
            glowC: 'rgba(99, 102, 241, 0.16)',
            discHighlight: 'rgba(250, 245, 255, 0.75)',
            discGlow: 'rgba(192, 132, 252, 0.50)',
            rimRing: 'rgba(216, 180, 254, 0.40)',
            innerRim: 'rgba(216, 180, 254, 0.18)',
            overlayGrad: ['rgba(14, 10, 27, 0.82)', 'rgba(26, 18, 46, 0.45)', 'rgba(14, 10, 27, 0.90)'],
            clay: {
              highlight: 'rgba(250, 245, 255, 0.80)',
              bodyLight: 'rgba(216, 180, 254, 0.68)',
              bodyMid: 'rgba(168, 85, 247, 0.52)',
              shadow: 'rgba(88, 28, 135, 0.60)',
              dropShadow: 'rgba(24, 9, 44, 0.45)',
              bounceLight: 'rgba(216, 180, 254, 0.28)',
            },
            vividOrbs: [
              { top: '#FDF4FF', mid: '#D946EF', dark: '#86198F', glow: '#C026D3' }, // Tím Neon
              { top: '#FFF7ED', mid: '#F97316', dark: '#C2410C', glow: '#EA580C' }, // Cam Hoàng Hôn
              { top: '#EFF6FF', mid: '#3B82F6', dark: '#1D4ED8', glow: '#2563EB' }, // Xanh Cobalt Điện
              { top: '#FFF1F2', mid: '#F43F5E', dark: '#BE123C', glow: '#E11D48' }, // Hồng Sen Sáng
              { top: '#FEFCE8', mid: '#EAB308', dark: '#A16207', glow: '#CA8A04' }, // Vàng Mật Hổ Phách
            ],
            sphereTop: '#F3E8FF',
            sphereMid: '#7E22CE',
            sphereDark: '#1E0B36',
            sphereRim: 'rgba(216, 180, 254, 0.88)',
            sphereGlint: '#FAF5FF',
            sphereRing: 'rgba(192, 132, 252, 0.75)',
          };
        case 'slate-haze':
          return {
            glowA: 'rgba(56, 189, 248, 0.36)',
            glowB: 'rgba(37, 99, 235, 0.22)',
            glowC: 'rgba(14, 165, 233, 0.14)',
            discHighlight: 'rgba(241, 245, 249, 0.75)',
            discGlow: 'rgba(125, 211, 252, 0.50)',
            rimRing: 'rgba(186, 230, 253, 0.38)',
            innerRim: 'rgba(186, 230, 253, 0.16)',
            overlayGrad: ['rgba(9, 14, 22, 0.82)', 'rgba(16, 27, 39, 0.45)', 'rgba(9, 14, 22, 0.90)'],
            clay: {
              highlight: 'rgba(240, 249, 255, 0.80)',
              bodyLight: 'rgba(186, 230, 253, 0.68)',
              bodyMid: 'rgba(56, 189, 248, 0.52)',
              shadow: 'rgba(3, 105, 161, 0.60)',
              dropShadow: 'rgba(6, 19, 36, 0.45)',
              bounceLight: 'rgba(186, 230, 253, 0.28)',
            },
            vividOrbs: [
              { top: '#ECFEFF', mid: '#06B6D4', dark: '#0E7490', glow: '#0891B2' }, // Cyan Điện Tử
              { top: '#EFF6FF', mid: '#2563EB', dark: '#1E40AF', glow: '#1D4ED8' }, // Xanh Biển Sâu
              { top: '#F5F3FF', mid: '#8B5CF6', dark: '#6D28D9', glow: '#7C3AED' }, // Tím Thạch Anh
              { top: '#ECFDF5', mid: '#10B981', dark: '#047857', glow: '#059669' }, // Bạc Hà Sáng
              { top: '#FFF7ED', mid: '#FB923C', dark: '#C2410C', glow: '#EA580C' }, // Cam San Hô
            ],
            sphereTop: '#E0F2FE',
            sphereMid: '#0284C7',
            sphereDark: '#08162A',
            sphereRim: 'rgba(186, 230, 253, 0.88)',
            sphereGlint: '#F0F9FF',
            sphereRing: 'rgba(125, 211, 252, 0.75)',
          };
        case 'sage':
          return {
            glowA: 'rgba(46, 74, 52, 0.12)',
            glowB: 'rgba(34, 56, 40, 0.08)',
            glowC: 'rgba(25, 42, 30, 0.05)',
            discHighlight: 'rgba(202, 216, 198, 0.30)',
            discGlow: 'rgba(152, 184, 148, 0.18)',
            rimRing: 'rgba(152, 184, 148, 0.15)',
            innerRim: 'rgba(152, 184, 148, 0.08)',
            overlayGrad: ['rgba(12, 18, 13, 0.88)', 'rgba(18, 28, 20, 0.55)', 'rgba(12, 18, 13, 0.94)'],
            clay: {
              highlight: 'rgba(202, 216, 198, 0.35)',
              bodyLight: 'rgba(152, 184, 148, 0.28)',
              bodyMid: 'rgba(90, 118, 88, 0.22)',
              shadow: 'rgba(30, 48, 32, 0.35)',
              dropShadow: 'rgba(0, 0, 0, 0.35)',
              bounceLight: 'rgba(152, 184, 148, 0.12)',
            },
            vividOrbs: [
              { top: '#A3B89F', mid: '#4D6B49', dark: '#223824', glow: '#3B5438' }, // Thảo Mộc Dịu
              { top: '#C2D1BE', mid: '#5A7556', dark: '#283D29', glow: '#415B3E' }, // Xanh Rêu Nhạt
              { top: '#9EB3A6', mid: '#476357', dark: '#1F332B', glow: '#354E43' }, // Xanh Trầm Dịu Mắt
              { top: '#B8C2B0', mid: '#566650', dark: '#242E21', glow: '#3E4D39' }, // Lá Ô Liu Dịu
              { top: '#8FABA0', mid: '#3D594F', dark: '#1B2E27', glow: '#2C443C' }, // Rừng Sâu Dịu
            ],
            sphereTop: '#C2D1BE',
            sphereMid: '#466244',
            sphereDark: '#132015',
            sphereRim: 'rgba(152, 184, 148, 0.40)',
            sphereGlint: '#E2EBE0',
            sphereRing: 'rgba(152, 184, 148, 0.25)',
          };
        case 'mocha':
          return {
            glowA: 'rgba(100, 70, 52, 0.12)',
            glowB: 'rgba(75, 52, 38, 0.08)',
            glowC: 'rgba(50, 34, 25, 0.05)',
            discHighlight: 'rgba(222, 201, 188, 0.30)',
            discGlow: 'rgba(180, 150, 130, 0.18)',
            rimRing: 'rgba(180, 150, 130, 0.15)',
            innerRim: 'rgba(180, 150, 130, 0.08)',
            overlayGrad: ['rgba(16, 11, 8, 0.88)', 'rgba(26, 18, 14, 0.55)', 'rgba(16, 11, 8, 0.94)'],
            clay: {
              highlight: 'rgba(222, 201, 188, 0.35)',
              bodyLight: 'rgba(196, 164, 138, 0.28)',
              bodyMid: 'rgba(142, 110, 88, 0.22)',
              shadow: 'rgba(48, 30, 20, 0.35)',
              dropShadow: 'rgba(0, 0, 0, 0.35)',
              bounceLight: 'rgba(196, 164, 138, 0.12)',
            },
            vividOrbs: [
              { top: '#DEC9BC', mid: '#7D5C47', dark: '#332016', glow: '#5C3F2E' }, // Gỗ Mộc Dịu
              { top: '#CBB2A3', mid: '#6E4E3C', dark: '#2C1B12', glow: '#523728' }, // Đất Ấm Mờ
              { top: '#BAA294', mid: '#614332', dark: '#25160E', glow: '#462E20' }, // Nâu Cà Phê Dịu
              { top: '#D4C0B4', mid: '#735441', dark: '#2E1E15', glow: '#553B2B' }, // Vải Linen Trầm
              { top: '#B39A8B', mid: '#5A3E2F', dark: '#22140D', glow: '#422B1E' }, // Hạt Dẻ Dịu
            ],
            sphereTop: '#DEC9BC',
            sphereMid: '#6E4E3C',
            sphereDark: '#180F0A',
            sphereRim: 'rgba(196, 164, 138, 0.40)',
            sphereGlint: '#F0E5DE',
            sphereRing: 'rgba(196, 164, 138, 0.25)',
          };
        case 'notebook':
        default:
          return {
            glowA: 'rgba(255, 255, 255, 0.08)',
            glowB: 'rgba(247, 244, 238, 0.05)',
            glowC: 'rgba(217, 212, 201, 0.04)',
            discHighlight: 'rgba(255, 255, 255, 0.5)',
            discGlow: 'rgba(247, 244, 238, 0.25)',
            rimRing: 'rgba(255, 255, 255, 0.2)',
            innerRim: 'rgba(255, 255, 255, 0.08)',
            overlayGrad: ['rgba(20, 18, 16, 0.82)', 'rgba(36, 32, 28, 0.45)', 'rgba(20, 18, 16, 0.90)'],
            clay: {
              highlight: 'rgba(255, 255, 255, 0.75)',
              bodyLight: 'rgba(229, 231, 235, 0.62)',
              bodyMid: 'rgba(156, 163, 175, 0.48)',
              shadow: 'rgba(55, 65, 81, 0.55)',
              dropShadow: 'rgba(0, 0, 0, 0.40)',
              bounceLight: 'rgba(229, 231, 235, 0.24)',
            },
            vividOrbs: [
              { top: '#F9FAFB', mid: '#9CA3AF', dark: '#4B5563', glow: '#6B7280' },
              { top: '#FFFFFF', mid: '#D1D5DB', dark: '#6B7280', glow: '#9CA3AF' },
              { top: '#F3F4F6', mid: '#9CA3AF', dark: '#374151', glow: '#4B5563' },
              { top: '#FFFFFF', mid: '#E5E7EB', dark: '#4B5563', glow: '#6B7280' },
              { top: '#F9FAFB', mid: '#D1D5DB', dark: '#374151', glow: '#9CA3AF' },
            ],
            sphereTop: '#F5F5F4',
            sphereMid: '#78716C',
            sphereDark: '#1C1917',
            sphereRim: 'rgba(231, 229, 228, 0.85)',
            sphereGlint: '#FFFFFF',
            sphereRing: 'rgba(214, 211, 209, 0.75)',
          };
      }
    };

    let startTime = performance.now();

    // Main animation loop
    const render = () => {
      const activeTheme = themeRef.current;
      const activeIsDark = isDarkModeRef.current;
      const activeIsCosmic = activeTheme === 'cosmic' || (activeTheme === 'amethyst-haze' && activeIsDark);
      const activeDarkBgOption = darkBgOptionRef.current;

      if (!activeIsDark && !activeIsCosmic) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      // Safe canvas dimension check: return early if canvas has no size yet
      if (width <= 0 || height <= 0 || !Number.isFinite(width) || !Number.isFinite(height)) {
        if (activeIsCosmic) {
          animationFrameId = requestAnimationFrame(render);
        }
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse parallax interpolation with strict finite safety
      const targetX = Number.isFinite(mousePos.current.targetX) ? mousePos.current.targetX : 0;
      const targetY = Number.isFinite(mousePos.current.targetY) ? mousePos.current.targetY : 0;
      if (!Number.isFinite(mousePos.current.x)) mousePos.current.x = 0;
      if (!Number.isFinite(mousePos.current.y)) mousePos.current.y = 0;

      mousePos.current.x += (targetX - mousePos.current.x) * 0.04;
      mousePos.current.y += (targetY - mousePos.current.y) * 0.04;

      const mx = Number.isFinite(mousePos.current.x) ? Math.max(-2, Math.min(2, mousePos.current.x)) : 0;
      const my = Number.isFinite(mousePos.current.y) ? Math.max(-2, Math.min(2, mousePos.current.y)) : 0;

      if (activeIsCosmic) {
        const isPurpleEffectDisabled =
          (activeTheme === 'amethyst-haze' || activeTheme === 'cosmic') && !purpleBgEffectsEnabledRef.current;

        if (!isPurpleEffectDisabled) {
          // === COSMIC THEME / PURPLE DARK MODE: Luminous Atmospheric Nebulae ===
          // Nebula pool 1 (upper left with subtle drift)
          const p1X = width * 0.22 + mx * 15;
          const p1Y = height * 0.25 + my * 15;
          const r1 = Math.max(180, width * 0.45);
          if (Number.isFinite(p1X) && Number.isFinite(p1Y) && Number.isFinite(r1) && r1 > 20) {
            try {
              const nebula1 = ctx.createRadialGradient(p1X, p1Y, 20, p1X, p1Y, r1);
              nebula1.addColorStop(0, cosmicPalette.c1_0);
              nebula1.addColorStop(0.45, cosmicPalette.c1_mid);
              nebula1.addColorStop(1, 'transparent');
              ctx.fillStyle = nebula1;
              ctx.fillRect(0, 0, width, height);
            } catch {
              // Safe fallback
            }
          }

          // Nebula pool 2 (center right with subtle drift)
          const p2X = width * 0.78 - mx * 20;
          const p2Y = height * 0.55 - my * 20;
          const r2 = Math.max(180, width * 0.42);
          if (Number.isFinite(p2X) && Number.isFinite(p2Y) && Number.isFinite(r2) && r2 > 20) {
            try {
              const nebula2 = ctx.createRadialGradient(p2X, p2Y, 20, p2X, p2Y, r2);
              nebula2.addColorStop(0, cosmicPalette.c2_0);
              nebula2.addColorStop(0.5, cosmicPalette.c2_mid);
              nebula2.addColorStop(1, 'transparent');
              ctx.fillStyle = nebula2;
              ctx.fillRect(0, 0, width, height);
            } catch {
              // Safe fallback
            }
          }

          // Nebula pool 3 (lower center-left with subtle drift)
          const p3X = width * 0.35 + mx * 12;
          const p3Y = height * 0.82 + my * 12;
          const r3 = Math.max(160, width * 0.38);
          if (Number.isFinite(p3X) && Number.isFinite(p3Y) && Number.isFinite(r3) && r3 > 20) {
            try {
              const nebula3 = ctx.createRadialGradient(p3X, p3Y, 20, p3X, p3Y, r3);
              nebula3.addColorStop(0, cosmicPalette.c3_0);
              nebula3.addColorStop(0.5, cosmicPalette.c3_mid);
              nebula3.addColorStop(1, 'transparent');
              ctx.fillStyle = nebula3;
              ctx.fillRect(0, 0, width, height);
            } catch {
              // Safe fallback
            }
          }

          // Render Twinkling Stars
          stars.forEach((star) => {
            star.twinklePhase += star.twinkleSpeed;
            const currentAlpha = Math.max(
              0.1,
              Math.min(1, star.baseAlpha + Math.sin(star.twinklePhase) * (star.baseAlpha * 0.45))
            );

            // Parallax shift based on layer depth
            const parallaxX = mx * (star.layer * 10);
            const parallaxY = my * (star.layer * 10);

            // Strictly safe modulo wrapping
            const drawX = (((star.x + parallaxX) % width) + width) % width;
            const drawY = (((star.y + parallaxY) % height) + height) % height;

            if (!Number.isFinite(drawX) || !Number.isFinite(drawY)) return;

            ctx.save();
            ctx.globalAlpha = currentAlpha;
            ctx.fillStyle = star.color;

            const starSize = Number.isFinite(star.size) && star.size > 0 ? star.size : 1;

            if (star.hasCrossFlare && star.layer === 3) {
              // Extra luminous radial glow halo
              const haloR = Math.max(0.1, starSize * 3.8);
              if (Number.isFinite(haloR) && haloR > 0) {
                try {
                  const halo = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, haloR);
                  halo.addColorStop(0, star.color);
                  halo.addColorStop(0.3, 'rgba(216, 180, 254, 0.45)');
                  halo.addColorStop(1, 'transparent');
                  ctx.fillStyle = halo;
                  ctx.beginPath();
                  ctx.arc(drawX, drawY, haloR, 0, Math.PI * 2);
                  ctx.fill();
                } catch {
                  // Safe fallback
                }
              }

              // 4-point cross-diffraction spikes (+)
              const spikeR = Math.max(0.1, starSize * 3.0);
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
              ctx.lineWidth = 0.6;
              ctx.beginPath();
              // Horizontal line
              ctx.moveTo(drawX - spikeR, drawY);
              ctx.lineTo(drawX + spikeR, drawY);
              // Vertical line
              ctx.moveTo(drawX, drawY - spikeR);
              ctx.lineTo(drawX, drawY + spikeR);
              ctx.stroke();

              // Star core dot
              ctx.fillStyle = '#FFFFFF';
              ctx.beginPath();
              ctx.arc(drawX, drawY, Math.max(0.1, starSize * 0.8), 0, Math.PI * 2);
              ctx.fill();
            } else {
              // Subtle soft edge for normal stars
              ctx.beginPath();
              ctx.arc(drawX, drawY, Math.max(0.1, starSize), 0, Math.PI * 2);
              ctx.fill();
            }

            ctx.restore();
          });

          // Render Shooting Stars / Meteors
          for (let i = meteors.length - 1; i >= 0; i--) {
            const m = meteors[i];
            if (!m.active) {
              meteors.splice(i, 1);
              continue;
            }

            m.x += Math.cos(m.angle) * m.speed;
            m.y += Math.sin(m.angle) * m.speed;
            m.alpha -= 0.007;

            if (m.alpha <= 0 || m.x > width + 100 || m.y > height + 100) {
              m.active = false;
              meteors.splice(i, 1);
              continue;
            }

            const tailX = m.x - Math.cos(m.angle) * m.length;
            const tailY = m.y - Math.sin(m.angle) * m.length;

            if (!Number.isFinite(tailX) || !Number.isFinite(tailY) || !Number.isFinite(m.x) || !Number.isFinite(m.y)) {
              continue;
            }

            ctx.save();
            ctx.globalAlpha = Math.max(0, m.alpha);

            try {
              const meteorGrad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
              meteorGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
              meteorGrad.addColorStop(0.6, 'rgba(216, 180, 254, 0.45)');
              meteorGrad.addColorStop(1, 'rgba(255, 255, 255, 0.95)');

              ctx.strokeStyle = meteorGrad;
              ctx.lineWidth = Math.max(0.5, m.thickness || 1);
              ctx.lineCap = 'round';
              ctx.beginPath();
              ctx.moveTo(tailX, tailY);
              ctx.lineTo(m.x, m.y);
              ctx.stroke();

              // Meteor glowing head
              ctx.fillStyle = '#FFFFFF';
              ctx.shadowColor = '#E879F9';
              ctx.shadowBlur = 10;
              ctx.beginPath();
              ctx.arc(m.x, m.y, Math.max(0.5, (m.thickness || 1) * 1.4), 0, Math.PI * 2);
              ctx.fill();
            } catch {
              // Safe fallback
            }

            ctx.restore();
          }
        }
      }

      if (activeIsCosmic) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    renderRef.current = render;
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (meteorInterval) clearInterval(meteorInterval);
      clearTimeout(initialMeteorTimer);
      activeMeteorTimers.forEach((t) => clearTimeout(t));
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    renderRef.current?.();
  }, [theme, isDarkMode, darkBgOption, bgSeed, purpleBgEffectsEnabled]);

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-opacity duration-300 ${
        isDarkMode || isCosmic ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden' }}
      aria-hidden="true"
    >
      {/* Dynamic Ambient Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
};

export const CosmicStarsBackground = React.memo(CosmicStarsBackgroundComponent);
