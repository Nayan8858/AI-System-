import React from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Crown, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface FeatureGateProps {
  requiredPlan: 'free' | 'basic' | 'premium';
  feature: string;
  children: React.ReactNode;
  showUpgrade?: boolean;
}

const planIcons = {
  free: null,
  basic: <Zap className="w-5 h-5 text-blue-500" />,
  premium: <Crown className="w-5 h-5 text-yellow-500" />,
};

const planNames = {
  free: 'Free',
  basic: 'Basic',
  premium: 'Premium',
};

export const FeatureGate: React.FC<FeatureGateProps> = ({ 
  requiredPlan, 
  feature, 
  children, 
  showUpgrade = true 
}) => {
  const { canPerformAction, currentPlan } = useSubscription();
  const navigate = useNavigate();

  const handleUpgradeClick = () => {
    navigate('/pricing');
  };

  const showBlockedMessage = () => {
    toast({
      title: "Feature Locked",
      description: `This action cannot be performed. Please upgrade to the ${planNames[requiredPlan]} plan for this feature.`,
      variant: "destructive",
    });
  };

  if (canPerformAction(requiredPlan)) {
    return <>{children}</>;
  }

  if (!showUpgrade) {
    return (
      <div onClick={showBlockedMessage} className="cursor-not-allowed opacity-50">
        {children}
      </div>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted/80 backdrop-blur-sm z-10 flex items-center justify-center">
        <div className="text-center p-6 max-w-sm">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lock className="w-6 h-6 text-muted-foreground" />
            {planIcons[requiredPlan]}
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {planNames[requiredPlan]} Feature
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            This {feature} requires a {planNames[requiredPlan]} plan or higher.
          </p>
          <div className="space-y-2">
            <Button onClick={handleUpgradeClick} size="sm" className="w-full">
              Upgrade to {planNames[requiredPlan]}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={showBlockedMessage}
              className="w-full text-xs"
            >
              Try anyway
            </Button>
          </div>
        </div>
      </div>
      <div className="opacity-30 pointer-events-none">
        {children}
      </div>
    </Card>
  );
};