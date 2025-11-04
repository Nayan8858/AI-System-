import { useEffect, useState } from 'react';

export const ConfettiEffect = () => {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: string; delay: string; color: string }>>([]);

  useEffect(() => {
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      color: ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981'][Math.floor(Math.random() * 5)]
    }));
    setConfetti(pieces);

    const timer = setTimeout(() => setConfetti([]), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 animate-confetti"
          style={{
            left: piece.left,
            top: '-10px',
            backgroundColor: piece.color,
            animationDelay: piece.delay,
            transform: 'rotate(0deg)'
          }}
        />
      ))}
    </div>
  );
};
