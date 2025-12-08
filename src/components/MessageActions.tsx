import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  RefreshCw, 
  Bookmark, 
  FileText, 
  Volume2, 
  RotateCcw,
  Search,
  Copy,
  Share2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MessageActionsProps {
  content: string;
  messageId: string;
  onRegenerate: (messageId: string) => void;
  onSaveToLibrary?: (content: string) => void;
}

export const MessageActions: React.FC<MessageActionsProps> = ({
  content,
  messageId,
  onRegenerate,
  onSaveToLibrary,
}) => {
  const handleRewrite = () => {
    onRegenerate(messageId);
    toast({
      title: "Regenerating",
      description: "Creating a new response...",
    });
  };

  const handleSaveToLibrary = () => {
    const savedItems = JSON.parse(localStorage.getItem('nayandeep_library') || '[]');
    savedItems.push({
      id: Date.now().toString(),
      content,
      savedAt: new Date().toISOString(),
      type: 'response'
    });
    localStorage.setItem('nayandeep_library', JSON.stringify(savedItems));
    
    toast({
      title: "Saved to Library",
      description: "Response saved successfully",
    });
    onSaveToLibrary?.(content);
  };

  const handleConvertToPDF = () => {
    // Create a simple PDF-like download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nayandeep_response_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Response saved as text file",
    });
  };

  const handleReadAloud = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(content);
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
      
      toast({
        title: "Reading Aloud",
        description: "Playing audio...",
      });
    } else {
      toast({
        title: "Not Supported",
        description: "Speech synthesis not available in this browser",
        variant: "destructive",
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Response copied to clipboard",
    });
  };

  const handleSearchRelated = () => {
    const searchQuery = content.slice(0, 100);
    window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
  };

  const actions = [
    { icon: RefreshCw, label: 'Rewrite', onClick: handleRewrite },
    { icon: Bookmark, label: 'Save', onClick: handleSaveToLibrary },
    { icon: FileText, label: 'Export', onClick: handleConvertToPDF },
    { icon: Volume2, label: 'Read', onClick: handleReadAloud },
    { icon: RotateCcw, label: 'Regenerate', onClick: handleRewrite },
    { icon: Search, label: 'Search', onClick: handleSearchRelated },
  ];

  return (
    <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-border/50">
      {actions.map((action) => (
        <Button
          key={action.label}
          variant="ghost"
          size="sm"
          onClick={action.onClick}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50"
        >
          <action.icon className="w-3 h-3 mr-1" />
          {action.label}
        </Button>
      ))}
    </div>
  );
};
