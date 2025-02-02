import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const AuthComponent = () => {
  const { toast } = useToast();

  useEffect(() => {
    const createDemoUser = async () => {
      try {
        const { data: { user }, error: getUserError } = await supabase.auth.getUser();
        
        if (!user) {
          const { error } = await supabase.auth.signUp({
            email: 'demo@example.com',
            password: '123456',
          });

          if (error) {
            console.error('Error creating demo user:', error);
            toast({
              title: "Error",
              description: error.message || "Could not create demo user. Please try again.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Success",
              description: "Demo user created successfully. You can now log in.",
            });
          }
        }
      } catch (error) {
        console.error('Error checking/creating demo user:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive"
        });
      }
    };

    createDemoUser();
  }, [toast]);

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