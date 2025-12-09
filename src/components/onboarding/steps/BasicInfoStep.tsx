import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Globe, Clock } from 'lucide-react';
import type { OnboardingData } from '../OnboardingFlow';

interface BasicInfoStepProps {
  data: OnboardingData;
  onUpdate: (updates: Partial<OnboardingData>) => void;
}

const ageGroups = ['Under 18', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
const countries = ['United States', 'India', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'Brazil', 'Other'];

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold">Basic Information</h2>
        <p className="text-muted-foreground text-sm">Tell us about yourself</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={data.fullName}
            onChange={(e) => onUpdate({ fullName: e.target.value })}
            placeholder="Enter your full name"
            className="bg-background/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="preferredName">Preferred Name</Label>
          <Input
            id="preferredName"
            value={data.preferredName}
            onChange={(e) => onUpdate({ preferredName: e.target.value })}
            placeholder="What should we call you?"
            className="bg-background/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Age Group</Label>
          <Select value={data.ageGroup} onValueChange={(value) => onUpdate({ ageGroup: value })}>
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder="Select age group" />
            </SelectTrigger>
            <SelectContent>
              {ageGroups.map((age) => (
                <SelectItem key={age} value={age}>{age}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Gender (Optional)</Label>
          <Select value={data.gender} onValueChange={(value) => onUpdate({ gender: value })}>
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="non-binary">Non-binary</SelectItem>
              <SelectItem value="prefer-not">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Country
          </Label>
          <Select value={data.country} onValueChange={(value) => onUpdate({ country: value })}>
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Timezone
          </Label>
          <Input
            value={data.timezone}
            onChange={(e) => onUpdate({ timezone: e.target.value })}
            placeholder="Auto-detected"
            className="bg-background/50"
          />
        </div>
      </div>
    </div>
  );
};
