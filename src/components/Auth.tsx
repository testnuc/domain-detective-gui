import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';

const AuthComponent = () => {
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