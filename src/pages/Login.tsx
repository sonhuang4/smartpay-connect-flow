
import SmartPayLogo from '@/assets/logo';
import LoginForm from '@/features/auth/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-[#121212] text-white">
      <div className="w-full max-w-md mb-8 text-center">
        <SmartPayLogo className="mx-auto mb-4" />
        <p className="text-gray-400 mt-2">Secure money transfers, simplified.</p>
      </div>
      <div className="w-full max-w-md animate-[float_6s_ease-in-out_infinite]">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
