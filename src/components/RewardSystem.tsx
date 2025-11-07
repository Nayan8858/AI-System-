import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Users, Trophy, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

interface Reward {
  invites: number;
  credits: number;
  achievements: string[];
}

export const RewardSystem = () => {
  const [rewards, setRewards] = useState<Reward>({ invites: 0, credits: 0, achievements: [] });
  const [spinning, setSpinning] = useState(false);
  const [showWheel, setShowWheel] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('nayandeep_rewards');
    if (stored) {
      setRewards(JSON.parse(stored));
    }
  }, []);

  const spinWheel = () => {
    if (spinning) return;
    
    setSpinning(true);
    const prize = Math.floor(Math.random() * 191) + 10; // 10-200
    
    setTimeout(() => {
      const updated = { ...rewards, credits: rewards.credits + prize };
      setRewards(updated);
      localStorage.setItem('nayandeep_rewards', JSON.stringify(updated));
      setSpinning(false);
      toast({
        title: `🎉 You Won ${prize} Credits!`,
        description: 'Congratulations! Credits added to your account.',
      });
    }, 2000);
  };

  const copyReferralLink = () => {
    const link = `https://nayandeepgpt.cloud/invite/${Date.now()}`;
    navigator.clipboard.writeText(link);
    toast({ title: 'Link Copied!', description: 'Share with friends to earn rewards' });
  };

  const achievements = [
    { icon: '🪄', title: 'First Code', unlocked: rewards.achievements.includes('code') },
    { icon: '🎨', title: '5 Images', unlocked: rewards.achievements.includes('images') },
    { icon: '💬', title: '100 Messages', unlocked: rewards.achievements.includes('messages') },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Gift className="w-6 h-6 text-yellow-500" />
        Rewards & Achievements
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Users, label: 'Invites Sent', value: rewards.invites },
          { icon: Trophy, label: 'Credits Earned', value: rewards.credits },
          { icon: Star, label: 'Achievements', value: rewards.achievements.length },
        ].map((stat, i) => (
          <Card key={i} className="glass">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Daily Reward Wheel</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <motion.div
            animate={{ rotate: spinning ? 360 : 0 }}
            transition={{ duration: 2, repeat: spinning ? Infinity : 0, ease: 'linear' }}
            className="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-4xl"
          >
            🎰
          </motion.div>
          <Button onClick={spinWheel} disabled={spinning} className="w-full">
            {spinning ? 'Spinning...' : 'Spin to Win Credits!'}
          </Button>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Referral Program</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Share your invite link and earn +50 credits for each signup!
          </p>
          <Button onClick={copyReferralLink} className="w-full">
            Copy Invite Link
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="font-semibold">Achievements</h3>
        <div className="grid grid-cols-3 gap-4">
          {achievements.map((ach, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.1 }}
              className={`glass p-4 rounded-lg text-center ${ach.unlocked ? 'border-2 border-yellow-500' : 'opacity-50'}`}
            >
              <div className="text-3xl mb-2">{ach.icon}</div>
              <p className="text-xs font-medium">{ach.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
