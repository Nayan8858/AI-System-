import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Award, 
  Star, 
  Zap, 
  Crown, 
  Rocket,
  Trophy,
  Target,
  Flame
} from 'lucide-react';

interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  unlocked: boolean;
  requirement: number;
  current: number;
}

interface BadgeSystemProps {
  totalCalls?: number;
  totalWords?: number;
  imageCount?: number;
}

export const BadgeSystem: React.FC<BadgeSystemProps> = ({
  totalCalls = 0,
  totalWords = 0,
  imageCount = 0,
}) => {
  const [badges, setBadges] = useState<UserBadge[]>([]);

  useEffect(() => {
    const badgeDefinitions: UserBadge[] = [
      {
        id: 'starter',
        name: 'Starter',
        description: 'Send your first message',
        icon: Star,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        unlocked: totalCalls >= 1,
        requirement: 1,
        current: totalCalls
      },
      {
        id: 'explorer',
        name: 'Explorer',
        description: 'Send 50 messages',
        icon: Rocket,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        unlocked: totalCalls >= 50,
        requirement: 50,
        current: totalCalls
      },
      {
        id: 'power_user',
        name: 'Power User',
        description: 'Send 200 messages',
        icon: Zap,
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
        unlocked: totalCalls >= 200,
        requirement: 200,
        current: totalCalls
      },
      {
        id: 'premium_master',
        name: 'Premium Master',
        description: 'Send 500 messages',
        icon: Crown,
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10',
        unlocked: totalCalls >= 500,
        requirement: 500,
        current: totalCalls
      },
      {
        id: 'wordsmith',
        name: 'Wordsmith',
        description: 'Generate 10,000 words',
        icon: Target,
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        unlocked: totalWords >= 10000,
        requirement: 10000,
        current: totalWords
      },
      {
        id: 'novelist',
        name: 'Novelist',
        description: 'Generate 50,000 words',
        icon: Trophy,
        color: 'text-indigo-500',
        bgColor: 'bg-indigo-500/10',
        unlocked: totalWords >= 50000,
        requirement: 50000,
        current: totalWords
      },
      {
        id: 'artist',
        name: 'Artist',
        description: 'Generate 10 images',
        icon: Flame,
        color: 'text-pink-500',
        bgColor: 'bg-pink-500/10',
        unlocked: imageCount >= 10,
        requirement: 10,
        current: imageCount
      },
      {
        id: 'legend',
        name: 'Legend',
        description: 'Send 1000 messages',
        icon: Award,
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
        unlocked: totalCalls >= 1000,
        requirement: 1000,
        current: totalCalls
      },
    ];

    setBadges(badgeDefinitions);
  }, [totalCalls, totalWords, imageCount]);

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center space-x-2">
            <Award className="w-5 h-5 text-primary" />
            <span>Achievements</span>
          </h3>
          <Badge variant="secondary">{unlockedCount}/{badges.length}</Badge>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`relative flex flex-col items-center p-3 rounded-xl transition-all ${
                badge.unlocked 
                  ? `${badge.bgColor} hover:scale-105` 
                  : 'bg-muted/30 opacity-50'
              }`}
              title={`${badge.name}: ${badge.description} (${badge.current}/${badge.requirement})`}
            >
              <badge.icon className={`w-6 h-6 ${badge.unlocked ? badge.color : 'text-muted-foreground'}`} />
              <span className="text-xs font-medium mt-1 text-center">{badge.name}</span>
              {!badge.unlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-xl">
                  <span className="text-xs text-muted-foreground">
                    {Math.round((badge.current / badge.requirement) * 100)}%
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
