import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, ArrowLeft, Sparkles, Crown, Zap } from 'lucide-react';
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
  icon: React.ReactNode;
  gradient: string;
}

const plans: PricingPlan[] = [
  {
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    priceId: { monthly: '', yearly: '' },
    icon: <Zap className="w-6 h-6" />,
    gradient: 'from-slate-500/20 to-slate-600/10',
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
    monthlyPrice: 4.99,
    yearlyPrice: 49.99,
    priceId: { monthly: 'price_1SEurz2KLXEX1a3oEApasDRb', yearly: 'price_1SEusF2KLXEX1a3oWp3xDpbX' },
    icon: <Sparkles className="w-6 h-6" />,
    gradient: 'from-blue-500/20 to-cyan-500/10',
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
    monthlyPrice: 14.99,
    yearlyPrice: 149.99,
    priceId: { monthly: 'price_1SEusU2KLXEX1a3oDUxYWnRC', yearly: 'price_1SEusg2KLXEX1a3o76SXHCME' },
    popular: true,
    icon: <Crown className="w-6 h-6" />,
    gradient: 'from-purple-500/20 via-pink-500/10 to-orange-500/10',
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

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const { user } = useAuth();
  const { plan: currentPlan, refreshSubscription } = useSubscription();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      refreshSubscription();
    }
  }, [user, refreshSubscription]);

  const handleUpgrade = async (plan: PricingPlan) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upgrade your plan.",
        variant: "destructive",
      });
      return;
    }

    if (plan.name === 'Free') {
      toast({
        title: "Already Active",
        description: "You're already on the free plan.",
      });
      return;
    }

    try {
      const priceId = isYearly ? plan.priceId.yearly : plan.priceId.monthly;
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId,
          userEmail: user.primaryEmailAddress?.emailAddress,
          userId: user.id,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
        toast({
          title: "Redirecting to Payment",
          description: "Opening Stripe secure checkout...",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to initiate payment.",
        variant: "destructive",
      });
    }
  };

  const isPlanActive = (planName: string) => {
    if (planName.toLowerCase() === 'free') return currentPlan === 'free';
    return currentPlan === planName.toLowerCase();
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/home')}
          className="mb-6 hover:bg-card/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-purple-500 bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Unlock the full power of NayandeepGPT with advanced AI models, unlimited history, and premium support.
          </p>

          {/* Monthly/Yearly Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-medium transition-colors ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative inline-flex h-7 w-14 items-center rounded-full bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-primary shadow-lg transition-transform ${isYearly ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
            <span className={`text-sm font-medium transition-colors ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Yearly <Badge variant="secondary" className="ml-1 bg-green-500/20 text-green-600">Save 15%</Badge>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative overflow-hidden backdrop-blur-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                plan.popular 
                  ? 'border-primary shadow-lg shadow-primary/20' 
                  : 'border-border/50 hover:border-primary/50'
              }`}
            >
              {/* Glassmorphism Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-50`} />
              
              {plan.popular && (
                <div className="absolute -top-1 -right-8 rotate-45 bg-primary text-primary-foreground text-xs font-bold py-1 px-10">
                  POPULAR
                </div>
              )}
              
              <CardHeader className="text-center pb-4 relative z-10">
                <div className={`mx-auto mb-4 p-3 rounded-xl bg-gradient-to-br ${plan.gradient} w-fit`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                    ${isYearly ? plan.yearlyPrice.toFixed(2) : plan.monthlyPrice.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground text-sm ml-1">
                    /{isYearly ? 'year' : 'month'}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <ul className="space-y-3 mb-6">
                  {plan.features.slice(0, 7).map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      {feature.included ? (
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                          <Check className="w-3 h-3 text-green-500" />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center mt-0.5">
                          <X className="w-3 h-3 text-destructive" />
                        </div>
                      )}
                      <span className={`text-sm ${feature.included ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full transition-all ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg' 
                      : ''
                  }`}
                  variant={plan.name === 'Free' ? "secondary" : "default"}
                  onClick={() => handleUpgrade(plan)}
                  disabled={plan.name === 'Free' || isPlanActive(plan.name)}
                >
                  {plan.name === 'Free' 
                    ? 'Current Plan' 
                    : isPlanActive(plan.name) 
                      ? 'Current Plan' 
                      : 'Get Started'
                  }
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p className="mb-2">All prices in USD. Cancel anytime. No hidden charges.</p>
          <p>Secure payments powered by Stripe</p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
