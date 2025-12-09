import React from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Code, BookOpen, PenTool, Briefcase, Search, Image, FileText, Bot } from 'lucide-react';
import type { OnboardingData } from '../OnboardingFlow';

interface UsageIntentStepProps {
  data: OnboardingData;
  onUpdate: (updates: Partial<OnboardingData>) => void;
}

const usageOptions = [
  { id: 'coding', label: 'Coding & Development', icon: Code },
  { id: 'study', label: 'Study & Learning', icon: BookOpen },
  { id: 'seo-writing', label: 'SEO & Content Writing', icon: PenTool },
  { id: 'business', label: 'Business & Marketing', icon: Briefcase },
  { id: 'research', label: 'Research & Analysis', icon: Search },
  { id: 'image-tasks', label: 'Image Generation & Editing', icon: Image },
  { id: 'pdf-tasks', label: 'PDF & Document Analysis', icon: FileText },
  { id: 'daily-assistant', label: 'Daily AI Assistant', icon: Bot },
];

export const UsageIntentStep: React.FC<UsageIntentStepProps> = ({ data, onUpdate }) => {
  const toggleIntent = (intent: string) => {
    const current = data.usageIntents || [];
    const updated = current.includes(intent)
      ? current.filter(i => i !== intent)
      : [...current, intent];
    onUpdate({ usageIntents: updated });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Bot className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold">How Will You Use NayandeepGPT?</h2>
        <p className="text-muted-foreground text-sm">Select all that apply</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {usageOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = data.usageIntents?.includes(option.id);
          
          return (
            <button
              key={option.id}
              onClick={() => toggleIntent(option.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                isSelected
                  ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                  : 'border-border/50 bg-background/30 hover:border-primary/50 hover:bg-primary/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {option.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-center text-muted-foreground text-sm">
        Selected: {data.usageIntents?.length || 0} options
      </p>
    </div>
  );
};
