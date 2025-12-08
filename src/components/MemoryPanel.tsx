import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Brain, Trash2, Clock, Palette, MessageSquare, FolderOpen } from 'lucide-react';
import { getMemory, saveMemory, clearMemory, MemoryData } from '@/utils/memorySystem';
import { toast } from '@/hooks/use-toast';

interface MemoryPanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MemoryPanel: React.FC<MemoryPanelProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const [memory, setMemory] = useState<MemoryData | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMemory(getMemory());
    }
  }, [isOpen]);

  const handleClearMemory = () => {
    clearMemory();
    setMemory(getMemory());
    toast({
      title: "Memory Cleared",
      description: "All preferences and history have been reset.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-80 bg-card/95 backdrop-blur-xl border-l border-border">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-primary" />
            <span>Memory & Preferences</span>
          </SheetTitle>
        </SheetHeader>

        {memory && (
          <div className="space-y-6">
            {/* User Info */}
            <div className="p-4 rounded-xl bg-muted/30">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">
                    {memory.userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{memory.userName}</p>
                  <p className="text-xs text-muted-foreground">Active User</p>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Preferences</h4>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div className="flex items-center space-x-2">
                  <Palette className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">Theme</span>
                </div>
                <span className="text-sm text-muted-foreground capitalize">{memory.preferredTheme}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Tone</span>
                </div>
                <span className="text-sm text-muted-foreground capitalize">{memory.preferredTone}</span>
              </div>
            </div>

            {/* Activity */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Activity</h4>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Last Active</span>
                </div>
                <span className="text-xs text-muted-foreground">{formatDate(memory.lastActivity)}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div className="flex items-center space-x-2">
                  <FolderOpen className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">Projects</span>
                </div>
                <span className="text-sm text-muted-foreground">{memory.projectsCount}</span>
              </div>
            </div>

            {/* Recent Conversations */}
            {memory.conversationsSummary.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Recent Topics</h4>
                <div className="space-y-2">
                  {memory.conversationsSummary.map((summary, index) => (
                    <div key={index} className="p-2 rounded-lg bg-muted/20 text-sm text-muted-foreground truncate">
                      {summary}...
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clear Memory */}
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={handleClearMemory}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Memory
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
