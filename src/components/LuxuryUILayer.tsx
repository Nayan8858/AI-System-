import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Image as ImageIcon, Code, FileText, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LuxuryUILayerProps {
  onQuickAction: (action: string) => void;
}

export const LuxuryUILayer = ({ onQuickAction }: LuxuryUILayerProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => {
        const newParticle = {
          id: Date.now(),
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight
        };
        return [...prev.slice(-20), newParticle];
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    { icon: ImageIcon, label: 'Image', action: 'image' },
    { icon: Code, label: 'Code', action: 'code' },
    { icon: FileText, label: 'Summarize', action: 'summarize' },
    { icon: Search, label: 'Search', action: 'search' },
  ];

  return (
    <>
      {/* Aurora Glass Background Effect */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, 
            rgba(59, 130, 246, 0.15), 
            transparent 40%)`,
        }}
      />

      {/* AI Spark Particles */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          initial={{ opacity: 0.6, scale: 0 }}
          animate={{ opacity: 0, scale: 1, y: -50 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="fixed w-1 h-1 bg-primary rounded-full pointer-events-none z-0"
          style={{ left: particle.x, top: particle.y }}
        />
      ))}

      {/* Quick Action Bar */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed bottom-6 right-6 z-50 glass rounded-full p-2 shadow-2xl"
      >
        <TooltipProvider>
          <div className="flex gap-2">
            {quickActions.map((action, i) => (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onQuickAction(action.action)}
                    className="rounded-full hover:scale-110 transition-all"
                  >
                    <action.icon className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{action.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </motion.div>
    </>
  );
};
