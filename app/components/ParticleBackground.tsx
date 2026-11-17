"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
};

const PARTICLE_COUNT = 140;
const LINK_DISTANCE = 120;
const ATTRACT_DISTANCE = 200;
const ATTRACT_STRENGTH = 0.18;

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const pointer = { x: 0, y: 0, active: false };
    let animationFrame = 0;
    let particles: Particle[] = [];

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 1.5 + 0.8,
        opacity: Math.random() * 0.28 + 0.18,
      }));
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const animate = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -10) particle.x = window.innerWidth + 10;
        if (particle.x > window.innerWidth + 10) particle.x = -10;
        if (particle.y < -10) particle.y = window.innerHeight + 10;
        if (particle.y > window.innerHeight + 10) particle.y = -10;

        if (pointer.active) {
          const dx = pointer.x - particle.x;
          const dy = pointer.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < ATTRACT_DISTANCE && distance > 0) {
            particle.x += (dx / distance) * ATTRACT_STRENGTH;
            particle.y += (dy / distance) * ATTRACT_STRENGTH;
          }
        }
      }

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(255, 161, 90, ${particle.opacity})`;
        context.fill();

        for (let j = i + 1; j < particles.length; j += 1) {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < LINK_DISTANCE) {
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(other.x, other.y);
            context.strokeStyle = `rgba(255, 161, 90, ${(1 - distance / LINK_DISTANCE) * 0.1})`;
            context.lineWidth = 1;
            context.stroke();
          }
        }
      }

      animationFrame = window.requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    animate();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
