import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageSquare, Plus, Bot, LayoutGrid, Brain, Gift, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface GuidedTutorialProps {
  onComplete: () => void;
}

export const GuidedTutorial: React.FC<GuidedTutorialProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: MessageSquare,
      title: 'Chat Input & Voice',
      description: 'Type your messages here or use the microphone for voice input. You can also upload images and PDFs for analysis.',
      highlight: 'bottom',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Plus,
      title: 'Tools Panel',
      description: 'Click the + button to access powerful tools: camera, file uploads, web search, image generation, and more.',
      highlight: 'bottom-left',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Bot,
      title: 'Multi-Model AI System',
      description: 'NayandeepGPT uses 8 specialized AI models. Each query is automatically routed to the best model for your task.',
      highlight: 'center',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: LayoutGrid,
      title: 'Template Library',
      description: 'Browse pre-built templates for common tasks: coding, writing, SEO, research, and more.',
      highlight: 'sidebar',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: Brain,
      title: 'Memory & Personalization',
      description: 'AI remembers your preferences, coding style, and past conversations to provide personalized responses.',
      highlight: 'sidebar',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Gift,
      title: 'Free Plan Benefits',
      description: 'Enjoy 1,000 words/day and 5 image generations. Upgrade anytime for unlimited access.',
      highlight: 'center',
      gradient: 'from-yellow-500 to-orange-500',
    },
  ];

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 pointer-events-none"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm pointer-events-auto" />

      {/* Tutorial Card */}
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4 pointer-events-auto"
      >
        <div className="bg-card rounded-2xl border border-border shadow-2xl overflow-hidden">
          {/* Header */}
          <div className={`bg-gradient-to-r ${currentStep.gradient} p-6 text-white`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{currentStep.title}</h2>
                  <p className="text-white/80 text-sm">Step {step + 1} of {steps.length}</p>
                </div>
              </div>
              <button
                onClick={onComplete}
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Progress */}
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i <= step ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-muted-foreground mb-6">{currentStep.description}</p>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={step === 0}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>

              <button
                onClick={onComplete}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip Tutorial
              </button>

              <Button
                onClick={nextStep}
                className={`gap-2 bg-gradient-to-r ${currentStep.gradient}`}
              >
                {step === steps.length - 1 ? 'Finish' : 'Next'}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Highlight Indicators */}
      <AnimatePresence>
        {currentStep.highlight === 'bottom' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-16 h-16 rounded-full border-4 border-primary shadow-lg shadow-primary/50"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
