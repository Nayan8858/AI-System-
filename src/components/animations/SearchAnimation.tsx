import { Search } from 'lucide-react';

export const SearchAnimation = () => {
  return (
    <div className="flex items-center justify-center space-x-3 p-6">
      <div className="relative">
        <Search className="w-8 h-8 text-primary animate-pulse-glow" />
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
      </div>
      <div className="flex flex-col">
        <span className="text-foreground font-medium">Searching the web...</span>
        <div className="mt-2 h-1 w-48 bg-muted rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-primary animate-scan rounded-full" />
        </div>
      </div>
    </div>
  );
};
