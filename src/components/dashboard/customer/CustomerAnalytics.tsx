import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Phone, Clock, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AnalyticsData {
  totalCalls: number;
  totalMinutes: number;
  successRate: number;
  totalCost: number;
  recentCalls: any[];
  monthlyData: any[];
}

export const CustomerAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalCalls: 0,
    totalMinutes: 0,
    successRate: 0,
    totalCost: 0,
    recentCalls: [],
    monthlyData: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;

      try {
        // Fetch call analytics
        const { data: callData } = await supabase
          .from('call_analytics')
          .select('*')
          .eq('customer_id', user.id)
          .order('call_start_time', { ascending: false });

        // Fetch monthly usage
        const { data: monthlyData } = await supabase
          .from('monthly_usage')
          .select('*')
          .eq('customer_id', user.id)
          .order('year', { ascending: true })
          .order('month', { ascending: true });

        const totalCalls = callData?.length || 0;
        const totalMinutes = callData?.reduce((sum, call) => sum + (call.call_duration || 0), 0) / 60 || 0;
        const successfulCalls = callData?.filter(call => call.call_status === 'completed').length || 0;
        const successRate = totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : 0;
        const totalCost = callData?.reduce((sum, call) => sum + (call.total_cost || 0), 0) || 0;

        setAnalytics({
          totalCalls,
          totalMinutes,
          successRate,
          totalCost,
          recentCalls: callData?.slice(0, 10) || [],
          monthlyData: monthlyData || [],
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  const stats = [
    {
      title: 'Total Calls',
      value: analytics.totalCalls.toLocaleString(),
      icon: Phone,
      description: 'Calls this month',
    },
    {
      title: 'Total Minutes',
      value: Math.round(analytics.totalMinutes).toLocaleString(),
      icon: Clock,
      description: 'Usage this month',
    },
    {
      title: 'Success Rate',
      value: `${Math.round(analytics.successRate)}%`,
      icon: CheckCircle,
      description: 'Successful connections',
    },
    {
      title: 'Total Cost',
      value: `$${analytics.totalCost.toFixed(2)}`,
      icon: TrendingUp,
      description: 'This month\'s charges',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
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
        <h3 className="text-2xl font-bold">Analytics Overview</h3>
        <p className="text-muted-foreground">Track your voice AI agent performance and usage</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {analytics.monthlyData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Monthly Usage Trend</CardTitle>
              <CardDescription>Call volume over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="total_calls" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Monthly Costs</CardTitle>
              <CardDescription>Usage costs over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Cost']} />
                  <Bar dataKey="total_cost" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {analytics.recentCalls.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Recent Calls</CardTitle>
            <CardDescription>Latest call activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.recentCalls.map((call, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-1 rounded-full ${
                      call.call_status === 'completed' ? 'bg-green-100 text-green-600' : 
                      call.call_status === 'missed' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {call.call_status === 'completed' ? <CheckCircle className="h-4 w-4" /> : 
                       <AlertCircle className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium">{call.caller_phone || 'Unknown'}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(call.call_start_time).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{Math.round((call.call_duration || 0) / 60)}m</p>
                    <p className="text-sm text-muted-foreground">${(call.total_cost || 0).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};