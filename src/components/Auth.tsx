import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

const TEMP_EMAIL_DOMAINS = [
  'tempmail.com',
  'temp-mail.org',
  'guerrillamail.com',
  'disposablemail.com',
  'mailinator.com',
  '10minutemail.com',
  'throwawaymail.com'
];

const isValidEmail = (email: string) => {
  // Check for Gmail aliases (dots and plus signs)
  if (email.toLowerCase().endsWith('@gmail.com')) {
    const localPart = email.split('@')[0];
    if (localPart.includes('+') || localPart.includes('.')) {
      return false;
    }
  }

  // Check for temporary email domains
  const domain = email.split('@')[1]?.toLowerCase();
  if (TEMP_EMAIL_DOMAINS.includes(domain)) {
    return false;
  }

  return true;
};

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
        if (session?.user.email_confirmed_at) {
          toast({
            title: "Success",
            description: "Successfully signed in!",
          });
          navigate('/');
        } else {
          toast({
            title: "Verification Required",
            description: "Please check your email and verify your account before signing in.",
            variant: "destructive"
          });
          // Sign out if email is not verified
          await supabase.auth.signOut();
        }
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
        providers={['google']}
        redirectTo={redirectUrl}
        theme="dark"
        localization={{
          variables: {
            sign_up: {
              email_label: 'Email',
              password_label: 'Password',
              button_label: 'Sign up',
              loading_button_label: 'Signing up ...',
              link_text: "Don't have an account? Sign up",
              confirmation_text: "Check your email for the confirmation link",
            },
            sign_in: {
              email_input_placeholder: 'Your email',
              password_input_placeholder: 'Your password',
              email_label: 'Email',
              password_label: 'Password',
              button_label: 'Sign in',
              loading_button_label: 'Signing in ...',
              link_text: "Already have an account? Sign in",
            },
          },
        }}
      />
    </div>
  );
};

export default AuthComponent;
