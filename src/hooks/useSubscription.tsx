import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface SubscriptionPlan {
  name: string;
  productId: string;
  features: {
    aiAccess: 'basic' | 'hero' | 'pro';
    chatHistory: number; // -1 for unlimited
    imageGeneration: number;
    storage: string;
    advancedModels: boolean;
    prioritySupport: boolean;
    customIntegrations: boolean;
    earlyAccess: boolean;
    accountManager: boolean;
  };
}

export const subscriptionPlans: Record<string, SubscriptionPlan> = {
  free: {
    name: 'Free',
    productId: '',
    features: {
      aiAccess: 'basic',
      chatHistory: 50,
      imageGeneration: 5,
      storage: '200MB',
      advancedModels: false,
      prioritySupport: false,
      customIntegrations: false,
      earlyAccess: false,
      accountManager: false,
    },
  },
  basic: {
    name: 'Basic',
    productId: 'prod_basic_123',
    features: {
      aiAccess: 'hero',
      chatHistory: 100,
      imageGeneration: 15,
      storage: '700MB',
      advancedModels: true,
      prioritySupport: false,
      customIntegrations: false,
      earlyAccess: false,
      accountManager: false,
    },
  },
  premium: {
    name: 'Premium',
    productId: 'prod_premium_456',
    features: {
      aiAccess: 'pro',
      chatHistory: -1,
      imageGeneration: 50,
      storage: '15GB',
      advancedModels: true,
      prioritySupport: true,
      customIntegrations: true,
      earlyAccess: true,
      accountManager: true,
    },
  },
};

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    subscribed: false,
    plan: 'free',
    productId: null as string | null,
    subscriptionEnd: null as string | null,
    isLoading: true,
  });

  const checkSubscription = useCallback(async () => {
    if (!user) {
      setSubscriptionStatus({
        subscribed: false,
        plan: 'free',
        productId: null,
        subscriptionEnd: null,
        isLoading: false,
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        body: {
          clerkUserId: user.id,
          userEmail: user.emailAddresses?.[0]?.emailAddress || user.primaryEmailAddress?.emailAddress
        }
      });
      
      if (error) throw error;

      const planKey = data.product_id ? 
        Object.keys(subscriptionPlans).find(key => 
          subscriptionPlans[key].productId === data.product_id
        ) || 'free' : 'free';

      setSubscriptionStatus({
        subscribed: data.subscribed || false,
        plan: planKey,
        productId: data.product_id,
        subscriptionEnd: data.subscription_end,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscriptionStatus({
        subscribed: false,
        plan: 'free',
        productId: null,
        subscriptionEnd: null,
        isLoading: false,
      });
    }
  }, [user]);

  useEffect(() => {
    checkSubscription();
    
    // Auto-refresh every minute
    const interval = setInterval(checkSubscription, 60000);
    
    return () => clearInterval(interval);
  }, [checkSubscription]);

  const currentPlan = subscriptionPlans[subscriptionStatus.plan];

  const hasFeature = useCallback((feature: keyof SubscriptionPlan['features']) => {
    return currentPlan?.features[feature] ?? false;
  }, [currentPlan]);

  const canPerformAction = useCallback((requiredPlan: keyof typeof subscriptionPlans) => {
    const planHierarchy = ['free', 'basic', 'premium'];
    const currentIndex = planHierarchy.indexOf(subscriptionStatus.plan);
    const requiredIndex = planHierarchy.indexOf(requiredPlan);
    return currentIndex >= requiredIndex;
  }, [subscriptionStatus.plan]);

  return {
    ...subscriptionStatus,
    currentPlan,
    hasFeature,
    canPerformAction,
    refreshSubscription: checkSubscription,
  };
};