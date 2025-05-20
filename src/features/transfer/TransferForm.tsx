
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useWalletStore } from '@/store/walletStore';
import { Send, DollarSign, Mail, Phone, Search, User } from 'lucide-react';

const transferSchema = z.object({
  recipient: z.string().min(1, 'Recipient is required'),
  amount: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive('Amount must be positive').min(1, 'Minimum amount is $1')
  ),
  note: z.string().optional(),
});

type TransferFormValues = z.infer<typeof transferSchema>;

interface TransferFormProps {
  onSuccess: (transactionDetails: { recipient: string; amount: number; }) => void;
}

const TransferForm = ({ onSuccess }: TransferFormProps) => {
  const { transfer, getBalance, allUsers } = useWalletStore();
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{id: string, name: string, email: string, phone: string}>>([]);
  const balance = getBalance();
  
  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      recipient: '',
      amount: undefined,
      note: '',
    },
  });

  const handleSearch = (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    const results = allUsers.filter(
      user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.phone.includes(query)
    );
    
    setSearchResults(results);
  };

  const selectRecipient = (user: {id: string, name: string, email: string, phone: string}) => {
    form.setValue('recipient', user.email);
    setSearchResults([]);
  };

  const onSubmit = async (values: TransferFormValues) => {
    try {
      if (values.amount > balance) {
        toast({
          variant: "destructive",
          title: "Insufficient balance",
          description: "You don't have enough funds to make this transfer",
        });
        return;
      }
      
      setIsLoading(true);
      await transfer(values.recipient, values.amount, values.note || '');
      toast({
        title: "Transfer successful",
        description: `$${values.amount} has been sent successfully`,
      });
      
      // Find recipient name for success screen
      const recipient = allUsers.find(
        u => u.email === values.recipient || u.phone === values.recipient
      );
      
      onSuccess({
        recipient: recipient?.name || values.recipient,
        amount: values.amount
      });
      
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Transfer failed",
        description: error instanceof Error ? error.message : "An error occurred during the transfer",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Send className="mr-2 h-5 w-5" />
          Send Money
        </CardTitle>
        <CardDescription>Transfer money to another user</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Recipient (Email or Phone)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input 
                        placeholder="Search by name, email or phone"
                        className="pl-10"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleSearch(e.target.value);
                        }}
                      />
                    </div>
                  </FormControl>
                  {searchResults.length > 0 && (
                    <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white py-1 shadow-lg">
                      {searchResults.map((user) => (
                        <div
                          key={user.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() => selectRecipient(user)}
                        >
                          <User className="mr-2 h-4 w-4" />
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <Mail className="mr-1 h-3 w-3" /> {user.email}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <Phone className="mr-1 h-3 w-3" /> {user.phone}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <div className="flex items-center justify-between">
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder="0.00"
                          {...field}
                          className="pl-10"
                          type="number"
                          step="0.01"
                        />
                      </div>
                    </FormControl>
                  </div>
                  <div className="flex justify-between text-sm">
                    <FormMessage />
                    <span className="text-muted-foreground">
                      Available: ${balance.toFixed(2)}
                    </span>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add a note about this transfer"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center">
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  <Send className="mr-2 h-4 w-4" /> Send Money
                </span>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TransferForm;
