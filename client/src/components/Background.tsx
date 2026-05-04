import { useEffect, useRef } from 'react';

type BGMode = 'aurora' | 'network' | 'matrix' | 'all';

interface BackgroundProps {
  mode?: BGMode;
  intensity?: number;
}

export function Background({ mode = 'network', intensity = 0.4 }: BackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const stateRef = useRef<any>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;

    const initState = () => {
      const nodes: Array<{ x: number; y: number; vx: number; vy: number; r: number }> = [];
      const nodeCount = Math.min(70, Math.floor((w * h) / 26000));
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: 1 + Math.random() * 1.6,
        });
      }

      const ribbons = [
        { y: 0.30, amp: 70,  freq: 0.0030, speed: 0.18, hue: [129, 140, 248] as [number,number,number], thick: 70  },
        { y: 0.55, amp: 110, freq: 0.0022, speed: 0.13, hue: [168, 85,  247] as [number,number,number], thick: 110 },
        { y: 0.78, amp: 90,  freq: 0.0026, speed: 0.22, hue: [99,  102, 241] as [number,number,number], thick: 80  },
      ];

      const colW = 14;
      const cols = Math.ceil(w / colW);
      const matrix: Array<{ y: number; speed: number; len: number; chars: string[]; mut: number }> = [];
      const glyphs = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ#$%{}[]<>=+-*/';
      for (let i = 0; i < cols; i++) {
        matrix.push({
          y: Math.random() * h,
          speed: 1.5 + Math.random() * 2.5,
          len: 8 + Math.floor(Math.random() * 14),
          chars: Array.from({ length: 30 }, () => glyphs[Math.floor(Math.random() * glyphs.length)]),
          mut: Math.random() * 60,
        });
      }

      const star = {
        active: false,
        nextAt: performance.now() + 15000 + Math.random() * 25000,
        x: 0, y: 0, vx: 0, vy: 0,
        life: 0, maxLife: 0, size: 0,
        trail: [] as Array<{ x: number; y: number }>,
      };

      stateRef.current = { nodes, ribbons, matrix, colW, glyphs, star, t0: performance.now() };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initState();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = (now: number) => {
      const s = stateRef.current;
      if (!s) { rafRef.current = requestAnimationFrame(draw); return; }
      const t = (now - s.t0) / 1000;

      ctx.fillStyle = '#0a0b10';
      ctx.fillRect(0, 0, w, h);

      // ── Aurora ribbons ──
      if (mode === 'aurora' || mode === 'all') {
        ctx.globalCompositeOperation = 'lighter';
        for (const rb of s.ribbons) {
          const yBase = rb.y * h;
          const grad = ctx.createLinearGradient(0, yBase - rb.thick, 0, yBase + rb.thick);
          const a = 0.12 * intensity;
          grad.addColorStop(0,   `rgba(${rb.hue[0]},${rb.hue[1]},${rb.hue[2]},0)`);
          grad.addColorStop(0.5, `rgba(${rb.hue[0]},${rb.hue[1]},${rb.hue[2]},${a})`);
          grad.addColorStop(1,   `rgba(${rb.hue[0]},${rb.hue[1]},${rb.hue[2]},0)`);
          const step = 6;
          ctx.beginPath();
          for (let x = 0; x <= w; x += step) {
            const y = yBase + Math.sin(x * rb.freq + t * rb.speed) * rb.amp + Math.sin(x * rb.freq * 2.3 + t * rb.speed * 1.4) * (rb.amp * 0.35) - rb.thick;
            if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          for (let x = w; x >= 0; x -= step) {
            const y = yBase + Math.sin(x * rb.freq + t * rb.speed) * rb.amp + Math.sin(x * rb.freq * 2.3 + t * rb.speed * 1.4) * (rb.amp * 0.35) + rb.thick;
            ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fillStyle = grad;
          ctx.fill();
          ctx.beginPath();
          for (let x = 0; x <= w; x += step) {
            const y = yBase + Math.sin(x * rb.freq + t * rb.speed) * rb.amp + Math.sin(x * rb.freq * 2.3 + t * rb.speed * 1.4) * (rb.amp * 0.35);
            if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = `rgba(${rb.hue[0]},${rb.hue[1]},${rb.hue[2]},${0.18 * intensity})`;
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }
        ctx.globalCompositeOperation = 'source-over';
      }

      // ── Matrix rain ──
      if (mode === 'matrix' || mode === 'all') {
        ctx.font = "12px 'JetBrains Mono', ui-monospace, monospace";
        ctx.textBaseline = 'top';
        for (let i = 0; i < s.matrix.length; i++) {
          const m = s.matrix[i];
          m.y += m.speed; m.mut -= 1;
          if (m.mut <= 0) {
            m.chars[Math.floor(Math.random() * m.chars.length)] = s.glyphs[Math.floor(Math.random() * s.glyphs.length)];
            m.mut = 6 + Math.random() * 30;
          }
          if (m.y - m.len * 14 > h) { m.y = -Math.random() * 200; m.speed = 1.5 + Math.random() * 2.5; m.len = 8 + Math.floor(Math.random() * 14); }
          for (let k = 0; k < m.len; k++) {
            const yy = m.y - k * 14;
            if (yy < -14 || yy > h) continue;
            const a = (1 - k / m.len) * 0.55 * intensity;
            ctx.fillStyle = k === 0 ? `rgba(216,180,254,${0.95 * intensity})` : `rgba(129,140,248,${a})`;
            ctx.fillText(m.chars[k % m.chars.length], i * s.colW, yy);
          }
        }
      }

      // ── Network ──
      if (mode === 'network' || mode === 'all') {
        const nodes = s.nodes;
        for (const n of nodes) {
          n.x += n.vx; n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        }
        const maxDist = 160;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < maxDist) {
              ctx.strokeStyle = `rgba(165,180,252,${(1 - d / maxDist) * 0.32 * intensity})`;
              ctx.lineWidth = 1;
              ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
            }
          }
        }
        for (const n of nodes) {
          ctx.fillStyle = `rgba(199,210,254,${0.7 * intensity})`;
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
        }
      }

      // Vignette
      const vg = ctx.createLinearGradient(0, 0, 0, h);
      vg.addColorStop(0,   'rgba(10,11,16,0.35)');
      vg.addColorStop(0.5, 'rgba(10,11,16,0.0)');
      vg.addColorStop(1,   'rgba(10,11,16,0.55)');
      ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);

      // ── Meteor easter egg ──
      const star = s.star;
      if (!star.active && now >= star.nextAt) {
        const fromLeft = Math.random() < 0.5;
        star.x = fromLeft ? -60 : w + 60; star.y = Math.random() * h * 0.35 + 40;
        const speed = 3.2 + Math.random() * 1.4;
        const angle = Math.PI / 7 + Math.random() * (Math.PI / 7);
        star.vx = (fromLeft ? 1 : -1) * Math.cos(angle) * speed; star.vy = Math.sin(angle) * speed;
        star.life = 0; star.maxLife = 380 + Math.floor(Math.random() * 120); star.size = 3.2 + Math.random() * 1.2; star.trail = []; star.active = true;
      }
      if (star.active) {
        star.x += star.vx; star.y += star.vy; star.life += 1;
        star.trail.unshift({ x: star.x, y: star.y });
        if (star.trail.length > 80) star.trail.length = 80;
        const fadeIn = Math.min(1, star.life / 30);
        const fadeOut = Math.min(1, (star.maxLife - star.life) / 40);
        const env = Math.min(fadeIn, Math.max(0, fadeOut));
        for (let i = 0; i < star.trail.length - 1; i++) {
          const p = star.trail[i], q = star.trail[i + 1];
          ctx.strokeStyle = `rgba(226,232,255,${(1 - i / star.trail.length) * 0.9 * env})`;
          ctx.lineWidth = 2.6 - (i / star.trail.length) * 2.4; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
        const bloom = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 28);
        bloom.addColorStop(0,    `rgba(255,255,255,${0.95 * env})`);
        bloom.addColorStop(0.25, `rgba(196,181,253,${0.55 * env})`);
        bloom.addColorStop(0.6,  `rgba(129,140,248,${0.25 * env})`);
        bloom.addColorStop(1,    'rgba(99,102,241,0)');
        ctx.fillStyle = bloom; ctx.beginPath(); ctx.arc(star.x, star.y, 28, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${env})`; ctx.beginPath(); ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2); ctx.fill();
        if (star.life > star.maxLife || star.x < -120 || star.x > w + 120 || star.y > h + 120) {
          star.active = false; star.nextAt = now + 60000 + Math.random() * 120000;
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, [mode, intensity]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
