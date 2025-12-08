import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Palette } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    background: string;
    accent: string;
  };
}

const themes: Theme[] = [
  {
    id: 'dark-glass',
    name: 'Dark Glass',
    colors: {
      primary: 'hsl(217, 91%, 60%)',
      background: 'hsl(222, 47%, 11%)',
      accent: 'hsl(250, 80%, 60%)',
    }
  },
  {
    id: 'blue-gradient',
    name: 'Blue Gradient',
    colors: {
      primary: 'hsl(210, 100%, 50%)',
      background: 'hsl(220, 30%, 8%)',
      accent: 'hsl(200, 100%, 50%)',
    }
  },
  {
    id: 'cyber-purple',
    name: 'Cyber Purple',
    colors: {
      primary: 'hsl(280, 80%, 60%)',
      background: 'hsl(270, 50%, 8%)',
      accent: 'hsl(320, 80%, 60%)',
    }
  },
  {
    id: 'minimal-white',
    name: 'Minimal White',
    colors: {
      primary: 'hsl(217, 91%, 54%)',
      background: 'hsl(0, 0%, 98%)',
      accent: 'hsl(142, 71%, 45%)',
    }
  },
  {
    id: 'amoled-black',
    name: 'AMOLED Black',
    colors: {
      primary: 'hsl(217, 91%, 60%)',
      background: 'hsl(0, 0%, 0%)',
      accent: 'hsl(280, 80%, 60%)',
    }
  },
];

interface ThemeSelectorProps {
  currentTheme?: string;
  onThemeChange?: (themeId: string) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme = 'dark-glass',
  onThemeChange,
}) => {
  const handleThemeSelect = (themeId: string) => {
    onThemeChange?.(themeId);
    localStorage.setItem('nayandeep_theme', themeId);
    
    // Apply theme (simplified - in production, update CSS variables)
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      document.documentElement.style.setProperty('--primary', theme.colors.primary);
      
      if (themeId === 'minimal-white') {
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
      }
    }
    
    toast({
      title: "Theme Changed",
      description: `Switched to ${theme?.name}`,
    });
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center space-x-2">
          <Palette className="w-4 h-4" />
          <span>Theme</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeSelect(theme.id)}
              className={`relative flex flex-col items-center p-2 rounded-lg transition-all hover:scale-105 ${
                currentTheme === theme.id ? 'ring-2 ring-primary' : ''
              }`}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-border flex">
                <div className="w-1/2 h-full" style={{ backgroundColor: theme.colors.background }} />
                <div className="w-1/2 h-full" style={{ backgroundColor: theme.colors.primary }} />
              </div>
              <span className="text-[10px] mt-1 text-muted-foreground">{theme.name}</span>
              {currentTheme === theme.id && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
