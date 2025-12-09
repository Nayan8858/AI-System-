import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Briefcase, GraduationCap, Sparkles } from 'lucide-react';
import type { OnboardingData } from '../OnboardingFlow';

interface BackgroundStepProps {
  data: OnboardingData;
  onUpdate: (updates: Partial<OnboardingData>) => void;
}

const professions = ['Student', 'Software Developer', 'Designer', 'Writer', 'Marketer', 'Business Owner', 'Researcher', 'Teacher', 'Healthcare', 'Other'];
const educationLevels = ['High School', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 'Self-taught', 'Other'];
const aiComfortLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Hindi', 'Arabic', 'Portuguese', 'Other'];
const interestOptions = ['Technology', 'Science', 'Art', 'Music', 'Sports', 'Gaming', 'Finance', 'Health', 'Travel', 'Food', 'Education', 'Business'];

export const BackgroundStep: React.FC<BackgroundStepProps> = ({ data, onUpdate }) => {
  const toggleInterest = (interest: string) => {
    const current = data.interests || [];
    const updated = current.includes(interest)
      ? current.filter(i => i !== interest)
      : [...current, interest];
    onUpdate({ interests: updated });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Briefcase className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold">Your Background</h2>
        <p className="text-muted-foreground text-sm">Help us understand your expertise</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Profession
          </Label>
          <Select value={data.profession} onValueChange={(value) => onUpdate({ profession: value })}>
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder="Select profession" />
            </SelectTrigger>
            <SelectContent>
              {professions.map((prof) => (
                <SelectItem key={prof} value={prof}>{prof}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Education Level
          </Label>
          <Select value={data.educationLevel} onValueChange={(value) => onUpdate({ educationLevel: value })}>
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder="Select education" />
            </SelectTrigger>
            <SelectContent>
              {educationLevels.map((edu) => (
                <SelectItem key={edu} value={edu}>{edu}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI Comfort Level
          </Label>
          <Select value={data.aiComfortLevel} onValueChange={(value) => onUpdate({ aiComfortLevel: value })}>
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {aiComfortLevels.map((level) => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Preferred Language</Label>
          <Select value={data.preferredLanguage} onValueChange={(value) => onUpdate({ preferredLanguage: value })}>
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Interests (Select multiple)</Label>
        <div className="flex flex-wrap gap-2 p-3 bg-background/30 rounded-lg border border-border/50">
          {interestOptions.map((interest) => (
            <Badge
              key={interest}
              variant={data.interests?.includes(interest) ? 'default' : 'outline'}
              className="cursor-pointer transition-all hover:scale-105"
              onClick={() => toggleInterest(interest)}
            >
              {interest}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
