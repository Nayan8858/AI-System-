import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

export interface UserPreferences {
  fullName: string;
  preferredName: string;
  communicationTone: string;
  responseDepth: string;
  preferredCodingLanguage: string;
  preferredLanguage: string;
  memoryEnabled: boolean;
  usageIntents: string[];
  interests: string[];
  profession: string;
  aiComfortLevel: string;
  badge: string;
  planType: string;
  freeImageCredits: number;
}

export const useUserPreferences = () => {
  const { user, isLoaded } = useUser();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPreferences = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // First try Clerk metadata for quick access
      const metadata = user.publicMetadata as any;
      if (metadata?.preferences) {
        setPreferences({
          fullName: user.fullName || '',
          preferredName: user.firstName || '',
          communicationTone: metadata.preferences.communicationTone || 'friendly',
          responseDepth: metadata.preferences.responseDepth || 'detailed',
          preferredCodingLanguage: metadata.preferences.preferredCodingLanguage || 'JavaScript',
          preferredLanguage: metadata.preferences.preferredLanguage || 'English',
          memoryEnabled: metadata.preferences.memoryEnabled ?? true,
          usageIntents: [],
          interests: [],
          profession: '',
          aiComfortLevel: '',
          badge: metadata.badge || 'starter',
          planType: metadata.planType || 'free',
          freeImageCredits: 5,
        });
      }

      // Then fetch full data from Supabase
      const { data, error } = await supabase
        .from('user_onboarding_data')
        .select('*')
        .eq('clerk_user_id', user.id)
        .single();

      if (data && !error) {
        setPreferences({
          fullName: data.full_name || user.fullName || '',
          preferredName: data.preferred_name || user.firstName || '',
          communicationTone: data.communication_tone || 'friendly',
          responseDepth: data.response_depth || 'detailed',
          preferredCodingLanguage: data.preferred_coding_language || 'JavaScript',
          preferredLanguage: data.preferred_language || 'English',
          memoryEnabled: data.memory_enabled ?? true,
          usageIntents: data.usage_intents || [],
          interests: data.interests || [],
          profession: data.profession || '',
          aiComfortLevel: data.ai_comfort_level || '',
          badge: data.badge || 'starter',
          planType: data.plan_type || 'free',
          freeImageCredits: data.free_image_credits || 5,
        });
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isLoaded) {
      fetchPreferences();
    }
  }, [isLoaded, fetchPreferences]);

  // Build system prompt based on preferences
  const buildSystemPrompt = useCallback(() => {
    if (!preferences) return '';

    const parts = [];

    // Add name personalization
    if (preferences.preferredName) {
      parts.push(`Address the user as "${preferences.preferredName}".`);
    }

    // Add tone preference
    const toneMap: Record<string, string> = {
      friendly: 'Be warm, casual, and approachable in your responses.',
      professional: 'Maintain a formal, business-like tone.',
      direct: 'Be concise and straight to the point.',
      mixed: 'Adapt your tone based on the context of the conversation.',
    };
    if (toneMap[preferences.communicationTone]) {
      parts.push(toneMap[preferences.communicationTone]);
    }

    // Add response depth preference
    const depthMap: Record<string, string> = {
      short: 'Keep responses brief and concise.',
      detailed: 'Provide comprehensive explanations.',
      'step-by-step': 'Break down explanations into clear steps.',
      examples: 'Include practical examples in your explanations.',
    };
    if (depthMap[preferences.responseDepth]) {
      parts.push(depthMap[preferences.responseDepth]);
    }

    // Add coding language preference
    if (preferences.preferredCodingLanguage) {
      parts.push(`When providing code examples, prefer ${preferences.preferredCodingLanguage} unless another language is specified.`);
    }

    // Add language preference
    if (preferences.preferredLanguage && preferences.preferredLanguage !== 'English') {
      parts.push(`Respond in ${preferences.preferredLanguage} when appropriate.`);
    }

    return parts.join(' ');
  }, [preferences]);

  // Determine best model based on query and preferences
  const getRecommendedModel = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    const intents = preferences?.usageIntents || [];

    // Check for specific keywords
    if (lowerQuery.includes('code') || lowerQuery.includes('function') || lowerQuery.includes('debug') || lowerQuery.includes('program')) {
      return 'qwen-coder';
    }
    if (lowerQuery.includes('search') || lowerQuery.includes('find') || lowerQuery.includes('latest') || lowerQuery.includes('news')) {
      return 'gemini-flash';
    }
    if (lowerQuery.includes('research') || lowerQuery.includes('analyze') || lowerQuery.includes('deep dive')) {
      return 'deepseek-r1';
    }
    if (lowerQuery.includes('image') || lowerQuery.includes('photo') || lowerQuery.includes('picture')) {
      return 'qwen-vl';
    }
    if (lowerQuery.includes('write') || lowerQuery.includes('blog') || lowerQuery.includes('article') || lowerQuery.includes('seo')) {
      return 'llama-33';
    }
    if (lowerQuery.includes('math') || lowerQuery.includes('calculate') || lowerQuery.includes('solve')) {
      return 'qwen-235b';
    }

    // Default based on primary usage intent
    if (intents.includes('coding')) return 'qwen-coder';
    if (intents.includes('research')) return 'deepseek-r1';
    if (intents.includes('seo-writing')) return 'llama-33';

    return 'deepseek-v3'; // Default
  }, [preferences]);

  return {
    preferences,
    loading,
    buildSystemPrompt,
    getRecommendedModel,
    refetch: fetchPreferences,
  };
};
