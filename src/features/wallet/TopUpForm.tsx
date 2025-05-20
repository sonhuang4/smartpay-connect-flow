
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWalletStore } from '@/store/walletStore';
import { CreditCard, DollarSign, Wallet } from 'lucide-react';

const topupSchema = z.object({
  amount: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive('Amount must be positive').min(5, 'Minimum amount is $5')
  ),
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
});

type TopUpFormValues = z.infer<typeof topupSchema>;

const TopUpForm = () => {
  const { topUp } = useWalletStore();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('card');
  
  const form = useForm<TopUpFormValues>({
    resolver: zodResolver(topupSchema),
    defaultValues: {
      amount: undefined,
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
    },
  });

  const onSubmit = async (values: TopUpFormValues) => {
    try {
      setIsLoading(true);
      await topUp(values.amount);
      toast({
        title: "Top up successful",
        description: `$${values.amount} has been added to your wallet`,
      });
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Top up failed",
        description: error instanceof Error ? error.message : "An error occurred during top up",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Wallet className="mr-2 h-5 w-5" />
          Add Money to Wallet
        </CardTitle>
        <CardDescription>Choose your preferred payment method</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="card" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="card">Credit Card</TabsTrigger>
            <TabsTrigger value="direct">Quick Amount</TabsTrigger>
          </TabsList>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <TabsContent value="card">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input
                              placeholder="4444 4444 4444 4444"
                              {...field}
                              className="pl-10"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cardName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cardholder Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date</FormLabel>
                          <FormControl>
                            <Input placeholder="MM/YY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cvv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVV</FormLabel>
                          <FormControl>
                            <Input placeholder="123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="direct">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <div className="grid grid-cols-3 gap-2">
                        {[10, 50, 100].map((amount) => (
                          <Button
                            key={amount}
                            type="button"
                            variant={field.value === amount ? "default" : "outline"}
                            className="py-6"
                            onClick={() => {
                              form.setValue('amount', amount);
                            }}
                          >
                            ${amount}
                          </Button>
                        ))}
                      </div>
                      <div className="mt-2 relative">
                        <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder="Custom amount"
                          {...field}
                          className="pl-10"
                          type="number"
                          step="0.01"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Demo Mode: Add funds instantly</p>
                  <p className="text-xs text-muted-foreground">
                    This is a demo application. In a real app, this would connect to a payment processor.
                  </p>
                </div>
              </TabsContent>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Wallet className="mr-2 h-4 w-4" /> Add Money
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4 text-xs text-muted-foreground">
        <p>Funds added in demo mode are simulated and not real transactions.</p>
      </CardFooter>
    </Card>
  );
};

export default TopUpForm;
