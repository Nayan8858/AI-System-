import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ImageIcon, Search, Sparkles, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface AttachmentMenuProps {
  onImageUpload: (file: File) => void;
  onImageSearchToggle: () => void;
  imageSearchActive: boolean;
  onModeChange?: (mode: 'image-generator' | 'web-search' | 'deep-research') => void;
}

const AttachmentMenu: React.FC<AttachmentMenuProps> = ({
  onImageUpload,
  onImageSearchToggle,
  imageSearchActive,
  onModeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
      setIsOpen(false);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleModeSelect = (mode: 'image-generator' | 'web-search' | 'deep-research') => {
    onModeChange?.(mode);
    setIsOpen(false);
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-foreground transition-all hover:rotate-90"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2 animate-fade-in" side="top">
          <div className="flex flex-col space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleModeSelect('image-generator')}
              className="justify-start hover:bg-accent transition-colors"
            >
              <ImageIcon className="w-4 h-4 mr-3 text-green-500" />
              Generate Image
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleModeSelect('web-search')}
              className="justify-start hover:bg-accent transition-colors"
            >
              <Search className="w-4 h-4 mr-3 text-blue-500" />
              Web Search
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleModeSelect('deep-research')}
              className="justify-start hover:bg-accent transition-colors"
            >
              <Sparkles className="w-4 h-4 mr-3 text-purple-500" />
              Deep Research
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Image Search Banner */}
      {imageSearchActive && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-800 dark:text-blue-200 text-sm font-medium">
              Search Image Mode
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onImageSearchToggle}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </>
  );
};

export default AttachmentMenu;