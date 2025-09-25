import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Link, Upload, Search, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface AttachmentMenuProps {
  onImageUpload: (file: File) => void;
  onImageSearchToggle: () => void;
  imageSearchActive: boolean;
}

const AttachmentMenu: React.FC<AttachmentMenuProps> = ({
  onImageUpload,
  onImageSearchToggle,
  imageSearchActive,
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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSearchToggle = () => {
    onImageSearchToggle();
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
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <Link className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" side="top">
          <div className="flex flex-col space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUploadClick}
              className="justify-start"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSearchToggle}
              className="justify-start"
            >
              <Search className="w-4 h-4 mr-2" />
              Search Image
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