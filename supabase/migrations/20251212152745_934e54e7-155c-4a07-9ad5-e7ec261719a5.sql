-- Create user_preferences table to store onboarding preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL UNIQUE,
  name text,
  age_group text,
  country text,
  timezone text,
  profession text,
  education text,
  ai_level text,
  language text,
  primary_uses text[] DEFAULT '{}'::text[],
  tone text,
  depth text,
  coding_language text,
  memory_enabled boolean DEFAULT true,
  subjects integer[] DEFAULT '{}'::integer[],
  recurring_tasks integer[] DEFAULT '{}'::integer[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Policy: users can manage their own preferences
CREATE POLICY "Users can manage their own preferences"
ON public.user_preferences
AS PERMISSIVE
FOR ALL
TO authenticated
USING (user_id = ((current_setting('request.headers', true))::json ->> 'x-clerk-user-id'))
WITH CHECK (user_id = ((current_setting('request.headers', true))::json ->> 'x-clerk-user-id'));

-- Ensure updated_at stays fresh
CREATE OR REPLACE FUNCTION public.update_user_preferences_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_user_preferences_updated_at
BEFORE UPDATE ON public.user_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_user_preferences_updated_at();