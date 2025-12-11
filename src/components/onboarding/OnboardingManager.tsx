import React, { useState, useEffect, useCallback } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingFlow, OnboardingData } from './OnboardingFlow';
import { RewardAnimation } from './RewardAnimation';
import { PlanSelection } from './PlanSelection';
import { DummyPayment } from './DummyPayment';
import { GuidedTutorial } from './GuidedTutorial';
import { toast } from 'sonner';

type OnboardingPhase = 'checking' | 'onboarding' | 'rewards' | 'plans' | 'payment' | 'tutorial' | 'complete';

interface OnboardingManagerProps {
  children: React.ReactNode;
}

// Helper to create supabase client with Clerk headers
const getSupabaseWithClerkHeaders = (clerkUserId: string) => {
  return supabase;
};

export const OnboardingManager: React.FC<OnboardingManagerProps> = ({ children }) => {
  const { user, isLoaded } = useUser();
  const { user: clerkUser } = useClerk();
  const [phase, setPhase] = useState<OnboardingPhase>('checking');
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'basic' | 'premium'>('free');
  const [isSaving, setIsSaving] = useState(false);

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

      // Check Supabase for existing onboarding data
      const { data: existingData } = await supabase
        .from('user_onboarding_data')
        .select('onboarding_completed, plan_active, tutorial_completed')
        .eq('clerk_user_id', user.id)
        .maybeSingle();

      if (existingData?.onboarding_completed && existingData?.plan_active) {
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
      setPhase('onboarding'); // Default to onboarding on error
    }
  };

  // Retry function with exponential backoff
  const retryOperation = async <T,>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> => {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        console.warn(`Attempt ${attempt}/${maxRetries} failed:`, error);
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
      }
    }
    
    throw lastError;
  };

  const handleOnboardingComplete = async (data: OnboardingData) => {
    if (!user) return;
    
    setIsSaving(true);
    setOnboardingData(data);

    try {
      await retryOperation(async () => {
        // Prepare data with proper types and defaults
        const saveData = {
          clerk_user_id: user.id,
          full_name: data.fullName?.trim() || null,
          preferred_name: data.preferredName?.trim() || null,
          age_group: data.ageGroup || null,
          gender: data.gender || null,
          country: data.country || null,
          timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          profession: data.profession || null,
          education_level: data.educationLevel || null,
          ai_comfort_level: data.aiComfortLevel || null,
          preferred_language: data.preferredLanguage || 'English',
          interests: Array.isArray(data.interests) ? data.interests : [],
          usage_intents: Array.isArray(data.usageIntents) ? data.usageIntents : [],
          communication_tone: data.communicationTone || 'friendly',
          response_depth: data.responseDepth || 'detailed',
          preferred_coding_language: data.preferredCodingLanguage || 'JavaScript',
          memory_enabled: typeof data.memoryEnabled === 'boolean' ? data.memoryEnabled : true,
          recurring_tasks: Array.isArray(data.recurringTasks) ? data.recurringTasks : [],
          frequent_subjects: Array.isArray(data.frequentSubjects) ? data.frequentSubjects : [],
          onboarding_completed: true,
          badge: 'starter',
          free_image_credits: 5,
          speed_boost_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        };

        // First check if record exists
        const { data: existing } = await supabase
          .from('user_onboarding_data')
          .select('id')
          .eq('clerk_user_id', user.id)
          .maybeSingle();

        let result;
        if (existing) {
          // Update existing record
          result = await supabase
            .from('user_onboarding_data')
            .update(saveData)
            .eq('clerk_user_id', user.id);
        } else {
          // Insert new record
          result = await supabase
            .from('user_onboarding_data')
            .insert(saveData);
        }

        if (result.error) {
          console.error('Supabase error:', result.error);
          throw new Error(result.error.message);
        }

        return result;
      }, 3, 1000);

      // Success!
      setIsSaving(false);
      toast.success('Preferences saved successfully!');
      
      // Small delay to show success state
      await new Promise(resolve => setTimeout(resolve, 500));
      setPhase('rewards');
      
    } catch (error) {
      console.error('Error saving onboarding data after retries:', error);
      setIsSaving(false);
      toast.error('Failed to save preferences. Please try again.');
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
        toast.error('Failed to start checkout. Please try again.');
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

      toast.success('Your Free Plan is now active. Enjoy NayandeepGPT!');

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
        <OnboardingFlow onComplete={handleOnboardingComplete} isSaving={isSaving} />
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
