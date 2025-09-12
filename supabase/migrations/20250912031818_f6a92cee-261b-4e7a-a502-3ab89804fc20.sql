-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE public.app_role AS ENUM ('customer', 'admin', 'super_admin');
CREATE TYPE public.call_status AS ENUM ('completed', 'missed', 'failed', 'in_progress');
CREATE TYPE public.agent_status AS ENUM ('active', 'inactive', 'pending', 'training');
CREATE TYPE public.request_status AS ENUM ('pending', 'in_progress', 'completed', 'rejected');
CREATE TYPE public.ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE public.ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    business_name TEXT,
    contact_name TEXT,
    phone TEXT,
    industry TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user roles table
CREATE TABLE public.user_roles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL DEFAULT 'customer',
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    assigned_by UUID REFERENCES auth.users(id),
    UNIQUE(user_id, role)
);

-- Create voice agents table
CREATE TABLE public.voice_agents (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    agent_name TEXT NOT NULL,
    agent_personality TEXT,
    greeting_message TEXT,
    language TEXT DEFAULT 'English',
    voice_type TEXT DEFAULT 'female',
    status agent_status DEFAULT 'pending',
    vapi_agent_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create agent requests table (for customers to request changes)
CREATE TABLE public.agent_requests (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES public.voice_agents(id) ON DELETE CASCADE,
    request_type TEXT NOT NULL, -- 'create', 'update', 'configure'
    description TEXT NOT NULL,
    requirements JSONB,
    status request_status DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create call analytics table
CREATE TABLE public.call_analytics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES public.voice_agents(id) ON DELETE CASCADE,
    call_id TEXT,
    caller_phone TEXT,
    call_status call_status,
    call_start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    call_end_time TIMESTAMP WITH TIME ZONE,
    call_duration INTEGER, -- in seconds
    total_cost DECIMAL(10,4),
    transcript TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create monthly usage summary table
CREATE TABLE public.monthly_usage (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    total_calls INTEGER DEFAULT 0,
    total_minutes DECIMAL(10,2) DEFAULT 0,
    successful_calls INTEGER DEFAULT 0,
    missed_calls INTEGER DEFAULT 0,
    average_call_duration DECIMAL(10,2) DEFAULT 0,
    total_cost DECIMAL(10,4) DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(customer_id, year, month)
);

-- Create menu items table
CREATE TABLE public.menu_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES public.voice_agents(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    category TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create billing records table
CREATE TABLE public.billing_records (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    total_minutes DECIMAL(10,2) DEFAULT 0,
    cost_per_minute DECIMAL(10,4) DEFAULT 0.05,
    total_amount DECIMAL(10,4) NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE,
    payment_method TEXT,
    stripe_invoice_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create support tickets table
CREATE TABLE public.support_tickets (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    ticket_number TEXT UNIQUE NOT NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status ticket_status DEFAULT 'open',
    priority ticket_priority DEFAULT 'medium',
    assigned_to UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Create function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID DEFAULT auth.uid())
RETURNS app_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.user_roles WHERE user_roles.user_id = get_user_role.user_id LIMIT 1;
$$;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = is_admin.user_id 
    AND role IN ('admin', 'super_admin')
  );
$$;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (public.is_admin());

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
    FOR ALL USING (public.is_admin());

-- Voice agents policies
CREATE POLICY "Customers can view their own agents" ON public.voice_agents
    FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Admins can view all agents" ON public.voice_agents
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can manage all agents" ON public.voice_agents
    FOR ALL USING (public.is_admin());

-- Agent requests policies
CREATE POLICY "Customers can view their own requests" ON public.agent_requests
    FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Customers can create their own requests" ON public.agent_requests
    FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Admins can view all requests" ON public.agent_requests
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can manage all requests" ON public.agent_requests
    FOR ALL USING (public.is_admin());

-- Call analytics policies
CREATE POLICY "Customers can view their own analytics" ON public.call_analytics
    FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Admins can view all analytics" ON public.call_analytics
    FOR ALL USING (public.is_admin());

-- Monthly usage policies
CREATE POLICY "Customers can view their own usage" ON public.monthly_usage
    FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Admins can view all usage" ON public.monthly_usage
    FOR ALL USING (public.is_admin());

-- Menu items policies
CREATE POLICY "Customers can manage their own menu items" ON public.menu_items
    FOR ALL USING (auth.uid() = customer_id);

CREATE POLICY "Admins can view all menu items" ON public.menu_items
    FOR SELECT USING (public.is_admin());

-- Billing records policies
CREATE POLICY "Customers can view their own billing" ON public.billing_records
    FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Admins can manage all billing" ON public.billing_records
    FOR ALL USING (public.is_admin());

-- Support tickets policies
CREATE POLICY "Customers can manage their own tickets" ON public.support_tickets
    FOR ALL USING (auth.uid() = customer_id);

CREATE POLICY "Admins can manage all tickets" ON public.support_tickets
    FOR ALL USING (public.is_admin());

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_voice_agents_updated_at
    BEFORE UPDATE ON public.voice_agents
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agent_requests_updated_at
    BEFORE UPDATE ON public.agent_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_monthly_usage_updated_at
    BEFORE UPDATE ON public.monthly_usage
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at
    BEFORE UPDATE ON public.menu_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at
    BEFORE UPDATE ON public.support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for ticket number generation
CREATE TRIGGER generate_ticket_number_trigger
    BEFORE INSERT ON public.support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION public.generate_ticket_number();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Create profile
    INSERT INTO public.profiles (user_id, contact_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email));
    
    -- Assign default customer role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'customer');
    
    RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_voice_agents_customer_id ON public.voice_agents(customer_id);
CREATE INDEX idx_agent_requests_customer_id ON public.agent_requests(customer_id);
CREATE INDEX idx_call_analytics_customer_id ON public.call_analytics(customer_id);
CREATE INDEX idx_call_analytics_start_time ON public.call_analytics(call_start_time);
CREATE INDEX idx_monthly_usage_customer_year_month ON public.monthly_usage(customer_id, year, month);
CREATE INDEX idx_menu_items_customer_id ON public.menu_items(customer_id);
CREATE INDEX idx_billing_records_customer_id ON public.billing_records(customer_id);
CREATE INDEX idx_support_tickets_customer_id ON public.support_tickets(customer_id);