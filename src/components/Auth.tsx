import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

const AuthComponent = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  const redirectUrl = 'https://hunter.hackwithsingh.com';

  useEffect(() => {
    // Initialize session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        navigate('/');
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      setSession(session);
      
      if (event === 'SIGNED_IN') {
        toast({
          title: "Success",
          description: "Successfully signed in!",
        });
        navigate('/');
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Success",
          description: "Successfully signed out!",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast, navigate]);

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 glass-dark rounded-lg shadow-xl">
        <div className="text-center text-white">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 glass-dark rounded-lg shadow-xl">
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#EA1157',
                brandAccent: '#2E0916',
                inputBackground: 'rgba(0,0,0,0.2)',
                inputText: 'white',
                inputPlaceholder: 'rgba(255,255,255,0.5)',
              },
            },
          },
          className: {
            button: 'bg-fandom-primary hover:bg-fandom-secondary text-white',
            input: 'bg-black/20 border-white/10',
            label: 'text-white',
            anchor: 'text-white hover:text-white/80',
          },
        }}
        view="sign_in"
        showLinks={false}
        providers={['google']}
        redirectTo={redirectUrl}
        theme="dark"
      />
    </div>
  );
};

export default AuthComponent;