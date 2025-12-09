import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';

interface PlanSelectionProps {
  onSelectPlan: (plan: 'free' | 'basic' | 'premium') => void;
}

export const PlanSelection: React.FC<PlanSelectionProps> = ({ onSelectPlan }) => {
  const plans = [
    {
      id: 'free' as const,
      name: 'Free',
      price: '$0',
      period: '/forever',
      icon: Zap,
      gradient: 'from-gray-500 to-gray-600',
      features: [
        '1,000 words/day',
        '5 AI image generations',
        'Basic chat features',
        'Email support',
        'Community access',
      ],
      popular: false,
    },
    {
      id: 'basic' as const,
      name: 'Basic',
      price: '$9.99',
      period: '/month',
      icon: Sparkles,
      gradient: 'from-blue-500 to-cyan-500',
      features: [
        '50,000 words/month',
        '50 AI image generations',
        'All AI models access',
        'Priority support',
        'Chat history sync',
        'Custom themes',
      ],
      popular: true,
    },
    {
      id: 'premium' as const,
      name: 'Premium',
      price: '$29.99',
      period: '/month',
      icon: Crown,
      gradient: 'from-purple-500 to-pink-500',
      features: [
        'Unlimited words',
        'Unlimited image generations',
        'All AI models + priority',
        '24/7 premium support',
        'API access',
        'Custom integrations',
        'Team collaboration',
        'Advanced analytics',
      ],
      popular: false,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl p-4"
    >
      <div className="max-w-5xl w-full">
        <div className="text-center mb-8">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl font-bold mb-2"
          >
            Choose Your Plan
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            Select a plan to get started with NayandeepGPT
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className={`relative rounded-2xl border-2 p-6 ${
                  plan.popular
                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20'
                    : 'border-border/50 bg-card/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => onSelectPlan(plan.id)}
                  className={`w-full ${
                    plan.popular
                      ? 'bg-gradient-to-r from-primary to-primary/80'
                      : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.id === 'free' ? 'Get Started Free' : 'Subscribe Now'}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
