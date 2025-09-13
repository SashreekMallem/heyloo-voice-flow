-- Create storage bucket for menu files
INSERT INTO storage.buckets (id, name, public) VALUES ('menu-files', 'menu-files', false);

-- Create storage policies for menu files
CREATE POLICY "Users can upload their own menu files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'menu-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own menu files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'menu-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own menu files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'menu-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own menu files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'menu-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_monthly NUMERIC NOT NULL,
  price_annual NUMERIC NOT NULL,
  features JSONB NOT NULL DEFAULT '[]',
  limits JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create customer subscriptions table
CREATE TABLE public.customer_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  status TEXT NOT NULL DEFAULT 'active',
  billing_cycle TEXT NOT NULL DEFAULT 'monthly', -- monthly, annual
  stripe_subscription_id TEXT,
  current_period_start DATE NOT NULL,
  current_period_end DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create usage tracking table
CREATE TABLE public.usage_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL,
  feature_name TEXT NOT NULL,
  usage_count INTEGER NOT NULL DEFAULT 0,
  reset_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(customer_id, feature_name, reset_date)
);

-- Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- RLS policies for subscription plans
CREATE POLICY "Plans are viewable by everyone" 
ON public.subscription_plans 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage all plans" 
ON public.subscription_plans 
FOR ALL 
USING (is_admin());

-- RLS policies for customer subscriptions
CREATE POLICY "Customers can view their own subscription" 
ON public.customer_subscriptions 
FOR SELECT 
USING (auth.uid() = customer_id);

CREATE POLICY "Admins can manage all subscriptions" 
ON public.customer_subscriptions 
FOR ALL 
USING (is_admin());

-- RLS policies for usage tracking
CREATE POLICY "Customers can view their own usage" 
ON public.usage_tracking 
FOR SELECT 
USING (auth.uid() = customer_id);

CREATE POLICY "Admins can view all usage" 
ON public.usage_tracking 
FOR SELECT 
USING (is_admin());

CREATE POLICY "System can update usage" 
ON public.usage_tracking 
FOR ALL 
USING (true);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, description, price_monthly, price_annual, features, limits) VALUES
('Starter', 'Perfect for small businesses getting started', 29.00, 290.00, 
 '["1 Voice Agent", "Basic Menu Integration", "Email Support", "Call Analytics", "Up to 500 minutes/month"]'::jsonb,
 '{"agents": 1, "minutes_per_month": 500, "menu_items": 50}'::jsonb),
('Professional', 'Ideal for growing restaurants and services', 79.00, 790.00, 
 '["3 Voice Agents", "Advanced Menu Integration", "Priority Support", "Advanced Analytics", "Up to 2,000 minutes/month", "Custom Greetings", "Call Routing"]'::jsonb,
 '{"agents": 3, "minutes_per_month": 2000, "menu_items": 200}'::jsonb),
('Enterprise', 'For large operations with custom needs', 199.00, 1990.00, 
 '["Unlimited Voice Agents", "Full Menu Integration", "24/7 Support", "Custom Analytics", "Unlimited minutes", "Custom Integrations", "Dedicated Support"]'::jsonb,
 '{"agents": -1, "minutes_per_month": -1, "menu_items": -1}'::jsonb);

-- Add business_info to agent_requests for dynamic forms
ALTER TABLE public.agent_requests ADD COLUMN business_type TEXT;
ALTER TABLE public.agent_requests ADD COLUMN business_info JSONB DEFAULT '{}';
ALTER TABLE public.agent_requests ADD COLUMN integration_needs JSONB DEFAULT '{}';

-- Create triggers for updated_at
CREATE TRIGGER update_subscription_plans_updated_at
BEFORE UPDATE ON public.subscription_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_subscriptions_updated_at
BEFORE UPDATE ON public.customer_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_usage_tracking_updated_at
BEFORE UPDATE ON public.usage_tracking
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();