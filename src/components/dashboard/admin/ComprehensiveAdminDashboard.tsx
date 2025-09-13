import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, MessageSquare, DollarSign, Activity, Calendar, Clock, 
  CheckCircle, XCircle, Settings, AlertCircle, TrendingUp,
  FileText, Eye, Edit3, User, Building, CreditCard
} from 'lucide-react';

interface CustomerProfile {
  id: string;
  contact_name: string;
  business_name?: string;
  phone?: string;
  industry?: string;
  user_id: string;
  created_at: string;
}

interface AgentRequest {
  id: string;
  request_type: string;
  description: string;
  status: string;
  created_at: string;
  admin_notes?: string;
  business_type?: string;
  customer_id: string;
  profiles?: CustomerProfile;
}

interface AdminStats {
  total_customers: number;
  active_agents: number;
  pending_requests: number;
  total_revenue: number;
  monthly_growth: number;
}

export const ComprehensiveAdminDashboard = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<AdminStats>({
    total_customers: 0,
    active_agents: 0,
    pending_requests: 0,
    total_revenue: 0,
    monthly_growth: 0
  });
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [agentRequests, setAgentRequests] = useState<AgentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<AgentRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [newStatus, setNewStatus] = useState<string>('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Fetch customers with profiles
      const { data: customersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch agent requests with customer info
      const { data: requestsData } = await supabase
        .from('agent_requests')
        .select(`
          *,
          profiles!agent_requests_customer_id_fkey (*)
        `)
        .order('created_at', { ascending: false });

      // Fetch voice agents count
      const { data: agentsData } = await supabase
        .from('voice_agents')
        .select('id')
        .eq('status', 'active');

      // Fetch billing data for revenue calculation
      const { data: billingData } = await supabase
        .from('billing_records')
        .select('total_amount');

      // Calculate stats
      const totalRevenue = billingData?.reduce((sum, record) => sum + Number(record.total_amount), 0) || 0;
      const pendingRequests = requestsData?.filter(req => req.status === 'pending').length || 0;

      setStats({
        total_customers: customersData?.length || 0,
        active_agents: agentsData?.length || 0,
        pending_requests: pendingRequests,
        total_revenue: totalRevenue,
        monthly_growth: 12.5 // This would be calculated from historical data
      });

      setCustomers(customersData || []);
      setAgentRequests(requestsData || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load admin data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRequest = async () => {
    if (!selectedRequest) return;

    try {
      const { error } = await supabase
        .from('agent_requests')
        .update({
          status: newStatus || selectedRequest.status,
          admin_notes: adminNotes
        })
        .eq('id', selectedRequest.id);

      if (error) throw error;

      toast({
        title: 'Request updated',
        description: 'Agent request has been updated successfully.',
      });

      setDialogOpen(false);
      setSelectedRequest(null);
      setAdminNotes('');
      setNewStatus('');
      fetchAdminData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const openRequestDialog = (request: AgentRequest) => {
    setSelectedRequest(request);
    setAdminNotes(request.admin_notes || '');
    setNewStatus(request.status);
    setDialogOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'in_progress':
        return <Activity className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <p className="text-muted-foreground">Comprehensive system management and analytics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">{stats.total_customers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Agents</p>
                <p className="text-2xl font-bold">{stats.active_agents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                <p className="text-2xl font-bold">{stats.pending_requests}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${stats.total_revenue.toFixed(0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Growth</p>
                <p className="text-2xl font-bold">+{stats.monthly_growth}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="requests" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Agent Requests</span>
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Customers</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* Agent Requests Tab */}
        <TabsContent value="requests" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Agent Requests Management</span>
              </CardTitle>
              <CardDescription>Review and process customer agent requests</CardDescription>
            </CardHeader>
            <CardContent>
              {agentRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No agent requests yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {agentRequests.map((request) => (
                    <Card key={request.id} className="border hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-3 flex-1">
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(request.status)}
                              <div>
                                <h4 className="font-medium capitalize">
                                  {request.request_type.replace('_', ' ')} Request
                                </h4>
                                <div className="flex items-center space-x-2">
                                  <p className="text-sm text-muted-foreground">
                                    by {request.profiles?.contact_name || 'Unknown'}
                                  </p>
                                  {request.business_type && (
                                    <Badge variant="outline" className="text-xs">
                                      {request.business_type}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-sm text-muted-foreground">{request.description}</p>
                            
                            {request.admin_notes && (
                              <div className="p-3 bg-muted/50 rounded-lg">
                                <p className="text-sm font-medium mb-1">Admin Notes:</p>
                                <p className="text-sm text-muted-foreground">{request.admin_notes}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <Badge variant={getStatusBadgeVariant(request.status)}>
                              {request.status}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openRequestDialog(request)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                          Submitted on {new Date(request.created_at).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Customer Management</span>
              </CardTitle>
              <CardDescription>View and manage customer profiles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customers.map((customer) => (
                  <Card key={customer.id} className="border hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{customer.contact_name}</h4>
                          {customer.business_name && (
                            <p className="text-sm text-muted-foreground flex items-center space-x-1">
                              <Building className="h-3 w-3" />
                              <span>{customer.business_name}</span>
                            </p>
                          )}
                          {customer.industry && (
                            <Badge variant="outline" className="text-xs mt-2">
                              {customer.industry}
                            </Badge>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            Joined {new Date(customer.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>System Analytics</span>
              </CardTitle>
              <CardDescription>Platform performance and usage metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Revenue Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Revenue analytics charts would go here</p>
                      <p className="text-sm">Integrate with charting library for detailed metrics</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Customer Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Customer growth charts would go here</p>
                      <p className="text-sm">Track user acquisition and retention</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>System Settings</span>
              </CardTitle>
              <CardDescription>Configure platform settings and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">General Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="platform-name">Platform Name</Label>
                        <Input id="platform-name" value="Heyloo AI" />
                      </div>
                      <div>
                        <Label htmlFor="support-email">Support Email</Label>
                        <Input id="support-email" value="support@heyloo.ai" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">API Configuration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>API settings and integrations would go here</p>
                      <p className="text-sm">Configure external service connections</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Request Update Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Agent Request</DialogTitle>
            <DialogDescription>
              Update the status and add admin notes for this request
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Request Details</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Type:</strong> {selectedRequest.request_type.replace('_', ' ')}</p>
                  <p><strong>Customer:</strong> {selectedRequest.profiles?.contact_name}</p>
                  <p><strong>Business:</strong> {selectedRequest.business_type || 'Not specified'}</p>
                  <p><strong>Description:</strong> {selectedRequest.description}</p>
                </div>
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="admin-notes">Admin Notes</Label>
                <Textarea
                  id="admin-notes"
                  placeholder="Add notes about the request status, requirements, or next steps..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRequest}>
              Update Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};