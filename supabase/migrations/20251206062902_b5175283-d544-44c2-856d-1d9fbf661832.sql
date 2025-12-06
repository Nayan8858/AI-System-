-- Create analytics_usage table for tracking model usage
CREATE TABLE public.analytics_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  model_used TEXT NOT NULL,
  tokens_or_words INTEGER NOT NULL DEFAULT 0,
  image_analysis BOOLEAN NOT NULL DEFAULT false,
  pdf_uploaded BOOLEAN NOT NULL DEFAULT false,
  cost_usd DECIMAL(10, 4) NOT NULL DEFAULT 0,
  response_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create billing_records table for monthly billing
CREATE TABLE public.billing_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_words INTEGER NOT NULL DEFAULT 0,
  total_images INTEGER NOT NULL DEFAULT 0,
  total_analysis INTEGER NOT NULL DEFAULT 0,
  amount_usd DECIMAL(10, 2) NOT NULL DEFAULT 0,
  is_paid BOOLEAN NOT NULL DEFAULT false,
  invoice_sent BOOLEAN NOT NULL DEFAULT false,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on analytics_usage
ALTER TABLE public.analytics_usage ENABLE ROW LEVEL SECURITY;

-- Create policy for analytics_usage
CREATE POLICY "Users can view their own analytics" 
ON public.analytics_usage 
FOR SELECT 
USING (auth.uid()::text = user_id OR user_id = current_setting('request.headers', true)::json->>'x-clerk-user-id');

CREATE POLICY "Allow insert for authenticated users" 
ON public.analytics_usage 
FOR INSERT 
WITH CHECK (true);

-- Enable RLS on billing_records
ALTER TABLE public.billing_records ENABLE ROW LEVEL SECURITY;

-- Create policy for billing_records
CREATE POLICY "Users can view their own billing" 
ON public.billing_records 
FOR SELECT 
USING (auth.uid()::text = user_id OR user_id = current_setting('request.headers', true)::json->>'x-clerk-user-id');

-- Create index for faster queries
CREATE INDEX idx_analytics_user_id ON public.analytics_usage(user_id);
CREATE INDEX idx_analytics_created_at ON public.analytics_usage(created_at);
CREATE INDEX idx_billing_user_id ON public.billing_records(user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for billing_records
CREATE TRIGGER update_billing_records_updated_at
BEFORE UPDATE ON public.billing_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();