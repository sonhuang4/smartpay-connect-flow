
import { useState } from 'react';
import AppHeader from '@/components/AppHeader';
import WalletBalance from '@/features/wallet/WalletBalance';
import TopUpForm from '@/features/wallet/TopUpForm';
import { useAuthStore } from '@/store/authStore';
import { useWalletStore } from '@/store/walletStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Send, CreditCard, Clock, Settings, BarChart2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { getUserTransactions } = useWalletStore();
  const [showTopUp, setShowTopUp] = useState(false);
  
  // Get the latest 5 transactions
  const latestTransactions = user 
    ? getUserTransactions(user.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5) 
    : [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <AppHeader />
      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-6 md:gap-8">
          {/* Welcome section */}
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
            <p className="text-muted-foreground">Manage your money and make secure transactions</p>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-auto flex flex-col items-center justify-center py-4 px-2"
              asChild
            >
              <Link to="/transfer">
                <Send className="h-6 w-6 mb-2" />
                <span>Send Money</span>
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto flex flex-col items-center justify-center py-4 px-2"
              onClick={() => setShowTopUp(!showTopUp)}
            >
              <CreditCard className="h-6 w-6 mb-2" />
              <span>Add Money</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto flex flex-col items-center justify-center py-4 px-2"
              disabled
            >
              <Clock className="h-6 w-6 mb-2" />
              <span>History</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto flex flex-col items-center justify-center py-4 px-2"
              disabled
            >
              <Settings className="h-6 w-6 mb-2" />
              <span>Settings</span>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-7 gap-6">
            {/* Main content */}
            <div className="md:col-span-4 space-y-6">
              {/* Wallet Balance */}
              <WalletBalance />
              
              {/* Recent Transactions */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center">
                      <BarChart2 className="mr-2 h-5 w-5" />
                      Recent Transactions
                    </CardTitle>
                    <CardDescription>Your latest financial activities</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-1" disabled>
                    View All <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {latestTransactions.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <AlertCircle className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 font-semibold">No transactions yet</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Start sending or receiving money to see your transactions here.
                      </p>
                      <Button asChild className="mt-4">
                        <Link to="/transfer">Send Money</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {latestTransactions.map((transaction) => {
                        const isReceived = transaction.recipientId === user?.id;
                        return (
                          <div 
                            key={transaction.id} 
                            className="flex justify-between items-center p-3 rounded-lg border"
                          >
                            <div className="flex items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isReceived ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                              }`}>
                                {isReceived ? (
                                  <ArrowRight className="h-5 w-5" />
                                ) : (
                                  <Send className="h-5 w-5" />
                                )}
                              </div>
                              <div className="ml-3">
                                <p className="font-medium">
                                  {isReceived 
                                    ? `From ${transaction.senderName}` 
                                    : `To ${transaction.recipientName}`
                                  }
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(transaction.timestamp)}
                                </p>
                              </div>
                            </div>
                            <div className={`text-right ${isReceived ? "text-green-600" : "text-muted-foreground"}`}>
                              <p className="font-medium">
                                {isReceived ? "+" : "-"}${transaction.amount.toFixed(2)}
                              </p>
                              <p className="text-xs uppercase">
                                {transaction.status}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <Button variant="outline" size="sm" className="w-full sm:hidden mt-4">
                        View All Transactions
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="md:col-span-3">
              {showTopUp ? (
                <TopUpForm />
              ) : (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Need Help?</CardTitle>
                    <CardDescription>
                      Check our support resources or contact us for assistance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <h3 className="font-medium">How to Send Money</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Learn how to transfer funds securely to friends and family.
                      </p>
                    </div>
                    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <h3 className="font-medium">Setting Up Your Account</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Complete your profile and verify your identity.
                      </p>
                    </div>
                    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <h3 className="font-medium">Security Tips</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Keep your account secure with these best practices.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
