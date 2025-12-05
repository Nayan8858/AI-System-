import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

const qualityOptions = [
  { label: '512px', size: 512 },
  { label: '1024px', size: 1024 },
  { label: '2048px', size: 2048 },
];

export const ImagePreviewModal = ({ isOpen, onClose, imageUrl }: ImagePreviewModalProps) => {
  const [downloading, setDownloading] = useState<number | null>(null);

  const handleDownload = async (size: number) => {
    setDownloading(size);
    try {
      // For base64 images, we can resize using canvas
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate aspect ratio
        const aspectRatio = img.width / img.height;
        let newWidth = size;
        let newHeight = size;
        
        if (aspectRatio > 1) {
          newHeight = size / aspectRatio;
        } else {
          newWidth = size * aspectRatio;
        }
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `nayandeep-gpt-image-${size}px-${Date.now()}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              
              toast({
                title: "Downloaded",
                description: `Image downloaded at ${size}px quality`,
              });
            }
            setDownloading(null);
          }, 'image/png');
        }
      };
      
      img.onerror = () => {
        // Fallback for external URLs
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `nayandeep-gpt-image-${Date.now()}.png`;
        link.click();
        
        toast({
          title: "Downloaded",
          description: "Image downloaded successfully",
        });
        setDownloading(null);
      };
      
      img.src = imageUrl;
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download image",
        variant: "destructive",
      });
      setDownloading(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle>Image Preview</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden p-4 flex items-center justify-center bg-black/5 dark:bg-black/20">
          <img 
            src={imageUrl} 
            alt="Preview" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>
        
        <div className="p-4 border-t border-border bg-card">
          <p className="text-sm text-muted-foreground mb-3 text-center">Download Quality</p>
          <div className="flex items-center justify-center space-x-3">
            {qualityOptions.map((option) => (
              <Button
                key={option.size}
                variant="outline"
                onClick={() => handleDownload(option.size)}
                disabled={downloading !== null}
                className="min-w-[100px] hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {downloading === option.size ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    {option.label}
                  </>
                )}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
