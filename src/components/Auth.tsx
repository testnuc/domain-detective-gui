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
        console.log('Checking for existing demo user...');
        const { data: { user }, error: getUserError } = await supabase.auth.getUser();
        
        if (getUserError) {
          console.error('Error checking user:', getUserError);
          throw getUserError;
        }

        if (!user) {
          console.log('No user found, creating demo user...');
          const { data, error } = await supabase.auth.signInWithPassword({
            email: 'demo@domain-detective.com',
            password: '123456',
          });

          if (error?.message?.includes('Invalid login credentials')) {
            console.log('User does not exist, creating new demo user...');
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
            } else {
              console.log('Demo user created successfully');
              toast({
                title: "Success",
                description: "Demo user created successfully. You can now log in.",
              });
            }
          } else if (error) {
            console.error('Error signing in:', error);
            toast({
              title: "Error",
              description: error.message || "Could not sign in. Please try again.",
              variant: "destructive"
            });
            throw error;
          } else {
            console.log('Demo user signed in successfully:', data);
          }
        } else {
          console.log('User already exists:', user.email);
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