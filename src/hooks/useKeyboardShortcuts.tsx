import { useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface KeyboardShortcutsProps {
  onImageGenerate?: () => void;
  onWebSearch?: () => void;
  onPDFUpload?: () => void;
  onCodeMode?: () => void;
  onRegenerate?: () => void;
  onNewChat?: () => void;
}

export const useKeyboardShortcuts = ({
  onImageGenerate,
  onWebSearch,
  onPDFUpload,
  onCodeMode,
  onRegenerate,
  onNewChat,
}: KeyboardShortcutsProps) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Check if user is typing in an input field
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      // Only allow Ctrl+Enter to send
      if (event.ctrlKey && event.key === 'Enter') {
        // Let the form handle submit
        return;
      }
      // Don't trigger shortcuts while typing
      return;
    }

    // Ctrl/Cmd shortcuts
    if (event.ctrlKey || event.metaKey) {
      switch (event.key.toLowerCase()) {
        case 'i':
          event.preventDefault();
          onImageGenerate?.();
          toast({
            title: "Image Generation Mode",
            description: "Ctrl+I activated",
          });
          break;
        case 'w':
          event.preventDefault();
          onWebSearch?.();
          toast({
            title: "Web Search Mode",
            description: "Ctrl+W activated",
          });
          break;
        case 'p':
          event.preventDefault();
          onPDFUpload?.();
          toast({
            title: "PDF Upload",
            description: "Ctrl+P activated",
          });
          break;
        case 'c':
          // Only if not copying text
          if (!window.getSelection()?.toString()) {
            event.preventDefault();
            onCodeMode?.();
            toast({
              title: "Code Mode",
              description: "Ctrl+C activated",
            });
          }
          break;
        case 'r':
          event.preventDefault();
          onRegenerate?.();
          toast({
            title: "Regenerate",
            description: "Ctrl+R activated",
          });
          break;
        case 'n':
          event.preventDefault();
          onNewChat?.();
          toast({
            title: "New Chat",
            description: "Ctrl+N activated",
          });
          break;
      }
    }
  }, [onImageGenerate, onWebSearch, onPDFUpload, onCodeMode, onRegenerate, onNewChat]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};

export const KeyboardShortcutsHelp = () => {
  const shortcuts = [
    { key: 'Ctrl+I', action: 'Image Generate' },
    { key: 'Ctrl+W', action: 'Web Search' },
    { key: 'Ctrl+P', action: 'PDF Upload' },
    { key: 'Ctrl+C', action: 'Code Mode' },
    { key: 'Ctrl+R', action: 'Regenerate' },
    { key: 'Ctrl+N', action: 'New Chat' },
  ];

  return (
    <div className="p-4 bg-card rounded-xl border border-border">
      <h4 className="font-semibold mb-3 text-sm">Keyboard Shortcuts</h4>
      <div className="grid grid-cols-2 gap-2">
        {shortcuts.map((shortcut) => (
          <div key={shortcut.key} className="flex items-center justify-between text-sm">
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">{shortcut.key}</kbd>
            <span className="text-muted-foreground">{shortcut.action}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
