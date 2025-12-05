import { Loader2, Bot, Brain, Code, PenLine, Search, Image, FileText, Sparkles } from 'lucide-react';

interface AIModelIndicatorProps {
  modelName: string;
  isWorking: boolean;
}

const modelIcons: { [key: string]: React.ReactNode } = {
  'DeepSeek-V3.1': <Bot className="w-4 h-4" />,
  'Qwen2.5-Coder-32B': <Code className="w-4 h-4" />,
  'Qwen3-235B': <Brain className="w-4 h-4" />,
  'LLaMA-4-Scout': <FileText className="w-4 h-4" />,
  'LLaMA-3.3-70B': <PenLine className="w-4 h-4" />,
  'Gemini-2.0-Flash': <Search className="w-4 h-4" />,
  'Qwen2.5-VL-32B': <Image className="w-4 h-4" />,
  'DeepSeek-R1-Distill': <Sparkles className="w-4 h-4" />,
};

const modelColors: { [key: string]: string } = {
  'DeepSeek-V3.1': 'text-blue-500',
  'Qwen2.5-Coder-32B': 'text-green-500',
  'Qwen3-235B': 'text-purple-500',
  'LLaMA-4-Scout': 'text-orange-500',
  'LLaMA-3.3-70B': 'text-pink-500',
  'Gemini-2.0-Flash': 'text-cyan-500',
  'Qwen2.5-VL-32B': 'text-yellow-500',
  'DeepSeek-R1-Distill': 'text-indigo-500',
};

export const AIModelIndicator = ({ modelName, isWorking }: AIModelIndicatorProps) => {
  if (!isWorking) return null;

  const icon = modelIcons[modelName] || <Bot className="w-4 h-4" />;
  const colorClass = modelColors[modelName] || 'text-primary';

  return (
    <div className="flex justify-start animate-fade-in mb-2">
      <div className="flex items-center space-x-2 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full border border-border shadow-sm">
        <div className={`${colorClass} animate-pulse`}>
          {icon}
        </div>
        <span className={`text-sm font-medium ${colorClass}`}>
          {modelName}
        </span>
        <span className="text-muted-foreground text-sm">is working...</span>
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      </div>
    </div>
  );
};
