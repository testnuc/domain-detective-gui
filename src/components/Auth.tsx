import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';

const AuthComponent = () => {
  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white/5 rounded-lg shadow-xl">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google']}
        redirectTo="https://domain-detective-gui.lovable.app/"
        theme="dark"
      />
    </div>
  );
};

export default AuthComponent;