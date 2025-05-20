
import { useState } from 'react';
import AppHeader from '@/components/AppHeader';
import TransferForm from '@/features/transfer/TransferForm';
import TransferSuccess from '@/features/transfer/TransferSuccess';

const Transfer = () => {
  const [transferComplete, setTransferComplete] = useState(false);
  const [transferDetails, setTransferDetails] = useState<{recipient: string; amount: number} | null>(null);
  
  const handleTransferSuccess = (details: {recipient: string; amount: number}) => {
    setTransferDetails(details);
    setTransferComplete(true);
  };
  
  const handleNewTransfer = () => {
    setTransferComplete(false);
    setTransferDetails(null);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <AppHeader />
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Send Money</h1>
            <p className="text-muted-foreground">Transfer funds to friends, family, or businesses instantly</p>
          </div>
          
          {transferComplete && transferDetails ? (
            <TransferSuccess
              recipientName={transferDetails.recipient}
              amount={transferDetails.amount}
              onNewTransfer={handleNewTransfer}
            />
          ) : (
            <TransferForm onSuccess={handleTransferSuccess} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Transfer;
