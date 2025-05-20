
import { useEffect, useState } from 'react';
import { useWalletStore } from '@/store/walletStore';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, ArrowDown, ArrowUp, CreditCard, RefreshCw } from 'lucide-react';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const WalletBalance = () => {
  const { user } = useAuthStore();
  const { getBalance, getUserTransactions } = useWalletStore();
  const [balance, setBalance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Get the last 3 transactions
  const transactions = user ? getUserTransactions(user.id).slice(0, 3) : [];
  
  // Calculate income and expenses
  const income = transactions
    .filter(t => t.recipientId === user?.id)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = transactions
    .filter(t => t.senderId === user?.id && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  useEffect(() => {
    // Get initial balance
    setBalance(getBalance());
  }, [getBalance]);

  const refreshBalance = () => {
    setIsRefreshing(true);
    // Simulate a refresh delay
    setTimeout(() => {
      setBalance(getBalance());
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Wallet className="mr-2 h-6 w-6" />
          Your Balance
        </CardTitle>
        <CardDescription>Current available funds in your wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold">{formatCurrency(balance)}</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex gap-1 items-center"
              onClick={refreshBalance}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 flex flex-col">
              <div className="flex items-center text-green-600 dark:text-green-400 mb-1">
                <ArrowDown className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Income</span>
              </div>
              <span className="text-lg font-semibold">{formatCurrency(income)}</span>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 flex flex-col">
              <div className="flex items-center text-red-600 dark:text-red-400 mb-1">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Expenses</span>
              </div>
              <span className="text-lg font-semibold">{formatCurrency(expenses)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <Button className="w-full flex items-center gap-2" variant="outline">
          <CreditCard className="h-4 w-4" />
          <span>Add Money to Wallet</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WalletBalance;
