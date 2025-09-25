import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Image as ImageIcon, 
  Search, 
  Globe 
} from 'lucide-react';
import { ChatMode } from '@/hooks/useAdvancedChat';

interface ChatModeSelectorProps {
  currentMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
}

const ChatModeSelector: React.FC<ChatModeSelectorProps> = ({
  currentMode,
  onModeChange,
}) => {
  const modes = [
    {
      id: 'reasoning' as ChatMode,
      icon: Brain,
      label: 'Reasoning',
      description: 'Critical thinking and in-depth analysis',
      color: 'text-purple-500',
      activeColor: 'bg-purple-500',
    },
    {
      id: 'image-generator' as ChatMode,
      icon: ImageIcon,
      label: 'Image Generator',
      description: 'Generate images from text prompts',
      color: 'text-green-500',
      activeColor: 'bg-green-500',
    },
    {
      id: 'deep-research' as ChatMode,
      icon: Search,
      label: 'Deep Research',
      description: 'Combine knowledge with internet research',
      color: 'text-blue-500',
      activeColor: 'bg-blue-500',
    },
    {
      id: 'web-search' as ChatMode,
      icon: Globe,
      label: 'Web Search',
      description: 'Dedicated web search functionality',
      color: 'text-orange-500',
      activeColor: 'bg-orange-500',
    },
  ];

  return (
    <div className="flex flex-col space-y-3 p-3">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = currentMode === mode.id;
        
        return (
          <Button
            key={mode.id}
            variant="ghost"
            size="icon"
            className={`
              w-10 h-10 relative transition-all duration-200
              ${isActive 
                ? `${mode.activeColor} text-white hover:${mode.activeColor}/90` 
                : `text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${mode.color}`
              }
            `}
            title={`${mode.label}: ${mode.description}`}
            onClick={() => onModeChange(isActive ? 'normal' : mode.id)}
          >
            <Icon className="w-4 h-4" />
            {isActive && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-current" />
            )}
          </Button>
        );
      })}
    </div>
  );
};

export default ChatModeSelector;