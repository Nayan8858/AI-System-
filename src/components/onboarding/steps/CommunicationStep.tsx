import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, AlignLeft, Code2 } from 'lucide-react';

interface OnboardingData {
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

interface CommunicationStepProps {
  data: OnboardingData;
  onUpdate: (updates: Partial<OnboardingData>) => void;
}

const toneOptions = [
  { value: 'friendly', label: 'Friendly', description: 'Casual and warm' },
  { value: 'professional', label: 'Professional', description: 'Formal and business-like' },
  { value: 'direct', label: 'Direct', description: 'Straight to the point' },
  { value: 'mixed', label: 'Mixed', description: 'Adaptive based on context' },
];

const depthOptions = [
  { value: 'short', label: 'Short', description: 'Brief and concise answers' },
  { value: 'detailed', label: 'Detailed', description: 'Comprehensive explanations' },
  { value: 'step-by-step', label: 'Step-by-Step', description: 'Break down into steps' },
  { value: 'examples', label: 'With Examples', description: 'Include practical examples' },
];

const codingLanguages = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin'];

export const CommunicationStep: React.FC<CommunicationStepProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold">Communication Style</h2>
        <p className="text-muted-foreground text-sm">How should AI respond to you?</p>
      </div>

      <div className="space-y-4">
        <Label className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Preferred Tone
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {toneOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onUpdate({ communicationTone: option.value })}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                data.communicationTone === option.value
                  ? 'border-primary bg-primary/10'
                  : 'border-border/50 bg-background/30 hover:border-primary/50'
              }`}
            >
              <p className="font-medium">{option.label}</p>
              <p className="text-xs text-muted-foreground">{option.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="flex items-center gap-2">
          <AlignLeft className="w-4 h-4" />
          Response Depth
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {depthOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onUpdate({ responseDepth: option.value })}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                data.responseDepth === option.value
                  ? 'border-primary bg-primary/10'
                  : 'border-border/50 bg-background/30 hover:border-primary/50'
              }`}
            >
              <p className="font-medium">{option.label}</p>
              <p className="text-xs text-muted-foreground">{option.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Code2 className="w-4 h-4" />
          Preferred Coding Language
        </Label>
        <Select value={data.preferredCodingLanguage} onValueChange={(value) => onUpdate({ preferredCodingLanguage: value })}>
          <SelectTrigger className="bg-background/50">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {codingLanguages.map((lang) => (
              <SelectItem key={lang} value={lang}>{lang}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
