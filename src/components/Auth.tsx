import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";

const AuthComponent = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);

  const redirectUrl = 'https://hunter.hackwithsingh.com';

  useEffect(() => {
    // Initialize session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setShowWelcomeDialog(true);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      setSession(session);
      
      if (event === 'SIGNED_IN') {
        setShowWelcomeDialog(true);
        toast({
          title: "Success",
          description: "Successfully signed in!",
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
  }, [toast]);

  const handleDialogClose = () => {
    setShowWelcomeDialog(false);
    window.location.href = redirectUrl;
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto p-6 glass-dark rounded-lg shadow-xl">
        <div className="text-center text-white">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-md mx-auto p-6 glass-dark rounded-lg shadow-xl">
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
          onlyThirdPartyProviders={true}
        />
      </div>

      <AlertDialog open={showWelcomeDialog} onOpenChange={setShowWelcomeDialog}>
        <AlertDialogContent className="glass-dark text-white relative">
          <button
            onClick={() => setShowWelcomeDialog(false)}
            className="absolute right-4 top-4 p-2 hover:bg-white/10 rounded-full"
          >
            <X className="h-4 w-4 text-white" />
          </button>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-white">Welcome to Domain Hunter</AlertDialogTitle>
            <AlertDialogDescription className="text-white/90 space-y-4">
              <p>
                Domain Hunter is the ultimate tool for connecting with top-level decision-makers in any company. Simply log in, enter the company's domain, and let our smart search engine find key executives like the CEO, CTO, or COO.
              </p>
              <p>
                With verified email addresses, you can bypass traditional channels and directly reach the right people, dramatically improving your follow-up success rate.
              </p>
              <p>
                Our method, trusted by professionals, ensures 99% success by targeting decision-makers and automating personalized follow-ups.
              </p>
              <p>
                Whether you're in sales, marketing, or recruitment, Domain Hunter saves time, boosts responses, and gets you closer to your goals.
              </p>
              <p className="font-semibold text-fandom-primary">
                Want to remove the limit of 5? Sponsor the product for just ₹999 and enjoy 1 month of unlimited scans!
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={handleDialogClose}
              className="bg-white/10 text-white hover:bg-white/20"
            >
              Continue to App
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AuthComponent;