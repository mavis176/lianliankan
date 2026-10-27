import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface ParticleCanvasRef {
  drawConnectingLine: (points: { x: number; y: number }[], color?: string, onComplete?: () => void) => void;
  burstParticles: (x: number, y: number, color?: string, count?: number) => void;
  celebrateVictory: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  rotation: number;
  vRot: number;
  isPaw?: boolean;
  isConfetti?: boolean;
}

interface ActiveLine {
  points: { x: number; y: number }[];
  color: string;
  opacity: number;
  dashOffset: number;
  onComplete?: () => void;
}

export const ParticleCanvas = forwardRef<ParticleCanvasRef, { className?: string }>(({ className }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const activeLinesRef = useRef<ActiveLine[]>([]);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    // Animation Loop
    const render = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Active Connecting Line (Matching image_1.png: Golden dashed glow + spark dots)
      for (let i = activeLinesRef.current.length - 1; i >= 0; i--) {
        const line = activeLinesRef.current[i];
        line.opacity -= 0.035; // Fades out in ~0.25 - 0.3s
        line.dashOffset -= 1.5;

        if (line.opacity <= 0) {
          if (line.onComplete) line.onComplete();
          activeLinesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = Math.max(0, line.opacity);

        // Outer Golden Glow
        ctx.strokeStyle = '#FBBF24';
        ctx.lineWidth = 8;
        ctx.shadowColor = '#F59E0B';
        ctx.shadowBlur = 18;
        ctx.setLineDash([8, 6]);
        ctx.lineDashOffset = line.dashOffset;

        ctx.beginPath();
        for (let p = 0; p < line.points.length; p++) {
          const pt = line.points[p];
          if (p === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();

        // Inner White/Gold Bright Core
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = '#FFFDF5';
        ctx.shadowBlur = 4;
        ctx.stroke();

        // Glowing Cat Paw Nodes along the corners
        ctx.setLineDash([]);
        line.points.forEach((pt, pIdx) => {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFDF5';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 9, 0, Math.PI * 2);
          ctx.strokeStyle = '#F59E0B';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Little paw on endpoints
          if (pIdx === 0 || pIdx === line.points.length - 1) {
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🐾', pt.x, pt.y - 12);
          }
        });

        ctx.restore();
      }

      // 2. Draw & Update Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.isConfetti ? 0.16 : 0.05;
        p.vx *= 0.98;
        p.rotation += p.vRot;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        if (p.life >= p.maxLife || p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;

        if (p.isPaw) {
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🐾', 0, 0);
        } else if (p.isConfetti) {
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  useImperativeHandle(ref, () => ({
    drawConnectingLine: (points, color = '#F59E0B', onComplete) => {
      activeLinesRef.current.push({
        points,
        color,
        opacity: 1,
        dashOffset: 0,
        onComplete,
      });
    },

    burstParticles: (x, y, color = '#F59E0B', count = 22) => {
      const palette = ['#F59E0B', '#FBBF24', '#FCD34D', '#FFFDF8', '#E64A4A', '#48BB78'];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.6 + Math.random() * 4.5;
        const chosenColor = palette[Math.floor(Math.random() * palette.length)];
        const isPaw = i % 4 === 0;

        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: chosenColor,
          size: isPaw ? 8 : 2 + Math.random() * 3.5,
          alpha: 1,
          life: 0,
          maxLife: 22 + Math.floor(Math.random() * 16),
          rotation: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.15,
          isPaw,
          isConfetti: false,
        });
      }
    },

    celebrateVictory: () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      const colors = ['#F59E0B', '#10B981', '#EC4899', '#8B5CF6', '#FBBF24', '#38BDF8'];

      for (let i = 0; i < 80; i++) {
        particlesRef.current.push({
          x: width * 0.5 + (Math.random() - 0.5) * 100,
          y: height * 0.45 + (Math.random() - 0.5) * 50,
          vx: (Math.random() - 0.5) * 12,
          vy: -5 - Math.random() * 8,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 6 + Math.random() * 6,
          alpha: 1,
          life: 0,
          maxLife: 75 + Math.floor(Math.random() * 35),
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.2,
          isPaw: i % 5 === 0,
          isConfetti: true,
        });
      }
    },
  }));

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-30 w-full h-full ${className || ''}`}
    />
  );
});

ParticleCanvas.displayName = 'ParticleCanvas';
