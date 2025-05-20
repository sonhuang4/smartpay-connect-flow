
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const verifyCodeSchema = z.object({
  code: z.string().length(6, 'Verification code must be 6 digits'),
});

type VerifyCodeFormValues = z.infer<typeof verifyCodeSchema>;

interface VerifyCodeFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const VerifyCodeForm = ({ onSuccess, onCancel }: VerifyCodeFormProps) => {
  const { verifyCode } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<VerifyCodeFormValues>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (values: VerifyCodeFormValues) => {
    try {
      setIsLoading(true);
      const success = await verifyCode(values.code);
      
      if (success) {
        toast({
          title: "Verification successful",
          description: "Your code has been verified successfully",
        });
        onSuccess();
      } else {
        toast({
          variant: "destructive",
          title: "Verification failed",
          description: "Invalid verification code. Please try again.",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: "An error occurred during verification",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Verify your account</CardTitle>
        <CardDescription>Enter the 6-digit code sent to your email or phone</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123456"
                      {...field}
                      maxLength={6}
                      inputMode="numeric"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between gap-4 pt-2">
              <Button type="button" variant="outline" className="w-full" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4" /> Verify Code
                  </span>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col text-center">
        <p className="text-sm text-muted-foreground">
          Didn't receive a code?
        </p>
        <Button
          variant="link"
          className="p-0 h-auto underline"
          onClick={() => {
            toast({
              title: "New code sent",
              description: "A new verification code has been sent to your email/phone",
            });
          }}
        >
          Resend Code
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VerifyCodeForm;
