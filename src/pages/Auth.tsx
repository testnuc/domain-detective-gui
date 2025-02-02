import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/', { replace: true });
      }
      setLoading(false);
    };
    
    checkSession();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-fandom-primary via-fandom-primary to-fandom-secondary">
      <div className="w-full max-w-md space-y-8 glass-dark rounded-2xl p-8 border border-white/10">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-white">Email Hunter</h1>
          <p className="text-white/70">
            Find and claim bounties from unresponsive targets
          </p>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-white/50">
            Please contact your administrator for access
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;