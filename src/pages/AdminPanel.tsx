
import { useState } from 'react';
import AppHeader from '@/components/AppHeader';
import UserList from '@/features/admin/UserList';
import TransactionLogs from '@/features/admin/TransactionLogs';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart2, Users } from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="min-h-screen bg-muted/30">
      <AppHeader />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Manage users and transactions</p>
          </div>
          <div className="hidden sm:block">
            <Button disabled variant="outline">Download Reports</Button>
          </div>
        </div>
        
        <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="users" className="flex items-center">
              <Users className="mr-2 h-4 w-4" /> 
              Users
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center">
              <BarChart2 className="mr-2 h-4 w-4" /> 
              Transactions
            </TabsTrigger>
          </TabsList>
          <TabsContent value="users">
            <UserList />
          </TabsContent>
          <TabsContent value="transactions">
            <TransactionLogs />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
