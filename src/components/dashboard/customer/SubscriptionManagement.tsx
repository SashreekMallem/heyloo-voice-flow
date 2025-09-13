import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Crown, Zap, Users, Calendar, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_annual: number;
  features: any;
  limits: any;
  is_active: boolean;
}

interface CustomerSubscription {
  id: string;
  plan_id: string;
  status: string;
  billing_cycle: string;
  current_period_end: string;
  subscription_plans: SubscriptionPlan;
}

interface UsageData {
  agents_used: number;
  minutes_used: number;
  menu_items_used: number;
}

export const SubscriptionManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<CustomerSubscription | null>(null);
  const [usage, setUsage] = useState<UsageData>({ agents_used: 0, minutes_used: 0, menu_items_used: 0 });
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  useEffect(() => {
    fetchSubscriptionData();
  }, [user]);

  const fetchSubscriptionData = async () => {
    if (!user) return;

    try {
      // Fetch available plans
      const { data: plansData } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly', { ascending: true });

      // Fetch current subscription
      const { data: subscriptionData } = await supabase
        .from('customer_subscriptions')
        .select(`
          *,
          subscription_plans (*)
        `)
        .eq('customer_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      // Fetch usage data
      const [agentsResponse, menuItemsResponse] = await Promise.all([
        supabase
          .from('voice_agents')
          .select('id')
          .eq('customer_id', user.id),
        supabase
          .from('menu_items')
          .select('id')
          .eq('customer_id', user.id)
      ]);

      // Get current month's usage
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      const { data: monthlyUsage } = await supabase
        .from('monthly_usage')
        .select('total_minutes')
        .eq('customer_id', user.id)
        .eq('year', currentYear)
        .eq('month', currentMonth)
        .maybeSingle();

      setPlans(plansData || []);
      setCurrentSubscription(subscriptionData);
      setUsage({
        agents_used: agentsResponse.data?.length || 0,
        minutes_used: monthlyUsage?.total_minutes || 0,
        menu_items_used: menuItemsResponse.data?.length || 0
      });
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setUpgradeDialogOpen(true);
  };

  const processPlanChange = async () => {
    if (!selectedPlan || !user) return;

    try {
      // In a real app, this would integrate with Stripe
      // For now, we'll simulate the subscription change
      
      const subscriptionData = {
        customer_id: user.id,
        plan_id: selectedPlan.id,
        status: 'active',
        billing_cycle: billingCycle,
        current_period_start: new Date().toISOString().split('T')[0],
        current_period_end: new Date(Date.now() + (billingCycle === 'annual' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };

      if (currentSubscription) {
        // Update existing subscription
        const { error } = await supabase
          .from('customer_subscriptions')
          .update(subscriptionData)
          .eq('id', currentSubscription.id);
        
        if (error) throw error;
      } else {
        // Create new subscription
        const { error } = await supabase
          .from('customer_subscriptions')
          .insert([subscriptionData]);
        
        if (error) throw error;
      }

      toast({
        title: 'Subscription updated',
        description: `Successfully ${currentSubscription ? 'updated' : 'created'} your ${selectedPlan.name} subscription.`,
      });

      setUpgradeDialogOpen(false);
      fetchSubscriptionData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'starter':
        return <Zap className="h-5 w-5" />;
      case 'professional':
        return <Users className="h-5 w-5" />;
      case 'enterprise':
        return <Crown className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-32 bg-muted rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentPlan = currentSubscription?.subscription_plans;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold">Subscription & Billing</h3>
        <p className="text-muted-foreground">Manage your subscription plan and track usage</p>
      </div>

      {/* Current Subscription Status */}
      {currentSubscription ? (
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  {getPlanIcon(currentPlan?.name || '')}
                </div>
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>{currentPlan?.name} Plan</span>
                    <Badge variant="default">Active</Badge>
                  </CardTitle>
                  <CardDescription>
                    ${currentSubscription.billing_cycle === 'annual' 
                      ? currentPlan?.price_annual.toFixed(2) 
                      : currentPlan?.price_monthly.toFixed(2)
                    } per {currentSubscription.billing_cycle === 'annual' ? 'year' : 'month'}
                  </CardDescription>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Renews on</p>
                <p className="font-medium">
                  {new Date(currentSubscription.current_period_end).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h4 className="font-medium">Usage This Month</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Voice Agents</span>
                        <span className="text-sm text-muted-foreground">
                          {usage.agents_used} / {currentPlan?.limits.agents === -1 ? '∞' : currentPlan?.limits.agents}
                        </span>
                      </div>
                      <Progress 
                        value={getUsagePercentage(usage.agents_used, currentPlan?.limits.agents || 0)}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Minutes Used</span>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(usage.minutes_used)} / {currentPlan?.limits.minutes_per_month === -1 ? '∞' : currentPlan?.limits.minutes_per_month}
                        </span>
                      </div>
                      <Progress 
                        value={getUsagePercentage(usage.minutes_used, currentPlan?.limits.minutes_per_month || 0)}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Menu Items</span>
                        <span className="text-sm text-muted-foreground">
                          {usage.menu_items_used} / {currentPlan?.limits.menu_items === -1 ? '∞' : currentPlan?.limits.menu_items}
                        </span>
                      </div>
                      <Progress 
                        value={getUsagePercentage(usage.menu_items_used, currentPlan?.limits.menu_items || 0)}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Usage warnings */}
              {(getUsagePercentage(usage.agents_used, currentPlan?.limits.agents || 0) > 80 ||
                getUsagePercentage(usage.minutes_used, currentPlan?.limits.minutes_per_month || 0) > 80) && (
                <div className="flex items-start space-x-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Approaching usage limits
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Consider upgrading your plan to avoid service interruptions.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-card border-dashed">
          <CardContent className="p-8 text-center">
            <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Active Subscription</h3>
            <p className="text-muted-foreground mb-4">
              Choose a plan to get started with Heyloo AI voice agents
            </p>
          </CardContent>
        </Card>
      )}

      {/* Available Plans */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold">Available Plans</h4>
          <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
            <Button
              size="sm"
              variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </Button>
            <Button
              size="sm"
              variant={billingCycle === 'annual' ? 'default' : 'ghost'}
              onClick={() => setBillingCycle('annual')}
            >
              Annual <Badge variant="secondary" className="ml-1">Save 17%</Badge>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrentPlan = currentPlan?.id === plan.id;
            const price = billingCycle === 'annual' ? plan.price_annual : plan.price_monthly;
            const savings = billingCycle === 'annual' ? ((plan.price_monthly * 12 - plan.price_annual) / (plan.price_monthly * 12) * 100) : 0;

            return (
              <Card key={plan.id} className={`relative ${isCurrentPlan ? 'border-primary shadow-lg' : 'hover:shadow-lg transition-shadow'} ${plan.name.toLowerCase() === 'professional' ? 'border-primary/50' : ''}`}>
                {plan.name.toLowerCase() === 'professional' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className="mx-auto p-2 bg-primary/10 rounded-lg w-fit">
                    {getPlanIcon(plan.name)}
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold">
                      ${price.toFixed(0)}
                      <span className="text-base font-normal text-muted-foreground">
                        /{billingCycle === 'annual' ? 'year' : 'month'}
                      </span>
                    </div>
                    {billingCycle === 'annual' && savings > 0 && (
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Save {savings.toFixed(0)}% annually
                      </p>
                    )}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="pt-4">
                    {isCurrentPlan ? (
                      <Button className="w-full" variant="outline" disabled>
                        Current Plan
                      </Button>
                    ) : (
                      <Button 
                        className="w-full" 
                        onClick={() => handleUpgrade(plan)}
                        variant={plan.name.toLowerCase() === 'professional' ? 'default' : 'outline'}
                      >
                        {currentSubscription ? 'Switch Plan' : 'Get Started'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Upgrade Dialog */}
      <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentSubscription ? 'Switch Plan' : 'Subscribe to'} {selectedPlan?.name}
            </DialogTitle>
            <DialogDescription>
              {currentSubscription 
                ? `You're about to switch from ${currentPlan?.name} to ${selectedPlan?.name}.`
                : `You're about to subscribe to the ${selectedPlan?.name} plan.`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Plan Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Plan:</span>
                  <span className="font-medium">{selectedPlan?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Billing:</span>
                  <span className="font-medium capitalize">{billingCycle}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price:</span>
                  <span className="font-medium">
                    ${billingCycle === 'annual' 
                      ? selectedPlan?.price_annual.toFixed(2) 
                      : selectedPlan?.price_monthly.toFixed(2)
                    } per {billingCycle === 'annual' ? 'year' : 'month'}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              This is a demo. In a real application, this would integrate with Stripe for secure payment processing.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpgradeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={processPlanChange}>
              {currentSubscription ? 'Switch Plan' : 'Subscribe Now'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};