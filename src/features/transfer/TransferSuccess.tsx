
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { CheckCircle, Home, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TransferSuccessProps {
  recipientName: string;
  amount: number;
  onNewTransfer: () => void;
}

const TransferSuccess = ({ 
  recipientName, 
  amount, 
  onNewTransfer 
}: TransferSuccessProps) => {
  return (
    <Card className="border shadow-sm max-w-md mx-auto text-center">
      <CardHeader className="pb-4">
        <div className="mx-auto bg-green-100 dark:bg-green-900/20 w-20 h-20 flex items-center justify-center rounded-full mb-4">
          <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-500" />
        </div>
        <CardTitle className="text-2xl">Transfer Successful!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-6">
        <div className="bg-muted/50 rounded-lg p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Amount Sent</p>
          <p className="text-3xl font-bold">${amount.toFixed(2)}</p>
          <div className="pt-2">
            <p className="text-sm text-muted-foreground">To</p>
            <p className="font-medium">{recipientName}</p>
          </div>
        </div>
        <div className="py-2 text-sm text-muted-foreground">
          <p>Transaction ID: {`TRX${Date.now().toString().slice(-8)}`}</p>
          <p>Date: {new Date().toLocaleString()}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3">
        <Button 
          className="w-full flex items-center gap-2" 
          variant="default"
          onClick={onNewTransfer}
        >
          <Send className="h-4 w-4" />
          <span>Send Another Payment</span>
        </Button>
        <Button 
          className="w-full flex items-center gap-2" 
          variant="outline"
          asChild
        >
          <Link to="/dashboard">
            <Home className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TransferSuccess;
