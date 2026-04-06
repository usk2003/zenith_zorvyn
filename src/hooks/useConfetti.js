import { useCallback } from 'react';

/**
 * Custom hook to trigger a high-performance canvas-based confetti explosion.
 * No external dependencies required.
 */
const useConfetti = () => {
  const fire = useCallback(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const particles = [];

    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: randomInRange(4, 8),
      d: randomInRange(10, 25),
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      tilt: Math.random() * 10 - 10,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
      tiltAngle: 0,
    });

    for (let i = 0; i < 150; i++) particles.push(createParticle());

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.d);
        p.tilt = Math.sin(p.tiltAngle) * 15;

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 3, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 5);
        ctx.stroke();

        if (p.y > canvas.height) {
          particles[i] = createParticle();
          particles[i].y = -10;
        }
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(draw);
      } else {
        document.body.removeChild(canvas);
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => window.removeEventListener('resize', resize);
  }, []);

  return { fire };
};

export default useConfetti;
