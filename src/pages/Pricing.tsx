import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Circle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface PricingPlan {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  priceId: {
    monthly: string;
    yearly: string;
  };
  features: Array<{
    name: string;
    included: boolean;
  }>;
  popular?: boolean;
}

const plans: PricingPlan[] = [
  {
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    priceId: { monthly: '', yearly: '' },
    features: [
      { name: 'Basic AI access', included: true },
      { name: 'Limited chat history (50 messages)', included: true },
      { name: '5 image Generator per day', included: true },
      { name: '200MB Storage', included: true },
      { name: 'Advanced AI models', included: false },
      { name: 'Unlimited chat history', included: false },
      { name: 'Priority response speed', included: false },
      { name: 'Email & chat support', included: false },
      { name: 'Custom integrations', included: false },
      { name: 'Early access to features', included: false },
      { name: 'Dedicated account manager', included: false },
    ],
  },
  {
    name: 'Basic',
    monthlyPrice: 5,
    yearlyPrice: 54, // 10% discount: $5 * 12 * 0.9 = $54
    priceId: { monthly: 'price_basic_monthly', yearly: 'price_basic_yearly' },
    features: [
      { name: 'Hero AI access', included: true },
      { name: 'Limited chat history (100 messages)', included: true },
      { name: '15 image Generator per day', included: true },
      { name: '700 MB Storage', included: true },
      { name: 'Advanced AI models', included: true },
      { name: 'Unlimited chat history', included: false },
      { name: 'Priority response speed', included: false },
      { name: 'Email & chat support', included: false },
      { name: 'Custom integrations', included: false },
      { name: 'Early access to features', included: false },
      { name: 'Dedicated account manager', included: false },
    ],
  },
  {
    name: 'Premium',
    monthlyPrice: 15.99,
    yearlyPrice: 172.70, // 10% discount: $15.99 * 12 * 0.9 = $172.70
    priceId: { monthly: 'price_premium_monthly', yearly: 'price_premium_yearly' },
    popular: true,
    features: [
      { name: 'PRO AI access', included: true },
      { name: 'Unlimited History', included: true },
      { name: '50 image generator per day', included: true },
      { name: '15 GB Storage', included: true },
      { name: 'Advanced AI models', included: true },
      { name: 'Unlimited chat history', included: true },
      { name: 'Priority response speed', included: true },
      { name: 'Email & chat support', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'Early access to features', included: true },
      { name: 'Dedicated account manager', included: true },
    ],
  },
];

const comparisonFeatures = [
  'Basic AI access',
  'Limited chat history (50 messages)',
  'Standard response speed',
  'Community support',
  'Advanced AI models',
  'Unlimited chat history',
  'Priority response speed',
  'Email & chat support',
  'Custom integrations',
  'Early access to features',
  'Dedicated account manager',
];

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const { user } = useAuth();

  const handleUpgrade = async (plan: PricingPlan) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upgrade your plan.",
        variant: "destructive",
      });
      return;
    }

    try {
      const priceId = isYearly ? plan.priceId.yearly : plan.priceId.monthly;
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: "Failed to initiate checkout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getUserPlan = () => {
    // Check user's metadata for current plan - this would be updated after successful payment
    const metadata = user?.publicMetadata as { plan?: string; expires?: string } | undefined;
    return metadata?.plan || 'free';
  };

  const isPlanActive = (planName: string) => {
    const userPlan = getUserPlan();
    if (planName.toLowerCase() === 'free') return true;
    return userPlan === planName.toLowerCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="flex-1 max-w-md">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Choose the Best Plan for You
              </h1>
              <p className="text-muted-foreground text-lg">
                Upgrade Nayandeep GPT and unlock advanced features, powerful AI models, and premium support.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-48 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg"></div>
              </div>
            </div>
          </div>

          {/* Monthly/Yearly Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-medium ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${isYearly ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className={`text-sm font-medium ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Yearly <span className="text-xs text-green-600">(Save 10%)</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border'}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-semibold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-primary">
                    ${isYearly ? plan.yearlyPrice.toFixed(2) : plan.monthlyPrice.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground text-sm ml-1">
                    /{isYearly ? 'year' : 'month'}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      {feature.included ? (
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                          <Check className="w-3 h-3 text-blue-600" />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                          <X className="w-3 h-3 text-red-600" />
                        </div>
                      )}
                      <span className={`text-sm ${feature.included ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full"
                  variant={isPlanActive(plan.name) ? "secondary" : "default"}
                  onClick={() => handleUpgrade(plan)}
                  disabled={plan.name === 'Free' || isPlanActive(plan.name)}
                >
                  {isPlanActive(plan.name) ? 'Activated' : 'Upgrade'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4 font-medium text-muted-foreground">Feature</th>
                  <th className="text-center py-4 px-4 font-medium text-muted-foreground">Free</th>
                  <th className="text-center py-4 px-4 font-medium text-muted-foreground">Basic</th>
                  <th className="text-center py-4 px-4 font-medium text-muted-foreground">Premium</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-4 px-4 text-sm">{feature}</td>
                    {plans.map((plan) => {
                      const planFeature = plan.features.find(f => f.name === feature);
                      const isIncluded = planFeature?.included || false;
                      return (
                        <td key={plan.name} className="py-4 px-4 text-center">
                          {isIncluded ? (
                            <div className="inline-flex w-5 h-5 rounded-full bg-blue-100 items-center justify-center">
                              <Check className="w-3 h-3 text-blue-600" />
                            </div>
                          ) : (
                            <div className="inline-flex w-5 h-5 rounded-full bg-red-100 items-center justify-center">
                              <X className="w-3 h-3 text-red-600" />
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p className="mb-2">Cancel at any time. No hidden charges</p>
          <p>Made with 🤍</p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;