import { DashboardLayout } from './DashboardLayout';
import { ComprehensiveAdminDashboard } from './admin/ComprehensiveAdminDashboard';

export const AdminDashboard = () => {
  return (
    <DashboardLayout title="Admin Dashboard">
      <ComprehensiveAdminDashboard />
    </DashboardLayout>
  );
};