import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { BackgroundStep } from './steps/BackgroundStep';
import { UsageIntentStep } from './steps/UsageIntentStep';
import { CommunicationStep } from './steps/CommunicationStep';
import { MemoryStep } from './steps/MemoryStep';
import { SummaryStep } from './steps/SummaryStep';

export interface OnboardingData {
  fullName: string;
  preferredName: string;
  ageGroup: string;
  gender: string;
  country: string;
  timezone: string;
  profession: string;
  educationLevel: string;
  aiComfortLevel: string;
  preferredLanguage: string;
  interests: string[];
  usageIntents: string[];
  communicationTone: string;
  responseDepth: string;
  preferredCodingLanguage: string;
  memoryEnabled: boolean;
  recurringTasks: string[];
  frequentSubjects: string[];
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    fullName: '',
    preferredName: '',
    ageGroup: '',
    gender: '',
    country: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    profession: '',
    educationLevel: '',
    aiComfortLevel: '',
    preferredLanguage: 'English',
    interests: [],
    usageIntents: [],
    communicationTone: 'friendly',
    responseDepth: 'detailed',
    preferredCodingLanguage: 'JavaScript',
    memoryEnabled: true,
    recurringTasks: [],
    frequentSubjects: [],
  });

  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = () => {
    onComplete(data);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <BasicInfoStep data={data} onUpdate={updateData} />;
      case 2:
        return <BackgroundStep data={data} onUpdate={updateData} />;
      case 3:
        return <UsageIntentStep data={data} onUpdate={updateData} />;
      case 4:
        return <CommunicationStep data={data} onUpdate={updateData} />;
      case 5:
        return <MemoryStep data={data} onUpdate={updateData} />;
      case 6:
        return <SummaryStep data={data} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl"
    >
      <div className="w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
          >
            Welcome to NayandeepGPT
          </motion.h1>
          <p className="text-muted-foreground mt-2">Step {step} of {totalSteps}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <motion.div
          className="bg-card/50 backdrop-blur-md rounded-2xl border border-border/50 p-8 shadow-xl"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={step === 1}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          
          {step < totalSteps ? (
            <Button onClick={nextStep} className="gap-2 bg-primary hover:bg-primary/90">
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleComplete} className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90">
              Complete Setup
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
