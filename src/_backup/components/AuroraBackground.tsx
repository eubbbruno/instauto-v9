"use client";

import { useEffect, useState } from "react";

interface AuroraBackgroundProps {
  className?: string;
  particleColor?: string;
}

export default function AuroraBackground({
  className = "",
  particleColor = "#0047CC"
}: AuroraBackgroundProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Dinamicamente carregar tsparticles apenas no cliente
    const loadParticles = async () => {
      try {
        const particles = document.getElementById('particles-canvas');
        if (particles) {
          // Se o canvas já existe, não precisamos recriar
          return;
        }

        // Criar o canvas para as partículas
        const canvas = document.createElement('canvas');
        canvas.id = 'particles-canvas';
        canvas.className = 'absolute inset-0 z-0';
        
        const container = document.getElementById('aurora-container');
        if (container) {
          container.appendChild(canvas);
          
          // Desenhar algumas partículas estáticas simples
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            
            // Desenhar 100 pontos aleatórios
            for (let i = 0; i < 100; i++) {
              const x = Math.random() * canvas.width;
              const y = Math.random() * canvas.height;
              const radius = Math.random() * 2 + 1;
              
              ctx.beginPath();
              ctx.arc(x, y, radius, 0, Math.PI * 2);
              ctx.fillStyle = `${particleColor}30`; // 30 é a opacidade em hexadecimal (aprox. 0.2)
              ctx.fill();
            }
            
            // Desenhar algumas linhas conectando pontos próximos
            for (let i = 0; i < 50; i++) {
              const x1 = Math.random() * canvas.width;
              const y1 = Math.random() * canvas.height;
              const x2 = x1 + (Math.random() - 0.5) * 150;
              const y2 = y1 + (Math.random() - 0.5) * 150;
              
              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.strokeStyle = `${particleColor}20`; // 20 é a opacidade em hexadecimal (aprox. 0.12)
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar partículas:", error);
      }
    };

    loadParticles();
    
    return () => {
      // Cleanup
      const canvas = document.getElementById('particles-canvas');
      if (canvas) {
        canvas.remove();
      }
    };
  }, [particleColor]);

  if (!mounted) return null;

  return (
    <div className={`fixed inset-0 -z-10 ${className}`} id="aurora-container">
      {/* Gradiente azul */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-blue-50/90 via-blue-50/60 to-white/95 backdrop-blur-[1px]"
        style={{
          backgroundImage: `radial-gradient(ellipse at top, ${particleColor}10, transparent 50%), radial-gradient(ellipse at bottom, ${particleColor}05, transparent 50%)`
        }}
      ></div>
    </div>
  );
} 