import React, { useRef, useEffect } from 'react';
import { AttackType } from '../types';

interface AttackVisualizerProps {
  isActive: boolean;
  attackType: AttackType;
  intensity: number;
  attackerCount: number;
  serverHealth: number; // 0-100
  mitigationActive: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  speed: number;
  life: number;
}

const AttackVisualizer: React.FC<AttackVisualizerProps> = ({
  isActive,
  attackType,
  intensity,
  attackerCount,
  serverHealth,
  mitigationActive
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameIdRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;

    const render = () => {
      // Clear Canvas
      ctx.fillStyle = 'rgba(10, 10, 15, 0.2)'; // Trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Server (Center)
      const serverPulse = Math.sin(Date.now() / 200) * 5;
      const serverColor = serverHealth > 90 ? '#ff003c' : serverHealth > 50 ? '#fcee0a' : '#00ff9d';
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30 + (serverHealth > 80 ? serverPulse : 0), 0, Math.PI * 2);
      ctx.fillStyle = serverColor;
      ctx.shadowBlur = 20;
      ctx.shadowColor = serverColor;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Shield if Mitigation Active
      if (mitigationActive) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, 45, 0, Math.PI * 2);
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.lineDashOffset = -Date.now() / 50;
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw Attackers
      const angleStep = (Math.PI * 2) / attackerCount;
      const attackers = [];
      for (let i = 0; i < attackerCount; i++) {
        const angle = i * angleStep;
        const ax = centerX + Math.cos(angle) * radius;
        const ay = centerY + Math.sin(angle) * radius;
        attackers.push({ x: ax, y: ay });

        ctx.beginPath();
        ctx.arc(ax, ay, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#ff003c';
        ctx.fill();

        // Draw connection line ghost
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(centerX, centerY);
        ctx.strokeStyle = 'rgba(255, 0, 60, 0.05)';
        ctx.stroke();
      }

      // Spawn Particles
      if (isActive) {
        const spawnRate = Math.ceil(intensity / 5);
        for (let i = 0; i < spawnRate; i++) {
          const randomAttackerIdx = Math.floor(Math.random() * attackerCount);
          const attacker = attackers[randomAttackerIdx];
          
          const angle = Math.atan2(centerY - attacker.y, centerX - attacker.x);
          const speed = 2 + (Math.random() * 3); // Random speed variation
          
          particlesRef.current.push({
            x: attacker.x,
            y: attacker.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: attackType === AttackType.VOLUMETRIC ? '#ff003c' : 
                   attackType === AttackType.PROTOCOL ? '#fcee0a' : '#ff00ff',
            speed: speed,
            life: 100
          });
        }
      }

      // Update and Draw Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;

        // Distance to center
        const dx = centerX - p.x;
        const dy = centerY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Collision with Shield
        if (mitigationActive && dist < 45) {
            // Bounce or destroy
            particlesRef.current.splice(i, 1);
            // Draw deflection spark
            ctx.fillStyle = '#00f0ff';
            ctx.fillRect(p.x, p.y, 2, 2);
            continue;
        }

        // Collision with Server
        if (dist < 30) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      frameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(frameIdRef.current);
    };
  }, [isActive, attackerCount, intensity, attackType, serverHealth, mitigationActive]);

  return (
    <div className="w-full h-full bg-cyber-black rounded-xl overflow-hidden relative border border-cyber-panel">
        <div className="absolute top-4 left-4 text-xs font-mono text-gray-400 pointer-events-none select-none">
            <p>VISUALIZATION_MODE: CANVAS_2D</p>
            <p>TARGET: LOCALHOST</p>
            <p>NODES_DETECTED: {attackerCount}</p>
        </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default AttackVisualizer;
