import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const AuthComponent = () => {
  const { toast } = useToast();
  const [isCreatingDemoUser, setIsCreatingDemoUser] = useState(true);

  useEffect(() => {
    const createDemoUser = async () => {
      try {
        // Initialize auth session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error initializing session:', sessionError);
          throw sessionError;
        }

        // If there's no session, try to get the user
        if (!sessionData.session) {
          console.log('No session found, checking for existing user...');
          const { data: { user }, error: getUserError } = await supabase.auth.getUser();
          
          if (getUserError) {
            console.error('Error checking user:', getUserError);
            throw getUserError;
          }

          if (!user) {
            console.log('No user found, attempting to create demo user...');
            const { error: signUpError } = await supabase.auth.signUp({
              email: 'demo@domain-detective.com',
              password: '123456',
              options: {
                emailRedirectTo: window.location.origin,
                data: {
                  is_demo: true
                }
              }
            });

            if (signUpError) {
              console.error('Error creating demo user:', signUpError);
              toast({
                title: "Error",
                description: signUpError.message || "Could not create demo user. Please try again.",
                variant: "destructive"
              });
              throw signUpError;
            }

            // Wait a bit before signing in to ensure the user is created
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('Demo user created, attempting to sign in...');
            const { error: signInError } = await supabase.auth.signInWithPassword({
              email: 'demo@domain-detective.com',
              password: '123456',
            });

            if (signInError) {
              console.error('Error signing in:', signInError);
              toast({
                title: "Error",
                description: signInError.message || "Could not sign in. Please try again.",
                variant: "destructive"
              });
              throw signInError;
            }

            console.log('Demo user signed in successfully');
            toast({
              title: "Success",
              description: "Demo account created and signed in successfully.",
            });
          } else {
            console.log('User already exists:', user.email);
          }
        } else {
          console.log('Session already exists');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while setting up the demo account.",
          variant: "destructive"
        });
      } finally {
        setIsCreatingDemoUser(false);
      }
    };

    createDemoUser();
  }, [toast]);

  if (isCreatingDemoUser) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 glass-dark rounded-lg shadow-xl">
        <div className="text-center text-white">
          Setting up demo account...
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
        providers={['google']}
        redirectTo={window.location.origin}
        theme="dark"
      />
    </div>
  );
};

export default AuthComponent;