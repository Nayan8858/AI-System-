import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, TrendingUp, Clock, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

interface Analytics {
  totalCalls: number;
  remaining: number;
  plan: string;
  resetTime: string;
}

export const APIAnalytics = () => {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalCalls: 0,
    remaining: 10000,
    plan: 'Free',
    resetTime: '24h'
  });

  useEffect(() => {
    const stored = localStorage.getItem('nayandeep_api_analytics');
    if (stored) {
      setAnalytics(JSON.parse(stored));
    }
  }, []);

  const handleBuyCredits = () => {
    toast({
      title: "Stripe Integration",
      description: "Redirecting to payment gateway...",
    });
    // Integrate with Stripe here
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">API Usage Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: Activity, label: 'Total Calls', value: analytics.totalCalls, color: 'text-blue-500' },
          { icon: TrendingUp, label: 'Remaining', value: analytics.remaining, color: 'text-green-500' },
          { icon: Clock, label: 'Next Reset', value: analytics.resetTime, color: 'text-yellow-500' },
          { icon: CreditCard, label: 'Plan', value: analytics.plan, color: 'text-purple-500' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Usage Graph</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-end justify-between gap-2">
            {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex-1 bg-primary rounded-t-lg"
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleBuyCredits} className="w-full">
        <CreditCard className="w-4 h-4 mr-2" />
        Buy More Credits (₹50 = 500 calls)
      </Button>
    </div>
  );
};
