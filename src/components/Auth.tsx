import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

const isValidGmail = (email: string) => {
  // Strict Gmail validation - no dots or plus signs allowed
  const strictGmailRegex = /^[a-zA-Z0-9]+@gmail\.com$/;
  return strictGmailRegex.test(email);
};

const AuthComponent = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Initialize session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
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
      } else if (event === 'USER_UPDATED') {
        toast({
          title: "Success",
          description: "Please check your email to verify your account.",
        });
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Success",
          description: "Successfully signed out!",
        });
      } else if (event === 'PASSWORD_RECOVERY') {
        toast({
          title: "Error",
          description: "Invalid login credentials. Please try again.",
          variant: "destructive"
        });
      }
    });

    // Handle authentication errors
    supabase.auth.onAuthStateChange((event, session) => {
      if (!session && event === 'SIGNED_OUT') {
        toast({
          title: "Error",
          description: "Invalid login credentials. Please try again.",
          variant: "destructive"
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

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
          },
        }}
        providers={[]}
        redirectTo={window.location.origin}
        theme="dark"
        localization={{
          variables: {
            sign_in: {
              email_input_placeholder: 'Your email',
              password_input_placeholder: 'Your password',
              email_label: 'Email',
              password_label: 'Password',
              button_label: 'Sign in',
              loading_button_label: 'Signing in ...',
              social_provider_text: 'Sign in with {{provider}}',
              link_text: "Already have an account? Sign in",
            },
          },
        }}
      />
    </div>
  );
};

export default AuthComponent;