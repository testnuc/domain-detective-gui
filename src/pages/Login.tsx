import AuthComponent from '@/components/Auth';
import { Flame } from 'lucide-react';

const Login = () => {
  return (
    <div className="min-h-screen py-16 px-4 bg-gradient-to-br from-fandom-primary via-fandom-secondary to-fandom-accent">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-1">
            Domain H<Flame className="w-8 h-8 text-white" />nter
          </h1>
          <p className="text-white/80 mt-2">Sign in to start hunting domains</p>
        </div>
        <AuthComponent />
      </div>
    </div>
  );
};

export default Login;