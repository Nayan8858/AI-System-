import { Loader2, Bot, Brain, Code, PenLine, Search, Image, FileText, Sparkles, Clock, DollarSign } from 'lucide-react';

interface AIModelIndicatorProps {
  modelName: string;
  isWorking: boolean;
  responseTime?: number;
  estimatedCost?: number;
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

const modelBgColors: { [key: string]: string } = {
  'DeepSeek-V3.1': 'bg-blue-500/10',
  'Qwen2.5-Coder-32B': 'bg-green-500/10',
  'Qwen3-235B': 'bg-purple-500/10',
  'LLaMA-4-Scout': 'bg-orange-500/10',
  'LLaMA-3.3-70B': 'bg-pink-500/10',
  'Gemini-2.0-Flash': 'bg-cyan-500/10',
  'Qwen2.5-VL-32B': 'bg-yellow-500/10',
  'DeepSeek-R1-Distill': 'bg-indigo-500/10',
};

export const AIModelIndicator = ({ modelName, isWorking, responseTime, estimatedCost }: AIModelIndicatorProps) => {
  if (!isWorking) return null;

  const icon = modelIcons[modelName] || <Bot className="w-4 h-4" />;
  const colorClass = modelColors[modelName] || 'text-primary';
  const bgClass = modelBgColors[modelName] || 'bg-primary/10';

  return (
    <div className="flex justify-start animate-fade-in mb-3">
      <div className={`flex items-center space-x-3 px-4 py-3 ${bgClass} backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg`}>
        <div className={`p-2 rounded-full ${bgClass} ${colorClass}`}>
          {icon}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-semibold ${colorClass}`}>
              {modelName}
            </span>
            <span className="text-muted-foreground text-xs">is working...</span>
          </div>
          <div className="flex items-center space-x-3 text-xs text-muted-foreground mt-1">
            {responseTime && (
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{responseTime}ms</span>
              </span>
            )}
            {estimatedCost && (
              <span className="flex items-center space-x-1">
                <DollarSign className="w-3 h-3" />
                <span>${estimatedCost.toFixed(4)}</span>
              </span>
            )}
          </div>
        </div>
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground ml-2" />
      </div>
    </div>
  );
};

// Model badge for completed messages
export const ModelBadge = ({ modelName, wordCount }: { modelName: string; wordCount?: number }) => {
  const colorClass = modelColors[modelName] || 'text-primary';
  const bgClass = modelBgColors[modelName] || 'bg-primary/10';
  const icon = modelIcons[modelName] || <Bot className="w-3 h-3" />;

  return (
    <div className="flex items-center space-x-2 mt-2">
      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${bgClass} ${colorClass} text-xs`}>
        {icon}
        <span>Powered by {modelName}</span>
      </div>
      {wordCount && (
        <span className="text-xs text-muted-foreground">
          {wordCount} words
        </span>
      )}
    </div>
  );
};