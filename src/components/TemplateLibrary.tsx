import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Video, Globe, Palette, BookOpen, Code, Mail, Calculator, Lightbulb } from 'lucide-react';

interface Template {
  id: string;
  title: string;
  icon: any;
  prompt: string;
  category: string;
}

const templates: Template[] = [
  { id: '1', title: 'Create Resume', icon: FileText, prompt: 'Help me create a professional resume with my work experience and skills', category: 'Professional' },
  { id: '2', title: 'YouTube Script', icon: Video, prompt: 'Write an engaging YouTube video script about', category: 'Content' },
  { id: '3', title: 'Landing Page', icon: Globe, prompt: 'Create a complete HTML/CSS/JS landing page for', category: 'Development' },
  { id: '4', title: 'Logo Design', icon: Palette, prompt: 'Generate creative logo design ideas for', category: 'Design' },
  { id: '5', title: 'Science Report', icon: BookOpen, prompt: 'Help me write a detailed science project report on', category: 'Education' },
  { id: '6', title: 'Debug Code', icon: Code, prompt: 'Help me debug and fix issues in my code:', category: 'Development' },
  { id: '7', title: 'Email Writer', icon: Mail, prompt: 'Write a professional email for', category: 'Professional' },
  { id: '8', title: 'Math Solver', icon: Calculator, prompt: 'Help me solve this math problem step by step:', category: 'Education' },
  { id: '9', title: 'Ideas Generator', icon: Lightbulb, prompt: 'Generate creative ideas for', category: 'Creative' }
];

interface TemplateLibraryProps {
  onSelectTemplate: (prompt: string) => void;
}

export const TemplateLibrary = ({ onSelectTemplate }: TemplateLibraryProps) => {
  const [showAll, setShowAll] = useState(false);
  const displayedTemplates = showAll ? templates : templates.slice(0, 9);

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <h2 className="text-xl font-semibold text-foreground mb-4">Quick Start Templates</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayedTemplates.map((template) => {
          const Icon = template.icon;
          return (
            <Card
              key={template.id}
              className="p-4 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card/80 backdrop-blur-sm border-border"
              onClick={() => onSelectTemplate(template.prompt)}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground text-sm mb-1">{template.title}</h3>
                  <p className="text-xs text-muted-foreground">{template.category}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      
      {templates.length > 9 && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="min-w-[140px]"
          >
            {showAll ? 'Show Less' : 'Show More'}
          </Button>
        </div>
      )}
    </div>
  );
};
