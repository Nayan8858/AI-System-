import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, User, Briefcase, Bot, MessageSquare, Brain } from 'lucide-react';
import type { OnboardingData } from '../OnboardingFlow';

interface SummaryStepProps {
  data: OnboardingData;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({ data }) => {
  const sections = [
    {
      icon: User,
      title: 'Basic Info',
      items: [
        { label: 'Name', value: data.preferredName || data.fullName || 'Not provided' },
        { label: 'Age Group', value: data.ageGroup || 'Not specified' },
        { label: 'Country', value: data.country || 'Not specified' },
        { label: 'Timezone', value: data.timezone || 'Auto-detected' },
      ],
    },
    {
      icon: Briefcase,
      title: 'Background',
      items: [
        { label: 'Profession', value: data.profession || 'Not specified' },
        { label: 'Education', value: data.educationLevel || 'Not specified' },
        { label: 'AI Level', value: data.aiComfortLevel || 'Not specified' },
        { label: 'Language', value: data.preferredLanguage || 'English' },
      ],
    },
    {
      icon: Bot,
      title: 'Usage Intent',
      items: [
        { label: 'Primary Uses', value: data.usageIntents?.length ? data.usageIntents.join(', ') : 'Not selected' },
      ],
    },
    {
      icon: MessageSquare,
      title: 'Communication',
      items: [
        { label: 'Tone', value: data.communicationTone || 'Friendly' },
        { label: 'Depth', value: data.responseDepth || 'Detailed' },
        { label: 'Coding Lang', value: data.preferredCodingLanguage || 'JavaScript' },
      ],
    },
    {
      icon: Brain,
      title: 'Memory',
      items: [
        { label: 'Memory Enabled', value: data.memoryEnabled ? 'Yes' : 'No' },
        { label: 'Recurring Tasks', value: data.recurringTasks?.length || 0 },
        { label: 'Subjects', value: data.frequentSubjects?.length || 0 },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-xl font-semibold">Review Your Setup</h2>
        <p className="text-muted-foreground text-sm">Confirm your preferences before continuing</p>
      </div>

      <div className="grid gap-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="p-4 rounded-xl bg-background/30 border border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4 text-primary" />
                <h3 className="font-medium text-sm">{section.title}</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {section.items.map((item) => (
                  <div key={item.label} className="text-sm">
                    <span className="text-muted-foreground">{item.label}: </span>
                    <span className="text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {data.interests && data.interests.length > 0 && (
        <div className="p-4 rounded-xl bg-background/30 border border-border/50">
          <p className="text-sm text-muted-foreground mb-2">Interests</p>
          <div className="flex flex-wrap gap-1">
            {data.interests.map((interest) => (
              <Badge key={interest} variant="secondary" className="text-xs">{interest}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
