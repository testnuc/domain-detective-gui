import AuthComponent from '@/components/Auth';
import { Flame } from 'lucide-react';

const Login = () => {
  return (
    <div className="min-h-screen w-screen overflow-hidden bg-gradient-to-br from-[#8B5CF6] via-[#D946EF] to-[#F97316] relative">
      <div className="absolute inset-0 bg-[url('/lovable-uploads/9f4f8856-bd6b-4068-87d1-75aa87c37ada.png')] opacity-5 mix-blend-overlay"></div>
      <div className="relative z-10 container mx-auto max-w-7xl min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-1">
            Domain H
            <Flame className="text-[#F97316] animate-pulse" size={32} />
            nter
          </h1>
          <p className="text-white/80 mt-2">Sign in to start hunting domains</p>
        </div>
        <AuthComponent />
      </div>
    </div>
  );
};

export default Login;