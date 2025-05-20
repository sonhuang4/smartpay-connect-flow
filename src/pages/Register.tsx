
import SmartPayLogo from '@/assets/logo';
import RegisterForm from '@/features/auth/RegisterForm';

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-[#121212] to-[#1a1a2e] text-white">
      <div className="w-full max-w-md mb-8 text-center">
        <SmartPayLogo className="mx-auto mb-4" />
        <p className="text-gray-300 mt-2 font-light">Create your account and start transferring money securely.</p>
      </div>
      <div className="w-full max-w-md hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-500">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
