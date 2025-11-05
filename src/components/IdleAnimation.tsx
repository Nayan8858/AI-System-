import { useEffect, useState } from "react";

interface IdleAnimationProps {
  isActive: boolean;
}

export const IdleAnimation = ({ isActive }: IdleAnimationProps) => {
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    if (!isActive) {
      const timer = setTimeout(() => setMounted(false), 500);
      return () => clearTimeout(timer);
    }
    setMounted(true);
  }, [isActive]);

  if (!mounted) return null;

  return (
    <div 
      className={`fixed inset-0 pointer-events-none transition-opacity duration-500 ${
        isActive ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="bubble bubble-1"></div>
        <div className="bubble bubble-2"></div>
        <div className="bubble bubble-3"></div>
        <div className="bubble bubble-4"></div>
        <div className="bubble bubble-5"></div>
      </div>
    </div>
  );
};
