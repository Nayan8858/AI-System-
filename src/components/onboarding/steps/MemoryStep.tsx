import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Brain, ListTodo, Bookmark } from 'lucide-react';
import type { OnboardingData } from '../OnboardingFlow';

interface MemoryStepProps {
  data: OnboardingData;
  onUpdate: (updates: Partial<OnboardingData>) => void;
}

const taskOptions = ['Daily Summary', 'Code Reviews', 'Writing Assistance', 'Research Help', 'Meeting Notes', 'Learning Sessions'];
const subjectOptions = ['Programming', 'Mathematics', 'Science', 'Languages', 'History', 'Business', 'Art & Design', 'Music', 'Health', 'Technology'];

export const MemoryStep: React.FC<MemoryStepProps> = ({ data, onUpdate }) => {
  const toggleTask = (task: string) => {
    const current = data.recurringTasks || [];
    const updated = current.includes(task)
      ? current.filter(t => t !== task)
      : [...current, task];
    onUpdate({ recurringTasks: updated });
  };

  const toggleSubject = (subject: string) => {
    const current = data.frequentSubjects || [];
    const updated = current.includes(subject)
      ? current.filter(s => s !== subject)
      : [...current, subject];
    onUpdate({ frequentSubjects: updated });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Brain className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold">Memory & Preferences</h2>
        <p className="text-muted-foreground text-sm">Personalize your AI experience</p>
      </div>

      <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium">Enable AI Memory</p>
              <p className="text-xs text-muted-foreground">AI will remember your preferences and past conversations</p>
            </div>
          </div>
          <Switch
            checked={data.memoryEnabled}
            onCheckedChange={(checked) => onUpdate({ memoryEnabled: checked })}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <ListTodo className="w-4 h-4" />
          Recurring Tasks
        </Label>
        <div className="flex flex-wrap gap-2 p-3 bg-background/30 rounded-lg border border-border/50">
          {taskOptions.map((task) => (
            <Badge
              key={task}
              variant={data.recurringTasks?.includes(task) ? 'default' : 'outline'}
              className="cursor-pointer transition-all hover:scale-105"
              onClick={() => toggleTask(task)}
            >
              {task}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Bookmark className="w-4 h-4" />
          Frequent Subjects
        </Label>
        <div className="flex flex-wrap gap-2 p-3 bg-background/30 rounded-lg border border-border/50">
          {subjectOptions.map((subject) => (
            <Badge
              key={subject}
              variant={data.frequentSubjects?.includes(subject) ? 'default' : 'outline'}
              className="cursor-pointer transition-all hover:scale-105"
              onClick={() => toggleSubject(subject)}
            >
              {subject}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
