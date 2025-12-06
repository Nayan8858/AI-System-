import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  Plus, 
  Camera, 
  Image as ImageIcon, 
  FileText, 
  Bot, 
  Sparkles, 
  Search, 
  Globe, 
  GraduationCap,
  X
} from 'lucide-react';

interface ToolPanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onImageUpload: (file: File) => void;
  onCameraCapture: () => void;
  onPDFUpload?: (file: File) => void;
  onModeChange?: (mode: 'image-generator' | 'web-search' | 'deep-research' | 'study') => void;
  onModelSelect?: () => void;
}

const ToolPanel: React.FC<ToolPanelProps> = ({
  isOpen,
  onOpenChange,
  onImageUpload,
  onCameraCapture,
  onPDFUpload,
  onModeChange,
  onModelSelect,
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
      onOpenChange(false);
    }
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
      onOpenChange(false);
    }
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handlePDFSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onPDFUpload?.(file);
      onOpenChange(false);
    }
    if (pdfInputRef.current) pdfInputRef.current.value = '';
  };

  const topActions = [
    { 
      icon: Camera, 
      label: 'Camera', 
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
      onClick: () => cameraInputRef.current?.click()
    },
    { 
      icon: ImageIcon, 
      label: 'Photos', 
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      onClick: () => imageInputRef.current?.click()
    },
    { 
      icon: FileText, 
      label: 'Files', 
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      onClick: () => pdfInputRef.current?.click()
    },
  ];

  const listActions = [
    { 
      icon: Bot, 
      label: 'Model', 
      description: 'Select AI model',
      onClick: () => { onModelSelect?.(); onOpenChange(false); }
    },
    { 
      icon: Sparkles, 
      label: 'Create Image', 
      description: 'Generate AI images',
      onClick: () => { onModeChange?.('image-generator'); onOpenChange(false); }
    },
    { 
      icon: Search, 
      label: 'Deep Research', 
      description: 'In-depth analysis',
      onClick: () => { onModeChange?.('deep-research'); onOpenChange(false); }
    },
    { 
      icon: Globe, 
      label: 'Web Search', 
      description: 'Search the internet',
      onClick: () => { onModeChange?.('web-search'); onOpenChange(false); }
    },
    { 
      icon: GraduationCap, 
      label: 'Study & Learn', 
      description: 'Educational assistant',
      onClick: () => { onModeChange?.('study'); onOpenChange(false); }
    },
  ];

  return (
    <>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraCapture}
        className="hidden"
      />
      <input
        ref={pdfInputRef}
        type="file"
        accept="application/pdf"
        onChange={handlePDFSelect}
        className="hidden"
      />

      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-foreground transition-all hover:rotate-90"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-auto max-h-[70vh] rounded-t-3xl border-t border-border bg-card/95 backdrop-blur-xl">
          <SheetHeader className="pb-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg font-semibold">Tools</SheetTitle>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </SheetHeader>

          {/* Top Row - Quick Actions */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {topActions.map((action) => (
              <button
                key={action.label}
                onClick={action.onClick}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl ${action.bgColor} hover:scale-105 transition-all duration-200`}
              >
                <action.icon className={`w-6 h-6 ${action.color} mb-2`} />
                <span className="text-sm font-medium text-foreground">{action.label}</span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-border mb-4" />

          {/* List Actions */}
          <div className="space-y-2">
            {listActions.map((action) => (
              <button
                key={action.label}
                onClick={action.onClick}
                className="w-full flex items-center space-x-4 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <action.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{action.label}</p>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ToolPanel;