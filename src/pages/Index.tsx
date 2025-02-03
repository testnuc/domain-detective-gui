import { useState, useEffect } from 'react';
import SearchBox from '@/components/SearchBox';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [scansRemaining, setScansRemaining] = useState(5);
  const [timeUntilReset, setTimeUntilReset] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  const checkScanLimits = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: scanLimit, error } = await supabase
      .from('user_scan_limits')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching scan limits:', error);
      return;
    }

    if (!scanLimit) {
      // Create initial scan limit record for user
      await supabase
        .from('user_scan_limits')
        .insert([{ user_id: user.id, scan_count: 0 }]);
      setScansRemaining(5);
      return;
    }

    const lastResetTime = new Date(scanLimit.last_reset_time);
    const now = new Date();
    const hoursSinceReset = (now.getTime() - lastResetTime.getTime()) / (1000 * 60 * 60);

    if (hoursSinceReset >= 24) {
      // Reset scan count after 24 hours
      await supabase
        .from('user_scan_limits')
        .update({ scan_count: 0, last_reset_time: now.toISOString() })
        .eq('user_id', user.id);
      setScansRemaining(5);
      setTimeUntilReset(null);
    } else {
      setScansRemaining(5 - scanLimit.scan_count);
      if (scanLimit.scan_count >= 5) {
        const minutesUntilReset = Math.ceil((24 - hoursSinceReset) * 60);
        setTimeUntilReset(`${Math.floor(minutesUntilReset / 60)}h ${minutesUntilReset % 60}m`);
      }
    }
  };

  useEffect(() => {
    checkScanLimits();
  }, []);

  const handleSearch = async (domain: string) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to perform this action",
          variant: "destructive",
        });
        return;
      }

      // Check scan limits before proceeding
      const { data: scanLimit } = await supabase
        .from('user_scan_limits')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (scanLimit && scanLimit.scan_count >= 5) {
        const lastResetTime = new Date(scanLimit.last_reset_time);
        const now = new Date();
        const hoursSinceReset = (now.getTime() - lastResetTime.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceReset < 24) {
          const minutesUntilReset = Math.ceil((24 - hoursSinceReset) * 60);
          toast({
            title: "Scan Limit Reached",
            description: `You've reached your daily scan limit. Please try again in ${Math.floor(minutesUntilReset / 60)}h ${minutesUntilReset % 60}m`,
            variant: "destructive",
          });
          return;
        }
      }

      // Store in domain_searches for general tracking
      const { error: searchError } = await supabase
        .from('domain_searches')
        .insert({ domain });

      if (searchError) throw searchError;

      // Store in user_scans for scan history
      const { error: scanError } = await supabase
        .from('user_scans')
        .insert({ domain });

      if (scanError) throw scanError;

      // Update scan count
      await supabase
        .from('user_scan_limits')
        .update({ 
          scan_count: scanLimit ? scanLimit.scan_count + 1 : 1,
          last_reset_time: scanLimit ? scanLimit.last_reset_time : new Date().toISOString()
        })
        .eq('user_id', user.id);

      await checkScanLimits();

      toast({
        title: "Success",
        description: "Domain search completed successfully",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to process domain",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 flex items-center gap-2 text-white/80 hover:text-white transition-colors glass px-4 py-2 rounded-full"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>

      <div className="max-w-2xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Email Hunter</h1>
        <p className="text-xl text-white/80">Find professional email addresses in seconds</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <SearchBox onSearch={handleSearch} isLoading={isLoading} />
        
        <div className="mt-4 text-center">
          <p className="text-white/80">
            Scans Remaining Today: <span className="font-bold text-white">{scansRemaining}</span>
            {timeUntilReset && (
              <span className="ml-2 text-white/60">
                (Resets in {timeUntilReset})
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;