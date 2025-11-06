-- Create api_keys table for API key management
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  key_hash TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  revoked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own API keys"
  ON public.api_keys
  FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own API keys"
  ON public.api_keys
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own API keys"
  ON public.api_keys
  FOR UPDATE
  USING (auth.uid()::text = user_id::text);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON public.api_keys(key_hash);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_api_keys_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_api_keys_updated_at
  BEFORE UPDATE ON public.api_keys
  FOR EACH ROW
  EXECUTE FUNCTION public.update_api_keys_updated_at();