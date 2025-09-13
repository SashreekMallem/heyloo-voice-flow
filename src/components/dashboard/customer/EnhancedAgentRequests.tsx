import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, MessageSquare, Clock, CheckCircle, XCircle, Building, Phone, Calendar, Settings } from 'lucide-react';

interface AgentRequest {
  id: string;
  request_type: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  created_at: string;
  admin_notes?: string;
  business_type?: string;
  business_info?: any;
  integration_needs?: any;
  requirements?: any;
}

interface VoiceAgent {
  id: string;
  agent_name: string;
  status: string;
}

const businessTypes = [
  'Restaurant', 'Hotel', 'Medical Practice', 'Retail Store', 
  'Beauty Salon', 'Fitness Center', 'Legal Office', 'Real Estate', 'Other'
];

export const EnhancedAgentRequests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<AgentRequest[]>([]);
  const [agents, setAgents] = useState<VoiceAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    request_type: '',
    description: '',
    business_type: '',
    business_info: {
      business_name: '',
      operating_hours: '',
      phone_number: '',
      website: '',
      location: '',
      services: []
    },
    integration_needs: {
      pos_system: '',
      booking_system: '',
      crm_system: '',
      payment_processor: '',
      other_integrations: []
    },
    requirements: {
      agent_name: '',
      personality: '',
      greeting: '',
      language: 'English',
      voice_type: 'female',
      call_flows: [],
      special_instructions: ''
    }
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      const [requestsResponse, agentsResponse] = await Promise.all([
        supabase
          .from('agent_requests')
          .select('*')
          .eq('customer_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('voice_agents')
          .select('id, agent_name, status')
          .eq('customer_id', user.id)
      ]);

      setRequests(requestsResponse.data || []);
      setAgents(agentsResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async () => {
    if (!user) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('agent_requests')
        .insert({
          customer_id: user.id,
          request_type: formData.request_type,
          description: formData.description,
          business_type: formData.business_type,
          business_info: formData.business_info,
          integration_needs: formData.integration_needs,
          requirements: formData.requirements,
        });

      if (error) throw error;

      toast({
        title: 'Request submitted',
        description: 'Your comprehensive agent request has been submitted successfully.',
      });

      handleCloseDialog();
      fetchData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentStep(1);
    setFormData({
      request_type: '',
      description: '',
      business_type: '',
      business_info: {
        business_name: '',
        operating_hours: '',
        phone_number: '',
        website: '',
        location: '',
        services: []
      },
      integration_needs: {
        pos_system: '',
        booking_system: '',
        crm_system: '',
        payment_processor: '',
        other_integrations: []
      },
      requirements: {
        agent_name: '',
        personality: '',
        greeting: '',
        language: 'English',
        voice_type: 'female',
        call_flows: [],
        special_instructions: ''
      }
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h4 className="font-medium">Basic Information</h4>
            <div>
              <Label htmlFor="request-type">Request Type</Label>
              <Select value={formData.request_type} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, request_type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select request type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="create">Create New Agent</SelectItem>
                  <SelectItem value="update">Update Existing Agent</SelectItem>
                  <SelectItem value="configure">Configure Settings</SelectItem>
                  <SelectItem value="integration">Add Integrations</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="business-type">Business Type</Label>
              <Select value={formData.business_type} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, business_type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your business type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your requirements in detail..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h4 className="font-medium">Business Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="business-name">Business Name</Label>
                <Input
                  id="business-name"
                  placeholder="Your Business Name"
                  value={formData.business_info.business_name}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    business_info: { ...prev.business_info, business_name: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="(555) 123-4567"
                  value={formData.business_info.phone_number}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    business_info: { ...prev.business_info, phone_number: e.target.value }
                  }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="operating-hours">Operating Hours</Label>
              <Input
                id="operating-hours"
                placeholder="Mon-Fri 9AM-6PM, Sat 10AM-4PM"
                value={formData.business_info.operating_hours}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  business_info: { ...prev.business_info, operating_hours: e.target.value }
                }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="https://yourwebsite.com"
                  value={formData.business_info.website}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    business_info: { ...prev.business_info, website: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="location">Location/Address</Label>
                <Input
                  id="location"
                  placeholder="City, State"
                  value={formData.business_info.location}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    business_info: { ...prev.business_info, location: e.target.value }
                  }))}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h4 className="font-medium">Integration Requirements</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pos-system">POS System</Label>
                <Input
                  id="pos-system"
                  placeholder="e.g., Square, Toast, Clover"
                  value={formData.integration_needs.pos_system}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    integration_needs: { ...prev.integration_needs, pos_system: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="booking-system">Booking System</Label>
                <Input
                  id="booking-system"
                  placeholder="e.g., OpenTable, Resy"
                  value={formData.integration_needs.booking_system}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    integration_needs: { ...prev.integration_needs, booking_system: e.target.value }
                  }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="crm-system">CRM System</Label>
                <Input
                  id="crm-system"
                  placeholder="e.g., Salesforce, HubSpot"
                  value={formData.integration_needs.crm_system}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    integration_needs: { ...prev.integration_needs, crm_system: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="payment-processor">Payment Processor</Label>
                <Input
                  id="payment-processor"
                  placeholder="e.g., Stripe, PayPal"
                  value={formData.integration_needs.payment_processor}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    integration_needs: { ...prev.integration_needs, payment_processor: e.target.value }
                  }))}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h4 className="font-medium">Agent Configuration</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="agent-name">Agent Name</Label>
                <Input
                  id="agent-name"
                  placeholder="e.g., Restaurant Assistant"
                  value={formData.requirements.agent_name}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    requirements: { ...prev.requirements, agent_name: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <Select value={formData.requirements.language} onValueChange={(value) => 
                  setFormData(prev => ({
                    ...prev,
                    requirements: { ...prev.requirements, language: value }
                  }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="personality">Personality & Tone</Label>
              <Textarea
                id="personality"
                placeholder="Describe the desired personality (e.g., friendly, professional, casual)..."
                value={formData.requirements.personality}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  requirements: { ...prev.requirements, personality: e.target.value }
                }))}
              />
            </div>

            <div>
              <Label htmlFor="greeting">Greeting Message</Label>
              <Textarea
                id="greeting"
                placeholder="How should the agent greet callers?"
                value={formData.requirements.greeting}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  requirements: { ...prev.requirements, greeting: e.target.value }
                }))}
              />
            </div>

            <div>
              <Label htmlFor="special-instructions">Special Instructions</Label>
              <Textarea
                id="special-instructions"
                placeholder="Any specific instructions or requirements..."
                value={formData.requirements.special_instructions}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  requirements: { ...prev.requirements, special_instructions: e.target.value }
                }))}
              />
            </div>
          </div>
        );

      default:
        return null;
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Voice Agent Requests</h3>
          <p className="text-muted-foreground">Create comprehensive agent requests with detailed business requirements</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>New Request</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Submit Comprehensive Agent Request</DialogTitle>
              <DialogDescription>
                Step {currentStep} of 4 - Complete all steps for a detailed agent configuration
              </DialogDescription>
            </DialogHeader>

            <div className="mb-4">
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {step}
                    </div>
                    {step < 4 && <div className={`w-12 h-0.5 ${currentStep > step ? 'bg-primary' : 'bg-muted'}`} />}
                  </div>
                ))}
              </div>
            </div>

            {renderStepContent()}

            <DialogFooter className="flex justify-between">
              <div>
                {currentStep > 1 && (
                  <Button variant="outline" onClick={() => setCurrentStep(prev => prev - 1)}>
                    Previous
                  </Button>
                )}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                {currentStep < 4 ? (
                  <Button onClick={() => setCurrentStep(prev => prev + 1)}>
                    Next
                  </Button>
                ) : (
                  <Button onClick={handleSubmitRequest} disabled={submitting}>
                    Submit Request
                  </Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Current Agents */}
      {agents.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Current Agents</span>
            </CardTitle>
            <CardDescription>Your active voice agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map((agent) => (
                <Card key={agent.id} className="border hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{agent.agent_name}</h4>
                        <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                          {agent.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Requests History */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Request History</span>
          </CardTitle>
          <CardDescription>Track the status of your agent requests with full details</CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No agent requests yet</p>
              <p className="text-sm">Submit your first comprehensive request to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="border hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(request.status)}
                          <div>
                            <h4 className="font-medium capitalize">{request.request_type.replace('_', ' ')}</h4>
                            <Badge variant="outline">{request.business_type}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={
                            request.status === 'completed' ? 'default' :
                            request.status === 'in_progress' ? 'secondary' :
                            request.status === 'rejected' ? 'destructive' : 'outline'
                          }>
                            {request.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(request.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">{request.description}</p>

                      {request.business_info && Object.keys(request.business_info).length > 0 && (
                        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                          <div>
                            <h5 className="font-medium text-sm mb-2">Business Information</h5>
                            <div className="space-y-1 text-xs">
                              {request.business_info.business_name && (
                                <p><strong>Name:</strong> {request.business_info.business_name}</p>
                              )}
                              {request.business_info.operating_hours && (
                                <p><strong>Hours:</strong> {request.business_info.operating_hours}</p>
                              )}
                            </div>
                          </div>
                          {request.integration_needs && Object.values(request.integration_needs).some(v => v) && (
                            <div>
                              <h5 className="font-medium text-sm mb-2">Integrations</h5>
                              <div className="space-y-1 text-xs">
                                {request.integration_needs.pos_system && (
                                  <p><strong>POS:</strong> {request.integration_needs.pos_system}</p>
                                )}
                                {request.integration_needs.booking_system && (
                                  <p><strong>Booking:</strong> {request.integration_needs.booking_system}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {request.admin_notes && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <h5 className="font-medium text-sm mb-2 text-blue-900 dark:text-blue-100">Admin Notes</h5>
                          <p className="text-sm text-blue-800 dark:text-blue-200">{request.admin_notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};