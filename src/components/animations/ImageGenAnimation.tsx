import { Paintbrush } from 'lucide-react';

export const ImageGenAnimation = () => {
  return (
    <div className="flex items-center justify-center space-x-3 p-6">
      <div className="relative w-12 h-12">
        <Paintbrush className="w-8 h-8 text-purple-500 animate-brush-stroke absolute inset-0 m-auto" />
        <div className="absolute inset-0 rounded-full animate-pulse-glow" 
             style={{ background: 'var(--image-gen-glow)' }} />
      </div>
      <div className="flex flex-col">
        <span className="text-foreground font-medium">🎨 Painting your image...</span>
        <p className="text-sm text-muted-foreground mt-1">Creating something beautiful</p>
      </div>
    </div>
  );
};
