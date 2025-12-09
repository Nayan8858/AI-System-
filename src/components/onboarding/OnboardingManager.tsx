import React, { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingFlow, OnboardingData } from './OnboardingFlow';
import { RewardAnimation } from './RewardAnimation';
import { PlanSelection } from './PlanSelection';
import { DummyPayment } from './DummyPayment';
import { GuidedTutorial } from './GuidedTutorial';
import { toast } from '@/hooks/use-toast';

type OnboardingPhase = 'checking' | 'onboarding' | 'rewards' | 'plans' | 'payment' | 'tutorial' | 'complete';

interface OnboardingManagerProps {
  children: React.ReactNode;
}

export const OnboardingManager: React.FC<OnboardingManagerProps> = ({ children }) => {
  const { user, isLoaded } = useUser();
  const { user: clerkUser } = useClerk();
  const [phase, setPhase] = useState<OnboardingPhase>('checking');
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'basic' | 'premium'>('free');

  useEffect(() => {
    if (isLoaded && user) {
      checkOnboardingStatus();
    } else if (isLoaded && !user) {
      setPhase('complete'); // Not logged in, skip onboarding
    }
  }, [isLoaded, user]);

  const checkOnboardingStatus = async () => {
    if (!user) {
      setPhase('complete');
      return;
    }

    try {
      // Check Clerk publicMetadata first
      const metadata = user.publicMetadata as {
        onboardingCompleted?: boolean;
        planActive?: boolean;
        tutorialCompleted?: boolean;
      };

      if (metadata?.onboardingCompleted && metadata?.planActive) {
        // Returning user - skip everything
        setPhase('complete');
        return;
      }

      // Check if user was created recently (within last 5 minutes) or hasn't completed onboarding
      const createdAt = new Date(user.createdAt || Date.now());
      const now = new Date();
      const isNewUser = (now.getTime() - createdAt.getTime()) < 5 * 60 * 1000; // 5 minutes

      if (isNewUser || !metadata?.onboardingCompleted) {
        setPhase('onboarding');
      } else if (!metadata?.planActive) {
        setPhase('plans');
      } else if (!metadata?.tutorialCompleted) {
        setPhase('tutorial');
      } else {
        setPhase('complete');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setPhase('complete');
    }
  };

  const handleOnboardingComplete = async (data: OnboardingData) => {
    setOnboardingData(data);

    if (!user) return;

    try {
      // Save to Supabase
      const { error } = await supabase.from('user_onboarding_data').upsert({
        clerk_user_id: user.id,
        full_name: data.fullName,
        preferred_name: data.preferredName,
        age_group: data.ageGroup,
        gender: data.gender,
        country: data.country,
        timezone: data.timezone,
        profession: data.profession,
        education_level: data.educationLevel,
        ai_comfort_level: data.aiComfortLevel,
        preferred_language: data.preferredLanguage,
        interests: data.interests,
        usage_intents: data.usageIntents,
        communication_tone: data.communicationTone,
        response_depth: data.responseDepth,
        preferred_coding_language: data.preferredCodingLanguage,
        memory_enabled: data.memoryEnabled,
        recurring_tasks: data.recurringTasks,
        frequent_subjects: data.frequentSubjects,
        onboarding_completed: true,
        badge: 'starter',
        free_image_credits: 5,
        speed_boost_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }, {
        onConflict: 'clerk_user_id',
      });

      if (error) throw error;

      setPhase('rewards');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your preferences. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleRewardsContinue = () => {
    setPhase('plans');
  };

  const handlePlanSelect = async (plan: 'free' | 'basic' | 'premium') => {
    setSelectedPlan(plan);
    
    if (plan === 'free') {
      setPhase('payment');
    } else {
      // Redirect to real Stripe checkout for paid plans
      try {
        const { data, error } = await supabase.functions.invoke('create-checkout', {
          body: { priceId: plan === 'basic' ? 'price_basic' : 'price_premium' },
        });

        if (error) throw error;
        if (data?.url) {
          window.open(data.url, '_blank');
        }
      } catch (error) {
        console.error('Error creating checkout:', error);
        toast({
          title: 'Error',
          description: 'Failed to start checkout. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handlePaymentComplete = async () => {
    if (!user) return;

    try {
      // Update Supabase
      await supabase.from('user_onboarding_data').update({
        plan_type: 'free',
        plan_active: true,
      }).eq('clerk_user_id', user.id);

      toast({
        title: 'Plan Activated!',
        description: 'Your Free Plan is now active. Enjoy NayandeepGPT!',
      });

      setPhase('tutorial');
    } catch (error) {
      console.error('Error activating plan:', error);
      setPhase('tutorial');
    }
  };

  const handleTutorialComplete = async () => {
    if (!user) return;

    try {
      // Update Supabase
      await supabase.from('user_onboarding_data').update({
        tutorial_completed: true,
      }).eq('clerk_user_id', user.id);
    } catch (error) {
      console.error('Error completing tutorial:', error);
    }

    setPhase('complete');
  };

  // Show loading state
  if (phase === 'checking') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Render appropriate phase
  return (
    <>
      {phase === 'onboarding' && (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      )}
      
      {phase === 'rewards' && (
        <RewardAnimation onContinue={handleRewardsContinue} />
      )}
      
      {phase === 'plans' && (
        <PlanSelection onSelectPlan={handlePlanSelect} />
      )}
      
      {phase === 'payment' && user && (
        <DummyPayment
          userName={onboardingData?.preferredName || user.firstName || 'User'}
          userId={user.id}
          onComplete={handlePaymentComplete}
        />
      )}
      
      {phase === 'tutorial' && (
        <GuidedTutorial onComplete={handleTutorialComplete} />
      )}
      
      {phase === 'complete' && children}
    </>
  );
};
