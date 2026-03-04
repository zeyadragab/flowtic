import { useEffect, useRef } from 'react';

export default function AuthBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(true); }
      reset(init = false) {
        this.x       = Math.random() * canvas.width;
        this.y       = Math.random() * canvas.height;
        this.z       = init ? Math.random() * 1000 : 1000;
        this.size    = Math.random() * 2 + 0.5;
        this.speedX  = (Math.random() - 0.5) * 0.35;
        this.speedY  = (Math.random() - 0.5) * 0.35;
        this.speedZ  = Math.random() * 1.5 + 0.4;
        this.opacity = Math.random() * 0.6 + 0.15;
        const pal = [[255,215,0],[139,92,246],[59,130,246],[255,255,255],[255,140,0]];
        this.color = pal[Math.floor(Math.random() * pal.length)];
      }
      update() {
        this.z -= this.speedZ;
        if (this.z <= 0) { this.reset(); return; }
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width)  this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height)  this.speedY *= -1;
      }
      draw() {
        const p  = 1000 / (1000 - this.z) * 0.3 + 0.7;
        const x  = (this.x - canvas.width  / 2) * p + canvas.width  / 2;
        const y  = (this.y - canvas.height / 2) * p + canvas.height / 2;
        const sz = Math.max(0.1, this.size * p);
        const op = this.opacity * (1 - this.z / 1000);
        const [r, g, b] = this.color;
        ctx.beginPath();
        ctx.arc(x, y, sz, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${op})`;
        ctx.fill();
      }
    }

    const pts = Array.from({ length: 90 }, () => new Particle());

    const drawLines = () => {
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(255,215,0,${(1 - d / 110) * 0.1})`;
            ctx.lineWidth   = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawLines();
      pts.forEach(p => { p.update(); p.draw(); });
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Glowing colour orbs */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)', filter: 'blur(70px)' }} />
        <div className="absolute top-1/3 -right-48 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)', filter: 'blur(90px)' }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-60 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #ffd700, transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <div className="absolute top-[10%] right-[6%] w-44 h-44 border border-[#ffd700]/20 rounded-3xl animate-rotate3d" />
        <div className="absolute bottom-[15%] left-[5%] w-36 h-36 border border-[#7c3aed]/20 rounded-full animate-rotate3d-reverse" />
        <div className="absolute top-[45%] left-[3%] w-24 h-24 animate-float opacity-20"
          style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.5),rgba(59,130,246,0.5))', clipPath: 'polygon(50% 0%,0% 100%,100% 100%)' }} />
        <div className="absolute top-[25%] right-[4%] w-16 h-16 animate-float-delay opacity-20"
          style={{ background: 'linear-gradient(135deg,rgba(255,215,0,0.5),rgba(255,140,0,0.5))', clipPath: 'polygon(50% 0%,100% 50%,50% 100%,0% 50%)' }} />
      </div>

      {/* Radial overlay */}
      <div className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 15% 50%, rgba(124,58,237,0.12) 0%, transparent 55%),
            radial-gradient(ellipse at 85% 20%, rgba(59,130,246,0.12) 0%, transparent 55%)
          `,
        }}
      />
    </>
  );
}
