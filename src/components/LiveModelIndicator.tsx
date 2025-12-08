import React from 'react';
import { Bot, Cpu, Zap, Brain, Sparkles, Globe, Eye, Code } from 'lucide-react';
import { motion } from 'framer-motion';

interface LiveModelIndicatorProps {
  modelName: string;
  isTyping?: boolean;
  action?: 'typing' | 'thinking' | 'searching' | 'analyzing' | 'generating';
}

const modelIcons: Record<string, React.ElementType> = {
  'DeepSeek-V3.1': Brain,
  'Qwen2.5-Coder': Code,
  'Qwen3-235B': Cpu,
  'LLaMA-4-Scout': Zap,
  'LLaMA-3.3-70B': Sparkles,
  'Gemini-2.0-Flash': Globe,
  'DeepSeek-R1-Distill': Brain,
  'Qwen2.5-VL-32B': Eye,
  'Gemini-2.5-Flash': Sparkles,
};

const actionTexts: Record<string, string> = {
  typing: 'typing',
  thinking: 'reasoning',
  searching: 'searching the web',
  analyzing: 'analyzing',
  generating: 'generating',
};

export const LiveModelIndicator: React.FC<LiveModelIndicatorProps> = ({
  modelName,
  isTyping = true,
  action = 'typing',
}) => {
  const Icon = modelIcons[modelName] || Bot;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center space-x-3 p-3 rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg"
    >
      {/* Animated Icon */}
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: action === 'thinking' ? [0, 5, -5, 0] : 0,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center"
        >
          <Icon className="w-5 h-5 text-primary" />
        </motion.div>
        
        {/* Pulse ring */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="absolute inset-0 rounded-full border-2 border-primary/50"
        />
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <span className="font-medium text-sm text-foreground">{modelName}</span>
        <span className="text-xs text-muted-foreground flex items-center">
          is {actionTexts[action]}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="ml-1"
          >
            ...
          </motion.span>
        </span>
      </div>

      {/* Sound wave animation for typing */}
      {isTyping && (
        <div className="flex items-center space-x-0.5 ml-auto">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={{
                height: ['8px', '16px', '8px'],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut",
              }}
              className="w-1 bg-primary rounded-full"
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};
