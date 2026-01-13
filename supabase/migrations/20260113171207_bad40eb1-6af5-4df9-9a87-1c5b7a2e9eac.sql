-- Create user_onboarding_data table for storing user preferences and onboarding status
CREATE TABLE public.user_onboarding_data (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_user_id TEXT NOT NULL UNIQUE,
    full_name TEXT,
    preferred_name TEXT,
    age_group TEXT,
    gender TEXT,
    country TEXT,
    timezone TEXT,
    profession TEXT,
    education_level TEXT,
    ai_comfort_level TEXT,
    preferred_language TEXT DEFAULT 'English',
    interests TEXT[] DEFAULT '{}',
    usage_intents TEXT[] DEFAULT '{}',
    communication_tone TEXT DEFAULT 'friendly',
    response_depth TEXT DEFAULT 'detailed',
    preferred_coding_language TEXT DEFAULT 'JavaScript',
    memory_enabled BOOLEAN DEFAULT true,
    recurring_tasks TEXT[] DEFAULT '{}',
    frequent_subjects TEXT[] DEFAULT '{}',
    onboarding_completed BOOLEAN DEFAULT false,
    plan_type TEXT DEFAULT 'free',
    plan_active BOOLEAN DEFAULT false,
    tutorial_completed BOOLEAN DEFAULT false,
    badge TEXT DEFAULT 'starter',
    free_image_credits INTEGER DEFAULT 5,
    speed_boost_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create analytics_usage table for tracking API usage
CREATE TABLE public.analytics_usage (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    model_used TEXT,
    tokens_or_words INTEGER DEFAULT 0,
    image_analysis BOOLEAN DEFAULT false,
    pdf_uploaded BOOLEAN DEFAULT false,
    cost_usd NUMERIC(10,4) DEFAULT 0,
    response_time_ms INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_preferences table for simplified preferences
CREATE TABLE public.user_preferences (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    name TEXT,
    age_group TEXT,
    country TEXT,
    timezone TEXT,
    profession TEXT,
    education TEXT,
    ai_level TEXT,
    language TEXT DEFAULT 'English',
    primary_uses TEXT[] DEFAULT '{}',
    tone TEXT DEFAULT 'friendly',
    depth TEXT DEFAULT 'detailed',
    coding_language TEXT DEFAULT 'JavaScript',
    memory_enabled BOOLEAN DEFAULT true,
    recurring_tasks INTEGER[] DEFAULT '{}',
    subjects INTEGER[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_onboarding_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_onboarding_data (using clerk_user_id header)
CREATE POLICY "Users can view own onboarding data"
    ON public.user_onboarding_data FOR SELECT
    USING (clerk_user_id = current_setting('request.headers', true)::json->>'x-clerk-user-id');

CREATE POLICY "Users can insert own onboarding data"
    ON public.user_onboarding_data FOR INSERT
    WITH CHECK (clerk_user_id = current_setting('request.headers', true)::json->>'x-clerk-user-id');

CREATE POLICY "Users can update own onboarding data"
    ON public.user_onboarding_data FOR UPDATE
    USING (clerk_user_id = current_setting('request.headers', true)::json->>'x-clerk-user-id');

-- RLS policies for analytics_usage
CREATE POLICY "Users can view own analytics"
    ON public.analytics_usage FOR SELECT
    USING (user_id = current_setting('request.headers', true)::json->>'x-clerk-user-id');

CREATE POLICY "Users can insert own analytics"
    ON public.analytics_usage FOR INSERT
    WITH CHECK (user_id = current_setting('request.headers', true)::json->>'x-clerk-user-id');

-- RLS policies for user_preferences
CREATE POLICY "Users can view own preferences"
    ON public.user_preferences FOR SELECT
    USING (user_id = current_setting('request.headers', true)::json->>'x-clerk-user-id');

CREATE POLICY "Users can insert own preferences"
    ON public.user_preferences FOR INSERT
    WITH CHECK (user_id = current_setting('request.headers', true)::json->>'x-clerk-user-id');

CREATE POLICY "Users can update own preferences"
    ON public.user_preferences FOR UPDATE
    USING (user_id = current_setting('request.headers', true)::json->>'x-clerk-user-id');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_user_onboarding_data_updated_at
    BEFORE UPDATE ON public.user_onboarding_data
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();