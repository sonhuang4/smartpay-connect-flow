
import SmartPayLogo from '@/assets/logo';
import RegisterForm from '@/features/auth/RegisterForm';

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-[#121212] text-white">
      <div className="w-full max-w-md mb-8 text-center">
        <SmartPayLogo className="mx-auto mb-4" />
        <p className="text-gray-400 mt-2">Create your account and start transferring money securely.</p>
      </div>
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
