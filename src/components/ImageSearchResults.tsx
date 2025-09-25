import React from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ImageSearchResultsProps {
  results: any[];
  onDownload: (url: string, quality: string) => void;
}

const ImageSearchResults: React.FC<ImageSearchResultsProps> = ({
  results,
  onDownload,
}) => {
  const openImagePreview = (photo: any) => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80';
    modal.innerHTML = `
      <div class="relative max-w-4xl max-h-full p-4">
        <img src="${photo.src.large}" alt="${photo.alt}" class="max-w-full max-h-full object-contain rounded-lg" />
        <button class="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70">
          ×
        </button>
        <div class="absolute top-2 left-2">
          <div class="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            ${photo.photographer}
          </div>
        </div>
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          <button data-quality="480p" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            480p
          </button>
          <button data-quality="1080p" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            1080p
          </button>
          <button data-quality="4k" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            4K
          </button>
        </div>
      </div>
    `;
    
    // Add event listeners
    const closeBtn = modal.querySelector('button');
    const downloadBtns = modal.querySelectorAll('button[data-quality]');
    
    closeBtn?.addEventListener('click', () => modal.remove());
    
    downloadBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const quality = btn.getAttribute('data-quality');
        let imageUrl = photo.src.large;
        
        switch (quality) {
          case '480p':
            imageUrl = photo.src.small;
            break;
          case '1080p':
            imageUrl = photo.src.large;
            break;
          case '4k':
            imageUrl = photo.src.original;
            break;
        }
        
        onDownload(imageUrl, quality || '1080p');
        modal.remove();
      });
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
    
    document.body.appendChild(modal);
  };

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-3 mt-4 p-4 bg-muted rounded-lg">
      {results.map((photo) => (
        <div
          key={photo.id}
          className="relative group cursor-pointer overflow-hidden rounded-lg"
          onClick={() => openImagePreview(photo)}
        >
          <img
            src={photo.src.medium}
            alt={photo.alt}
            className="w-full h-24 object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          <div className="absolute bottom-1 left-1 right-1">
            <div className="text-xs text-white bg-black/50 px-1 py-0.5 rounded text-center truncate">
              {photo.photographer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageSearchResults;