import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Edit2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ChatTab {
  id: string;
  title: string;
  icon: string;
  messages: any[];
}

interface ChatTabsProps {
  tabs: ChatTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onNewTab: () => void;
  onCloseTab: (tabId: string) => void;
  onRenameTab: (tabId: string, newTitle: string) => void;
}

export const ChatTabs = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  onNewTab, 
  onCloseTab,
  onRenameTab 
}: ChatTabsProps) => {
  const [editingTab, setEditingTab] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEditing = (tab: ChatTab) => {
    setEditingTab(tab.id);
    setEditValue(tab.title);
  };

  const finishEditing = () => {
    if (editingTab && editValue.trim()) {
      onRenameTab(editingTab, editValue.trim());
    }
    setEditingTab(null);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 px-4 border-b border-border bg-background/50 backdrop-blur-sm">
      <AnimatePresence mode="popLayout">
        {tabs.map((tab) => (
          <motion.div
            key={tab.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`
              group relative flex items-center gap-2 px-4 py-2 rounded-t-lg
              transition-all duration-200 min-w-[150px] max-w-[200px]
              ${activeTab === tab.id 
                ? 'bg-card border-2 border-b-0 border-primary shadow-lg scale-105' 
                : 'bg-muted/50 hover:bg-muted border border-border'
              }
            `}
          >
            <span className="text-lg">{tab.icon}</span>
            
            {editingTab === tab.id ? (
              <div className="flex items-center gap-1 flex-1">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') finishEditing();
                    if (e.key === 'Escape') setEditingTab(null);
                  }}
                  className="h-6 text-xs"
                  autoFocus
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={finishEditing}
                >
                  <Check className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onTabChange(tab.id)}
                  className="flex-1 text-left text-sm font-medium truncate"
                >
                  {tab.title}
                </button>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(tab);
                    }}
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  {tabs.length > 1 && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseTab(tab.id);
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      <Button
        size="icon"
        variant="outline"
        onClick={onNewTab}
        className="shrink-0 rounded-full"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
};
