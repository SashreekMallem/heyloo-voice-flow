import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Download, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BillingRecord {
  id: string;
  billing_period_start: string;
  billing_period_end: string;
  total_minutes: number;
  cost_per_minute: number;
  total_amount: number;
  paid_at?: string;
  payment_method?: string;
  created_at: string;
}

export const BillingSection = () => {
  const { user } = useAuth();
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([]);
  const [currentUsage, setCurrentUsage] = useState({
    totalMinutes: 0,
    estimatedCost: 0,
    callsThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBillingData();
  }, [user]);

  const fetchBillingData = async () => {
    if (!user) return;

    try {
      // Fetch billing records
      const { data: billingData } = await supabase
        .from('billing_records')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch current month usage
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      const { data: usageData } = await supabase
        .from('monthly_usage')
        .select('*')
        .eq('customer_id', user.id)
        .eq('year', currentYear)
        .eq('month', currentMonth)
        .single();

      // Fetch current month call analytics for real-time data
      const startOfMonth = new Date(currentYear, currentMonth - 1, 1).toISOString();
      const { data: callData } = await supabase
        .from('call_analytics')
        .select('call_duration, total_cost')
        .eq('customer_id', user.id)
        .gte('call_start_time', startOfMonth);

      const totalMinutes = callData?.reduce((sum, call) => sum + (call.call_duration || 0), 0) / 60 || 0;
      const estimatedCost = callData?.reduce((sum, call) => sum + (call.total_cost || 0), 0) || 0;
      const callsThisMonth = callData?.length || 0;

      setBillingRecords(billingData || []);
      setCurrentUsage({
        totalMinutes: Math.round(totalMinutes),
        estimatedCost,
        callsThisMonth,
      });
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold">Billing & Usage</h3>
        <p className="text-muted-foreground">Track your usage and billing information</p>
      </div>

      {/* Current Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">{currentUsage.callsThisMonth}</p>
                <p className="text-xs text-muted-foreground">Total calls</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Minutes Used</p>
                <p className="text-2xl font-bold">{currentUsage.totalMinutes}</p>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estimated Cost</p>
                <p className="text-2xl font-bold">${currentUsage.estimatedCost.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Information */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Pricing Information</CardTitle>
          <CardDescription>Current rates for voice AI services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Per-minute rate</p>
                  <p className="text-sm text-muted-foreground">Standard voice calls</p>
                </div>
                <p className="text-lg font-bold">$0.05/min</p>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Setup fee</p>
                  <p className="text-sm text-muted-foreground">One-time per agent</p>
                </div>
                <p className="text-lg font-bold">Free</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <h4 className="font-medium mb-2">Billing Cycle</h4>
                <p className="text-sm text-muted-foreground">
                  Billing occurs monthly based on actual usage. You'll be charged for completed calls only.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Your past invoices and payments</CardDescription>
        </CardHeader>
        <CardContent>
          {billingRecords.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No billing history yet</p>
              <p className="text-sm">Your first invoice will appear after usage</p>
            </div>
          ) : (
            <div className="space-y-4">
              {billingRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">
                      {new Date(record.billing_period_start).toLocaleDateString()} - {' '}
                      {new Date(record.billing_period_end).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {Math.round(record.total_minutes)} minutes • ${record.cost_per_minute}/min
                    </p>
                    {record.paid_at && (
                      <p className="text-xs text-green-600">
                        Paid on {new Date(record.paid_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-lg font-bold">${record.total_amount.toFixed(2)}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        record.paid_at 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {record.paid_at ? 'Paid' : 'Pending'}
                      </span>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};