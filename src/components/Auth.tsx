import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const isValidGmail = (email: string) => {
  // Basic Gmail validation
  const gmailRegex = /^[a-zA-Z0-9]+@gmail\.com$/;
  return gmailRegex.test(email);
};

const AuthComponent = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (email: string, password: string) => {
    if (!isValidGmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please use a valid Gmail address (e.g., user@gmail.com)",
        variant: "destructive"
      });
      return null;
    }

    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      }
    });
    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }

    toast({
      title: "Success",
      description: "Please check your email to verify your account.",
    });
    return data;
  };

  const handleSignIn = async (email: string, password: string) => {
    if (!isValidGmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please use a valid Gmail address (e.g., user@gmail.com)",
        variant: "destructive"
      });
      return null;
    }

    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }

    toast({
      title: "Success",
      description: "Successfully signed in!",
    });
    return data;
  };

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
        onSignUp={({ email, password }) => handleSignUp(email, password)}
        onSignIn={({ email, password }) => handleSignIn(email, password)}
        theme="dark"
      />
    </div>
  );
};

export default AuthComponent;