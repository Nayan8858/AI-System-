import React, { useRef } from 'react';
import { X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  uploadedImage?: string | null;
  onRemoveImage: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  uploadedImage,
  onRemoveImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {!uploadedImage ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleUploadClick}
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Image</span>
        </Button>
      ) : (
        <div className="relative inline-block">
          <div className="relative group">
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="max-w-32 max-h-32 rounded-lg border border-border object-cover cursor-pointer"
              onClick={() => {
                // Open image preview modal
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80';
                modal.innerHTML = `
                  <div class="relative max-w-4xl max-h-full p-4">
                    <img src="${uploadedImage}" alt="Preview" class="max-w-full max-h-full object-contain rounded-lg" />
                    <button class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                      ×
                    </button>
                    <button class="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                      Delete
                    </button>
                  </div>
                `;
                
                // Add event listeners
                const closeBtn = modal.querySelector('button');
                const deleteBtn = modal.querySelectorAll('button')[1];
                
                closeBtn?.addEventListener('click', () => modal.remove());
                deleteBtn?.addEventListener('click', () => {
                  onRemoveImage();
                  modal.remove();
                });
                modal.addEventListener('click', (e) => {
                  if (e.target === modal) modal.remove();
                });
                
                document.body.appendChild(modal);
              }}
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
              onClick={onRemoveImage}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;