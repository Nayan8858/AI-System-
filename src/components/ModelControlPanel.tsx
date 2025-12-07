import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Bot, Cpu, Code2, Brain, Wand2, Search, Microscope, GraduationCap, Sparkles } from 'lucide-react';

interface ModelConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  enabled: boolean;
}

interface ModelControlPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (enabledModels: string[]) => void;
}

const defaultModels: ModelConfig[] = [
  { id: 'deepseek-v3', name: 'DeepSeek V3.1', description: 'General Q&A & Teaching', icon: Bot, color: 'text-blue-500', enabled: true },
  { id: 'qwen-coder', name: 'Qwen2.5 Coder', description: 'Coding & Debugging', icon: Code2, color: 'text-green-500', enabled: true },
  { id: 'qwen3', name: 'Qwen3 235B', description: 'Complex Reasoning & Math', icon: Brain, color: 'text-purple-500', enabled: true },
  { id: 'llama3', name: 'LLaMA 3.3 70B', description: 'Creative Writing', icon: Wand2, color: 'text-pink-500', enabled: true },
  { id: 'llama4', name: 'LLaMA 4 Scout', description: 'Formal Writing', icon: Sparkles, color: 'text-orange-500', enabled: true },
  { id: 'qwen-vl', name: 'Qwen2.5 VL', description: 'Vision & Image Analysis', icon: Cpu, color: 'text-cyan-500', enabled: true },
  { id: 'gemini', name: 'Gemini 2.0 Flash', description: 'Web Search', icon: Search, color: 'text-yellow-500', enabled: true },
  { id: 'deepseek-r1', name: 'DeepSeek R1 Distill', description: 'Deep Research', icon: Microscope, color: 'text-indigo-500', enabled: true },
];

const ModelControlPanel: React.FC<ModelControlPanelProps> = ({ isOpen, onClose, onSave }) => {
  const [models, setModels] = useState<ModelConfig[]>(defaultModels);

  useEffect(() => {
    // Load saved model preferences from localStorage
    const savedModels = localStorage.getItem('nayandeep_enabled_models');
    if (savedModels) {
      try {
        const enabledIds = JSON.parse(savedModels);
        setModels(prev => prev.map(m => ({ ...m, enabled: enabledIds.includes(m.id) })));
      } catch (e) {
        console.error('Failed to parse saved models:', e);
      }
    }
  }, [isOpen]);

  const toggleModel = (id: string) => {
    setModels(prev => prev.map(m => 
      m.id === id ? { ...m, enabled: !m.enabled } : m
    ));
  };

  const handleSave = () => {
    const enabledIds = models.filter(m => m.enabled).map(m => m.id);
    localStorage.setItem('nayandeep_enabled_models', JSON.stringify(enabledIds));
    onSave(enabledIds);
    onClose();
  };

  const enabledCount = models.filter(m => m.enabled).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-primary" />
            <span>AI Model Control Panel</span>
          </DialogTitle>
          <DialogDescription>
            Enable or disable AI models for multi-routing. ({enabledCount} active)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {models.map((model) => (
            <div 
              key={model.id}
              className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                model.enabled ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  model.enabled ? 'bg-primary/20' : 'bg-muted'
                }`}>
                  <model.icon className={`w-5 h-5 ${model.enabled ? model.color : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <p className={`font-medium ${model.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {model.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{model.description}</p>
                </div>
              </div>
              <Switch 
                checked={model.enabled} 
                onCheckedChange={() => toggleModel(model.id)}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={enabledCount === 0}>
            Save Preferences
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModelControlPanel;
