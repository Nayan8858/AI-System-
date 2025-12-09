-- Create user_onboarding_data table
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
  badge TEXT DEFAULT 'starter',
  free_image_credits INTEGER DEFAULT 5,
  speed_boost_until TIMESTAMP WITH TIME ZONE,
  plan_type TEXT DEFAULT 'free',
  plan_active BOOLEAN DEFAULT false,
  onboarding_completed BOOLEAN DEFAULT false,
  tutorial_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_onboarding_data ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own onboarding data"
ON public.user_onboarding_data
FOR SELECT
USING (clerk_user_id = ((current_setting('request.headers'::text, true))::json ->> 'x-clerk-user-id'));

CREATE POLICY "Users can insert their own onboarding data"
ON public.user_onboarding_data
FOR INSERT
WITH CHECK (clerk_user_id = ((current_setting('request.headers'::text, true))::json ->> 'x-clerk-user-id'));

CREATE POLICY "Users can update their own onboarding data"
ON public.user_onboarding_data
FOR UPDATE
USING (clerk_user_id = ((current_setting('request.headers'::text, true))::json ->> 'x-clerk-user-id'));

-- Add trigger for updated_at
CREATE TRIGGER update_user_onboarding_updated_at
BEFORE UPDATE ON public.user_onboarding_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();