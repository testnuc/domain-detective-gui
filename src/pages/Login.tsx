import AuthComponent from '@/components/Auth';
import { Flame } from 'lucide-react';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        window.location.href = 'https://hunter.hackwithsingh.com';
      }
    };
    checkSession();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-br from-fandom-primary via-fandom-secondary to-fandom-accent">
      <div className="container mx-auto max-w-7xl flex flex-col items-center">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-1">
            Domain H<Flame className="w-8 h-8 text-white" />nter
          </h1>
          <p className="text-white/80 mt-2">Company not replying? We are here to help, sign up now 😉</p>
        </div>
        <AuthComponent />
      </div>
    </div>
  );
};

export default Login;