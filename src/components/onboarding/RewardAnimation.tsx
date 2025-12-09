import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Award, Image, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RewardAnimationProps {
  onContinue: () => void;
}

export const RewardAnimation: React.FC<RewardAnimationProps> = ({ onContinue }) => {
  const [phase, setPhase] = useState<'success' | 'rewards'>('success');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => {
      setPhase('rewards');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const rewards = [
    { icon: Award, title: 'Starter Badge', description: 'Welcome to NayandeepGPT!', color: 'from-yellow-500 to-orange-500' },
    { icon: Image, title: '5 Free AI Images', description: 'Generate stunning visuals', color: 'from-purple-500 to-pink-500' },
    { icon: Zap, title: '24-Hour Speed Boost', description: 'Priority processing enabled', color: 'from-cyan-500 to-blue-500' },
  ];

  // Simple confetti particles
  const confettiColors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#A78BFA', '#F472B6', '#60A5FA'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl overflow-hidden"
    >
      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-sm"
              style={{
                backgroundColor: confettiColors[i % confettiColors.length],
                left: `${Math.random() * 100}%`,
                top: -20,
              }}
              animate={{
                y: [0, window.innerHeight + 100],
                x: [0, (Math.random() - 0.5) * 200],
                rotate: [0, Math.random() * 720],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {phase === 'success' ? (
          <motion.div
            key="success"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-center"
          >
            {/* Expanding glow circle */}
            <motion.div
              className="relative w-48 h-48 mx-auto mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(34, 197, 94, 0.4)',
                    '0 0 0 40px rgba(34, 197, 94, 0)',
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.4, delay: 0.4, type: 'spring' }}
                >
                  <Check className="w-24 h-24 text-white" strokeWidth={3} />
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.h1
              className="text-4xl font-bold mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Setup Complete!
            </motion.h1>
            <motion.p
              className="text-muted-foreground text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Your rewards are being unlocked...
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="rewards"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-lg mx-4"
          >
            <motion.h1
              className="text-3xl font-bold mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Rewards Unlocked!
            </motion.h1>
            <motion.p
              className="text-muted-foreground mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              You've earned these welcome bonuses
            </motion.p>

            <div className="space-y-4 mb-8">
              {rewards.map((reward, index) => {
                const Icon = reward.icon;
                return (
                  <motion.div
                    key={reward.title}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.15 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-card/50 backdrop-blur border border-border/50 shadow-lg"
                  >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${reward.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="font-semibold">{reward.title}</h3>
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.15, type: 'spring' }}
                      className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-green-500" />
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            <Button
              size="lg"
              onClick={onContinue}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:opacity-90"
            >
              Continue to Plan Selection
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
