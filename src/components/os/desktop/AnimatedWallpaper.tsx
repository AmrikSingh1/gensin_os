'use client'

import React, { useEffect, useRef, useState } from 'react'

interface AnimatedWallpaperProps {
  type: 'matrix' | 'particles' | 'cybercity' | 'digital-rain';
  opacity?: number;
}

const AnimatedWallpaper: React.FC<AnimatedWallpaperProps> = ({ 
  type, 
  opacity = 0.8 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const requestRef = useRef<number>();
  const particlesRef = useRef<any[]>([]);
  
  // Set up canvas dimensions and update on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current && typeof window !== 'undefined') {
        const { clientWidth, clientHeight } = document.documentElement;
        setDimensions({ width: clientWidth, height: clientHeight });
      }
    };
    
    // Ensure this only runs in the browser
    if (typeof window !== 'undefined') {
      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      
      return () => {
        window.removeEventListener('resize', updateDimensions);
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    }
  }, []);
  
  // Matrix/Digital Rain effect
  useEffect(() => {
    if ((type === 'matrix' || type === 'digital-rain') && typeof window !== 'undefined') {
      if (!canvasRef.current || dimensions.width === 0) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      
      const fontSize = 14;
      const columns = Math.floor(dimensions.width / fontSize);
      const drops: number[] = [];
      
      // Initialize drops
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * dimensions.height);
      }
      
      // Define characters to display
      const chars = type === 'matrix' 
        ? '01010101アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
        : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
      
      // Draw matrix effect
      const draw = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Set color based on effect type
        ctx.fillStyle = type === 'matrix' ? '#0F0' : '#00F0F0';
        ctx.font = `${fontSize}px monospace`;
        
        for (let i = 0; i < drops.length; i++) {
          // Get random character
          const text = chars[Math.floor(Math.random() * chars.length)];
          
          // Draw character
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);
          
          // Move drop
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
        
        requestRef.current = requestAnimationFrame(draw);
      };
      
      draw();
      
      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    }
  }, [dimensions, type]);
  
  // Particles effect
  useEffect(() => {
    if (type === 'particles' && typeof window !== 'undefined') {
      if (!canvasRef.current || dimensions.width === 0) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      
      // Create particles
      const particleCount = 100;
      const particles: any[] = [];
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          radius: Math.random() * 3 + 1,
          color: `rgb(${Math.floor(Math.random() * 100 + 155)}, 
                      ${Math.floor(Math.random() * 100 + 155)}, 
                      ${Math.floor(Math.random() * 255)})`,
          speedX: Math.random() * 1 - 0.5,
          speedY: Math.random() * 1 - 0.5
        });
      }
      
      particlesRef.current = particles;
      
      // Draw and update particles
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        particlesRef.current.forEach((particle, index) => {
          // Draw particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();
          
          // Connect particles that are close to each other
          for (let j = index + 1; j < particlesRef.current.length; j++) {
            const otherParticle = particlesRef.current[j];
            const distance = Math.sqrt(
              Math.pow(particle.x - otherParticle.x, 2) + 
              Math.pow(particle.y - otherParticle.y, 2)
            );
            
            if (distance < 100) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(88, 198, 255, ${1 - distance / 100})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
            }
          }
          
          // Update particle position
          particle.x += particle.speedX;
          particle.y += particle.speedY;
          
          // Bounce off edges
          if (particle.x > dimensions.width || particle.x < 0) {
            particle.speedX = -particle.speedX;
          }
          if (particle.y > dimensions.height || particle.y < 0) {
            particle.speedY = -particle.speedY;
          }
        });
        
        requestRef.current = requestAnimationFrame(draw);
      };
      
      draw();
      
      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    }
  }, [dimensions, type]);
  
  // CyberCity effect
  useEffect(() => {
    if (type === 'cybercity' && typeof window !== 'undefined') {
      if (!canvasRef.current || dimensions.width === 0) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      
      // Cityscape parameters
      const buildingCount = Math.floor(dimensions.width / 30);
      const buildings: any[] = [];
      const lights: any[] = [];
      
      // Generate buildings
      for (let i = 0; i < buildingCount; i++) {
        const width = Math.random() * 60 + 20;
        const height = Math.random() * 300 + 100;
        const x = i * (dimensions.width / buildingCount);
        
        buildings.push({
          x,
          y: dimensions.height - height,
          width,
          height,
          color: `rgb(${Math.floor(Math.random() * 20)}, 
                      ${Math.floor(Math.random() * 20)}, 
                      ${Math.floor(Math.random() * 40) + 20})`
        });
        
        // Add lights to buildings
        const lightCount = Math.floor(Math.random() * 10) + 5;
        for (let j = 0; j < lightCount; j++) {
          if (Math.random() > 0.5) { // Not all windows have lights
            lights.push({
              x: x + Math.random() * width,
              y: dimensions.height - height + Math.random() * height,
              size: Math.random() * 5 + 2,
              opacity: Math.random() * 0.8 + 0.2,
              blinkSpeed: Math.random() * 0.05
            });
          }
        }
      }
      
      // Draw cityscape
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, dimensions.height);
        gradient.addColorStop(0, '#000033');
        gradient.addColorStop(0.5, '#330033');
        gradient.addColorStop(1, '#000000');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, dimensions.height);
        
        // Draw stars
        for (let i = 0; i < 100; i++) {
          const x = Math.random() * dimensions.width;
          const y = Math.random() * dimensions.height * 0.6;
          const size = Math.random() * 2;
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.random()})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Draw buildings
        buildings.forEach(building => {
          ctx.fillStyle = building.color;
          ctx.fillRect(building.x, building.y, building.width, building.height);
        });
        
        // Draw and update lights
        lights.forEach(light => {
          light.opacity += Math.sin(Date.now() * light.blinkSpeed) * 0.05;
          light.opacity = Math.max(0.1, Math.min(1, light.opacity));
          
          ctx.fillStyle = `rgba(255, 255, 0, ${light.opacity})`;
          ctx.beginPath();
          ctx.rect(light.x, light.y, light.size, light.size);
          ctx.fill();
        });
        
        requestRef.current = requestAnimationFrame(draw);
      };
      
      draw();
      
      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    }
  }, [dimensions, type]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full" 
      style={{ opacity, zIndex: -1 }}
    />
  );
};

export default AnimatedWallpaper; 