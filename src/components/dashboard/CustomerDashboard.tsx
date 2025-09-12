import { useState } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomerAnalytics } from './customer/CustomerAnalytics';
import { AgentRequests } from './customer/AgentRequests';
import { BillingSection } from './customer/BillingSection';
import { MenuManagement } from './customer/MenuManagement';
import { SupportTickets } from './customer/SupportTickets';
import { BarChart3, MessageSquare, CreditCard, Menu, HelpCircle } from 'lucide-react';

export const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <DashboardLayout title="Customer Dashboard">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="agents" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Agents</span>
          </TabsTrigger>
          <TabsTrigger value="menu" className="flex items-center space-x-2">
            <Menu className="h-4 w-4" />
            <span>Menu</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Billing</span>
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center space-x-2">
            <HelpCircle className="h-4 w-4" />
            <span>Support</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <CustomerAnalytics />
        </TabsContent>

        <TabsContent value="agents">
          <AgentRequests />
        </TabsContent>

        <TabsContent value="menu">
          <MenuManagement />
        </TabsContent>

        <TabsContent value="billing">
          <BillingSection />
        </TabsContent>

        <TabsContent value="support">
          <SupportTickets />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};