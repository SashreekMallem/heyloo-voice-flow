import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';

interface AgentRequest {
  id: string;
  request_type: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  created_at: string;
  admin_notes?: string;
}

interface VoiceAgent {
  id: string;
  agent_name: string;
  status: string;
}

export const AgentRequests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<AgentRequest[]>([]);
  const [agents, setAgents] = useState<VoiceAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    request_type: '',
    description: '',
    requirements: {
      agent_name: '',
      personality: '',
      greeting: '',
      language: 'English',
      voice_type: 'female',
    },
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
          requirements: formData.requirements,
        });

      if (error) throw error;

      toast({
        title: 'Request submitted',
        description: 'Your agent request has been submitted successfully.',
      });

      setDialogOpen(false);
      setFormData({
        request_type: '',
        description: '',
        requirements: {
          agent_name: '',
          personality: '',
          greeting: '',
          language: 'English',
          voice_type: 'female',
        },
      });
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
          <p className="text-muted-foreground">Request new agents or modifications to existing ones</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>New Request</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submit Agent Request</DialogTitle>
              <DialogDescription>
                Describe what you need and our team will configure your voice agent
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
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
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your requirements in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-[100px]"
                />
              </div>

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
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitRequest} disabled={submitting}>
                Submit Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Current Agents */}
      {agents.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Current Agents</CardTitle>
            <CardDescription>Your active voice agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map((agent) => (
                <Card key={agent.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{agent.agent_name}</h4>
                        <p className="text-sm text-muted-foreground capitalize">{agent.status}</p>
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
          <CardTitle>Request History</CardTitle>
          <CardDescription>Track the status of your agent requests</CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No agent requests yet</p>
              <p className="text-sm">Submit your first request to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(request.status)}
                          <h4 className="font-medium capitalize">{request.request_type.replace('_', ' ')}</h4>
                          <span className="px-2 py-1 text-xs rounded-full bg-muted">
                            {request.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{request.description}</p>
                        {request.admin_notes && (
                          <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm font-medium">Admin Notes:</p>
                            <p className="text-sm text-muted-foreground">{request.admin_notes}</p>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(request.created_at).toLocaleDateString()}
                      </div>
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