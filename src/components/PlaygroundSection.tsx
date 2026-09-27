import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Zap, Volume2, ShieldCheck, Flame } from 'lucide-react';
import { TESTIMONIALS } from '../data/portfolioData';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

export const PlaygroundSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [burstCount, setBurstCount] = useState(0);

  const particlesRefSyst = useRef<Particle[]>([]);
  const attractorRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  const colors = ['#A855F7', '#EC4899', '#38BDF8', '#F472B6', '#C084FC', '#FFFFFF'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 800;
    const height = 360;

    const updateDimensions = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = Math.max(300, Math.floor(rect.width || 800));
      canvas.width = width;
      canvas.height = height;
    };

    updateDimensions();

    // Spawn initial particle cloud
    const initParticles = () => {
      particlesRefSyst.current = [];
      for (let i = 0; i < 120; i++) {
        particlesRefSyst.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          size: Math.random() * 2.5 + 1.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.7 + 0.3,
          life: 0,
          maxLife: 1000,
        });
      }
    };

    initParticles();

    const render = () => {
      ctx.fillStyle = 'rgba(7, 9, 27, 0.25)';
      ctx.fillRect(0, 0, width, height);

      const targetX = attractorRef.current.active ? attractorRef.current.x : width / 2;
      const targetY = attractorRef.current.active ? attractorRef.current.y : height / 2;

      particlesRefSyst.current.forEach((p, idx) => {
        // Gravitational attraction
        const dx = targetX - p.x;
        const dy = targetY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 15 && attractorRef.current.active) {
          p.vx += (dx / dist) * 0.18;
          p.vy += (dy / dist) * 0.18;
        }

        // Dampening velocity
        p.vx *= 0.97;
        p.vy *= 0.97;

        p.x += p.vx;
        p.y += p.vy;

        // Bounce boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw particle
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Connect nearby particles with subtle lines
        for (let j = idx + 1; j < particlesRefSyst.current.length; j++) {
          const p2 = particlesRefSyst.current[j];
          const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist2 < 65) {
            ctx.save();
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - dist2 / 65) * 0.2;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    setBurstCount((c) => c + 1);

    // Spawn 25 burst particles at click
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 3;
      particlesRefSyst.current.push({
        x: clickX,
        y: clickY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 0,
        maxLife: 200,
      });
    }

    if (particlesRefSyst.current.length > 200) {
      particlesRefSyst.current.splice(0, 30);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    attractorRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const handleMouseLeave = () => {
    attractorRef.current.active = false;
  };

  return (
    <section className="relative py-24 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Interactive Lab Banner */}
        <div className="mb-24 p-6 sm:p-10 rounded-3xl bg-[#0A0C22]/90 border border-indigo-800/50 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-950/40 border border-pink-700/40 text-pink-300 text-xs font-mono mb-2">
                <Flame className="w-3.5 h-3.5 text-pink-400" />
                <span>INTERACTIVE CANVAS LAB</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-tektur text-white">
                Cosmic Particle Physics Sandbox
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Click anywhere on the radar to trigger supernovas, or hover to attract gravity fields.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-purple-300 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-indigo-900/40">
                Bursts: {burstCount}
              </span>
            </div>
          </div>

          {/* Canvas Box */}
          <div className="relative rounded-2xl overflow-hidden border border-indigo-900/60 bg-[#060718]">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="w-full h-72 sm:h-80 cursor-crosshair block"
            />
            <div className="absolute bottom-3 left-4 text-[10px] font-mono text-slate-500 pointer-events-none select-none">
              [CANVAS 2D • REAL-TIME N-BODY PHYSICS • WEB AUDIO TRIGGER]
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono text-purple-400 font-semibold tracking-wider uppercase">
            COLLABORATION & TRUST
          </span>
          <h3 className="text-2xl sm:text-4xl font-bold font-tektur text-white mt-2">
            What Engineering Leaders Say
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="p-6 sm:p-7 rounded-3xl bg-[#0B0D23]/80 border border-indigo-900/40 hover:border-purple-500/40 transition-all flex flex-col justify-between"
            >
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-6">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-indigo-950/60">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-10 h-10 rounded-full object-cover border border-purple-500/40"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{t.author}</h4>
                  <p className="text-[11px] text-slate-400">
                    {t.role} • {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
