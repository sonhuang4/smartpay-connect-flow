
import LoginForm from '@/features/auth/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-muted/30">
      <div className="w-full max-w-md mb-8 text-center">
        <h1 className="text-3xl font-bold">SmartPay</h1>
        <p className="text-muted-foreground mt-2">Secure money transfers, simplified.</p>
      </div>
      <LoginForm />
    </div>
  );
};

export default Login;
