import React, { useEffect, useRef, useState } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  layer: number; // 1, 2, 3 for parallax
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  thickness: number;
  active: boolean;
}

interface CosmicBackgroundProps {
  interactive?: boolean;
}

export const CosmicBackground: React.FC<CosmicBackgroundProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePos = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });
  const [isHoveringMoon, setIsHoveringMoon] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = Math.max(1, window.innerWidth || 300);
    let height = Math.max(1, window.innerHeight || 300);

    const setupCanvas = () => {
      if (!canvas || !ctx) return;
      width = Math.max(1, window.innerWidth || canvas.clientWidth || 300);
      height = Math.max(1, window.innerHeight || canvas.clientHeight || 300);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    setupCanvas();

    const handleResize = () => {
      if (!canvas || !ctx) return;
      setupCanvas();
      initStars();
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const safeW = Math.max(1, window.innerWidth || 1);
      const safeH = Math.max(1, window.innerHeight || 1);
      const normX = (e.clientX / safeW - 0.5) * 2;
      const normY = (e.clientY / safeH - 0.5) * 2;
      mousePos.current.targetX = Number.isFinite(normX) ? Math.max(-2, Math.min(2, normX)) : 0;
      mousePos.current.targetY = Number.isFinite(normY) ? Math.max(-2, Math.min(2, normY)) : 0;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Initialize 280 stars with various depths and atmospheric colors
    let stars: Star[] = [];
    const starColors = ['#FFFFFF', '#E0E7FF', '#C7D2FE', '#DDD6FE', '#FCE7F3', '#BAE6FD'];

    const initStars = () => {
      stars = [];
      const starCount = Math.floor((width * height) / 4200);

      for (let i = 0; i < starCount; i++) {
        const layer = Math.random() < 0.6 ? 1 : Math.random() < 0.85 ? 2 : 3;
        const size = layer === 1 ? Math.random() * 1.2 + 0.5 : layer === 2 ? Math.random() * 1.8 + 1.2 : Math.random() * 2.5 + 2.0;
        const baseAlpha = layer === 1 ? Math.random() * 0.4 + 0.3 : layer === 2 ? Math.random() * 0.5 + 0.4 : Math.random() * 0.6 + 0.5;

        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size,
          baseAlpha,
          alpha: baseAlpha,
          twinkleSpeed: Math.random() * 0.03 + 0.008,
          twinklePhase: Math.random() * Math.PI * 2,
          layer,
          color: starColors[Math.floor(Math.random() * starColors.length)],
        });
      }
    };

    initStars();

    // Shooting stars / meteors
    const shootingStars: ShootingStar[] = [];

    const spawnShootingStar = () => {
      if (shootingStars.filter((s) => s.active).length < 2) {
        shootingStars.push({
          x: Math.random() * width * 0.8 + width * 0.1,
          y: Math.random() * height * 0.4,
          length: Math.random() * 140 + 80,
          speed: Math.random() * 12 + 8,
          angle: (Math.PI / 4) + (Math.random() * 0.3 - 0.15), // ~45 deg downward right
          alpha: 1,
          thickness: Math.random() * 1.5 + 1,
          active: true,
        });
      }
    };

    // Periodically spawn meteors
    const meteorInterval = setInterval(() => {
      if (Math.random() > 0.3) {
        spawnShootingStar();
      }
    }, 3800);

    let time = 0;

    const render = () => {
      time += 0.015;

      // Ensure valid canvas dimensions
      if (width <= 0 || height <= 0 || !Number.isFinite(width) || !Number.isFinite(height)) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Smooth mouse interpolation with finite safety
      const targetX = Number.isFinite(mousePos.current.targetX) ? mousePos.current.targetX : 0;
      const targetY = Number.isFinite(mousePos.current.targetY) ? mousePos.current.targetY : 0;
      if (!Number.isFinite(mousePos.current.x)) mousePos.current.x = 0;
      if (!Number.isFinite(mousePos.current.y)) mousePos.current.y = 0;

      mousePos.current.x += (targetX - mousePos.current.x) * 0.05;
      mousePos.current.y += (targetY - mousePos.current.y) * 0.05;

      const mx = Number.isFinite(mousePos.current.x) ? Math.max(-2, Math.min(2, mousePos.current.x)) : 0;
      const my = Number.isFinite(mousePos.current.y) ? Math.max(-2, Math.min(2, mousePos.current.y)) : 0;

      ctx.clearRect(0, 0, width, height);

      // 1. Base Dark Cosmic Gradient (matching screenshot)
      try {
        const baseGrad = ctx.createRadialGradient(
          width * 0.7,
          height * 0.5,
          Math.max(1, 50),
          width * 0.5,
          height * 0.5,
          Math.max(10, width * 0.85)
        );
        baseGrad.addColorStop(0, '#0e0e28'); // subtle deep violet-navy aura around planet
        baseGrad.addColorStop(0.4, '#080918');
        baseGrad.addColorStop(0.8, '#050612');
        baseGrad.addColorStop(1, '#03040b');

        ctx.fillStyle = baseGrad;
        ctx.fillRect(0, 0, width, height);
      } catch {}

      // 2. Soft Nebula Clouds
      // Top Left ambient nebula
      try {
        const neb1 = ctx.createRadialGradient(
          width * 0.15,
          height * 0.25,
          Math.max(1, 20),
          width * 0.15,
          height * 0.25,
          Math.max(5, width * 0.35)
        );
        neb1.addColorStop(0, 'rgba(59, 130, 246, 0.07)');
        neb1.addColorStop(0.5, 'rgba(139, 92, 246, 0.04)');
        neb1.addColorStop(1, 'transparent');
        ctx.fillStyle = neb1;
        ctx.fillRect(0, 0, width, height);
      } catch {}

      // Center-Right planetary nebula
      try {
        const neb2 = ctx.createRadialGradient(
          width * 0.72,
          height * 0.52,
          Math.max(1, 40),
          width * 0.72,
          height * 0.52,
          Math.max(5, width * 0.4)
        );
        neb2.addColorStop(0, 'rgba(168, 85, 247, 0.12)');
        neb2.addColorStop(0.4, 'rgba(236, 72, 153, 0.06)');
        neb2.addColorStop(1, 'transparent');
        ctx.fillStyle = neb2;
        ctx.fillRect(0, 0, width, height);
      } catch {}

      // 3. Render Stars with Parallax and Twinkle
      stars.forEach((star) => {
        star.twinklePhase += star.twinkleSpeed;
        const currentAlpha = star.baseAlpha + Math.sin(star.twinklePhase) * (star.baseAlpha * 0.5);

        // Parallax shift based on depth layer
        const parallaxX = mx * (star.layer * 12);
        const parallaxY = my * (star.layer * 12);

        const drawX = (((star.x + parallaxX) % width) + width) % width;
        const drawY = (((star.y + parallaxY) % height) + height) % height;

        if (!Number.isFinite(drawX) || !Number.isFinite(drawY)) return;

        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, currentAlpha));
        ctx.fillStyle = star.color;

        const starSize = Number.isFinite(star.size) && star.size > 0 ? star.size : 1;

        if (star.layer === 3) {
          // Extra glow halo for brightest stars
          const glowR = Math.max(0.1, starSize * 3.5);
          if (Number.isFinite(glowR)) {
            try {
              const starGlow = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, glowR);
              starGlow.addColorStop(0, star.color);
              starGlow.addColorStop(0.3, 'rgba(199, 210, 254, 0.4)');
              starGlow.addColorStop(1, 'transparent');
              ctx.fillStyle = starGlow;
              ctx.beginPath();
              ctx.arc(drawX, drawY, glowR, 0, Math.PI * 2);
              ctx.fill();
            } catch {}
          }

          // Star cross flare for large stars
          const flareR = Math.max(0.1, starSize * 2.5);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(drawX - flareR, drawY);
          ctx.lineTo(drawX + flareR, drawY);
          ctx.moveTo(drawX, drawY - flareR);
          ctx.lineTo(drawX, drawY + flareR);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(drawX, drawY, Math.max(0.1, starSize), 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      // 4. Render Shooting Stars
      shootingStars.forEach((meteor) => {
        if (!meteor.active) return;

        meteor.x += Math.cos(meteor.angle) * meteor.speed;
        meteor.y += Math.sin(meteor.angle) * meteor.speed;
        meteor.alpha -= 0.014;

        if (meteor.alpha <= 0 || meteor.x > width + 100 || meteor.y > height + 100) {
          meteor.active = false;
          return;
        }

        const tailX = meteor.x - Math.cos(meteor.angle) * meteor.length;
        const tailY = meteor.y - Math.sin(meteor.angle) * meteor.length;

        ctx.save();
        const meteorGrad = ctx.createLinearGradient(tailX, tailY, meteor.x, meteor.y);
        meteorGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        meteorGrad.addColorStop(0.6, 'rgba(196, 181, 253, 0.4)');
        meteorGrad.addColorStop(1, 'rgba(255, 255, 255, 0.95)');

        ctx.strokeStyle = meteorGrad;
        ctx.lineWidth = meteor.thickness;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(meteor.x, meteor.y);
        ctx.stroke();

        // Meteor glowing head
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#C084FC';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, meteor.thickness * 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(meteorInterval);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Background Star Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Coordinate Space Grid Overlay */}
      <div className="absolute inset-0 cosmic-grid opacity-75" />
      <div className="absolute inset-0 cosmic-grid-fine opacity-50" />

      {/* Stylized Floating Coordinate Markers (Like in the screenshot) */}
      <div className="absolute top-1/4 left-16 text-[9px] font-mono tracking-widest text-indigo-400/25 select-none hidden lg:block">
        [SYS.RA 19h 50m 47s]
      </div>
      <div className="absolute top-2/3 left-1/3 text-[9px] font-mono tracking-widest text-purple-400/20 select-none hidden lg:block">
        +08° 52′ 06″
      </div>
      <div className="absolute bottom-24 right-1/4 text-[9px] font-mono tracking-widest text-cyan-400/25 select-none hidden lg:block">
        [GRID.NODE #4096-ALPHA]
      </div>

      {/* Grid Intersection Crosshairs */}
      <div className="absolute top-[320px] left-[128px] w-2 h-2 text-indigo-400/30 flex items-center justify-center font-mono text-[10px] select-none">
        +
      </div>
      <div className="absolute top-[448px] left-[384px] w-2 h-2 text-indigo-400/30 flex items-center justify-center font-mono text-[10px] select-none">
        +
      </div>
      <div className="absolute top-[256px] right-[448px] w-2 h-2 text-pink-400/30 flex items-center justify-center font-mono text-[10px] select-none">
        +
      </div>
      <div className="absolute top-[576px] right-[256px] w-2 h-2 text-indigo-400/30 flex items-center justify-center font-mono text-[10px] select-none">
        +
      </div>

      {/* Ambient Floating Soft Cosmic Dust Spheres */}
      <div className="absolute top-20 left-10 w-44 h-24 rounded-full bg-slate-800/20 blur-2xl animate-float-reverse" />
      <div className="absolute top-1/2 left-28 w-56 h-28 rounded-full bg-indigo-950/25 blur-3xl animate-float" />
      <div className="absolute top-1/3 right-16 w-64 h-32 rounded-full bg-purple-950/20 blur-3xl animate-float-reverse" />

      {/* Top-Right Radiant Celestial Sphere / Tinh Cầu Sáng Rực Rỡ (Khối Cầu Không Vòng) */}
      <div 
        className="absolute top-10 right-4 sm:top-12 sm:right-10 md:top-14 md:right-16 lg:top-12 lg:right-20 z-10 pointer-events-auto transition-transform duration-700 ease-out"
        style={{
          transform: isHoveringMoon ? 'scale(1.1) rotate(4deg)' : 'scale(1)',
        }}
        onMouseEnter={() => setIsHoveringMoon(true)}
        onMouseLeave={() => setIsHoveringMoon(false)}
      >
        {/* Multi-layered Luminous Ambient Halos (Màu sắc sáng rực rỡ) */}
        <div className="absolute -inset-8 rounded-full bg-cyan-400/25 blur-2xl animate-pulse-slow pointer-events-none" />
        <div className="absolute -inset-12 rounded-full bg-pink-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -inset-18 rounded-full bg-purple-500/15 blur-[50px] pointer-events-none" />

        {/* The Bright Celestial Sphere (Quả Tinh Cầu Khối Cầu Thuần Túy) */}
        <div 
          className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full shadow-[0_0_60px_rgba(56,189,248,0.55),0_0_30px_rgba(244,114,182,0.45)] overflow-hidden select-none"
          style={{
            background: 'radial-gradient(circle at 32% 28%, #FFFFFF 0%, #E0F2FE 18%, #7DD3FC 38%, #C084FC 65%, #F472B6 85%, #6366F1 100%)',
          }}
          title="Tinh Cầu Ánh Sáng • Celestial Radiant Sphere"
        >
          {/* Specular Bright Glint */}
          <div className="absolute top-2.5 left-3 w-4 h-4 rounded-full bg-white/90 blur-[1px] shadow-[0_0_12px_#FFFFFF]" />
          <div className="absolute top-4 left-6 w-1.5 h-1.5 rounded-full bg-white/95" />

          {/* Luminous Atmospheric Curving Bands */}
          <div 
            className="absolute -left-6 top-5 w-36 h-9 rounded-[100%] opacity-40 blur-[0.5px] pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, rgba(255,255,255,0.8), rgba(224,242,254,0.6), rgba(244,114,182,0.5))',
              transform: 'rotate(-18deg)',
            }}
          />
          <div 
            className="absolute -left-6 top-11 w-40 h-8 rounded-[100%] opacity-35 blur-[0.5px] pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, rgba(165,243,252,0.7), rgba(192,132,252,0.6), rgba(253,224,71,0.5))',
              transform: 'rotate(-18deg)',
            }}
          />
          <div 
            className="absolute -left-4 top-16 w-36 h-7 rounded-[100%] opacity-30 blur-[0.5px] pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, rgba(244,114,182,0.6), rgba(129,140,248,0.7), rgba(255,255,255,0.4))',
              transform: 'rotate(-18deg)',
            }}
          />

          {/* 3D Atmospheric Depth & Shadow on Bottom-Right */}
          <div className="absolute inset-0 rounded-full shadow-[inset_-8px_-8px_18px_rgba(79,70,229,0.5),inset_4px_4px_12px_rgba(255,255,255,0.6)] pointer-events-none" />
        </div>

        {/* Tiny Orbiting Stardust Particles */}
        <div className="absolute -top-1 right-2 w-1.5 h-1.5 rounded-full bg-cyan-200 shadow-[0_0_8px_#38BDF8] animate-ping" />
        <div className="absolute -bottom-1 left-2 w-1 h-1 rounded-full bg-pink-200 shadow-[0_0_6px_#F472B6]" />

        {/* Ambient Soft Nebular Wisps */}
        <div className="absolute -bottom-3 -left-6 w-28 h-7 rounded-full bg-cyan-500/20 blur-md pointer-events-none" />
        <div className="absolute top-4 -right-4 w-24 h-6 rounded-full bg-pink-500/20 blur-md pointer-events-none" />
      </div>
    </div>
  );
};
