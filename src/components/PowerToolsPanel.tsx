import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { 
  FileEdit,
  MessageSquare,
  Search,
  Newspaper,
  Code2,
  Bug,
  Image,
  Layout,
  BookOpen,
  X,
  Wand2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PowerToolsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onToolSelect: (tool: string, prompt: string) => void;
}

export const PowerToolsPanel: React.FC<PowerToolsPanelProps> = ({
  isOpen,
  onClose,
  onToolSelect,
}) => {
  const tools = [
    {
      icon: FileEdit,
      name: 'Text Fixer',
      description: 'Fix grammar and spelling',
      prompt: 'Please fix the grammar, spelling, and punctuation in the following text: ',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: MessageSquare,
      name: 'Tone Changer',
      description: 'Change writing tone',
      prompt: 'Please rewrite the following text in a professional/casual/friendly tone: ',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      icon: Search,
      name: 'SEO Writer',
      description: 'SEO-optimized content',
      prompt: 'Write SEO-optimized content about: ',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      icon: Newspaper,
      name: 'Blog Builder',
      description: 'Create blog posts',
      prompt: 'Write a detailed blog post about: ',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      icon: Code2,
      name: 'Code Explainer',
      description: 'Explain code snippets',
      prompt: 'Please explain this code in detail: ',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10'
    },
    {
      icon: Bug,
      name: 'Bug Finder',
      description: 'Find code bugs',
      prompt: 'Find bugs and issues in this code: ',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
    {
      icon: Image,
      name: 'Image to UI',
      description: 'Convert image to UI code',
      prompt: 'Analyze this UI image and generate the code: ',
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10'
    },
    {
      icon: Layout,
      name: 'UI to Code',
      description: 'Design to code',
      prompt: 'Convert this UI design description to code: ',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10'
    },
    {
      icon: BookOpen,
      name: 'Smart Reader',
      description: 'Analyze documents',
      prompt: 'Please analyze and summarize this document: ',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    },
  ];

  const handleToolClick = (tool: typeof tools[0]) => {
    onToolSelect(tool.name, tool.prompt);
    onClose();
    toast({
      title: `${tool.name} Activated`,
      description: tool.description,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-auto max-h-[80vh] rounded-t-3xl border-t border-border bg-card/95 backdrop-blur-xl">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center space-x-2">
              <Wand2 className="w-5 h-5 text-primary" />
              <span>Power Tools</span>
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="grid grid-cols-3 gap-3 pb-4">
          {tools.map((tool) => (
            <button
              key={tool.name}
              onClick={() => handleToolClick(tool)}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl ${tool.bgColor} hover:scale-105 transition-all duration-200`}
            >
              <tool.icon className={`w-6 h-6 ${tool.color} mb-2`} />
              <span className="text-xs font-medium text-foreground text-center">{tool.name}</span>
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
