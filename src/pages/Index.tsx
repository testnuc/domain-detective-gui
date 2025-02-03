import { useState, useEffect } from 'react';
import SearchBox from '@/components/SearchBox';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LogOut, Flame, Target, Rocket, Shield, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CelebrationScreen from '@/components/CelebrationScreen';
import ResultCard, { EmailResult } from '@/components/ResultCard';
import { OutscraperService } from '@/utils/OutscraperService';
import { format } from 'date-fns';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [scansRemaining, setScansRemaining] = useState(5);
  const [timeUntilReset, setTimeUntilReset] = useState<string | null>(null);
  const [resetTime, setResetTime] = useState<Date | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [searchResults, setSearchResults] = useState<EmailResult[]>([]);
  const [searchedDomain, setSearchedDomain] = useState('');
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
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching scan limits:', error);
      return;
    }

    if (!scanLimit) {
      const { error: insertError } = await supabase
        .from('user_scan_limits')
        .insert([{ 
          user_id: user.id, 
          scan_count: 0,
          last_reset_time: new Date().toISOString()
        }]);
      
      if (insertError) {
        console.error('Error creating scan limit:', insertError);
        return;
      }
      
      setScansRemaining(5);
      setTimeUntilReset(null);
      setResetTime(null);
      return;
    }

    const lastResetTime = new Date(scanLimit.last_reset_time);
    const now = new Date();
    const hoursSinceReset = (now.getTime() - lastResetTime.getTime()) / (1000 * 60 * 60);

    if (hoursSinceReset >= 24) {
      // Reset scan count after 24 hours
      const newResetTime = new Date();
      await supabase
        .from('user_scan_limits')
        .update({ 
          scan_count: 0, 
          last_reset_time: newResetTime.toISOString() 
        })
        .eq('user_id', user.id);
      setScansRemaining(5);
      setTimeUntilReset(null);
      setResetTime(newResetTime);
    } else {
      setScansRemaining(5 - (scanLimit.scan_count || 0));
      if (scanLimit.scan_count >= 5) {
        const nextResetTime = new Date(lastResetTime.getTime() + (24 * 60 * 60 * 1000));
        setResetTime(nextResetTime);
        const minutesUntilReset = Math.ceil((24 - hoursSinceReset) * 60);
        setTimeUntilReset(`${Math.floor(minutesUntilReset / 60)}h ${minutesUntilReset % 60}m`);
      }
    }
  };

  useEffect(() => {
    checkScanLimits();
    // Set up an interval to check scan limits every minute
    const interval = setInterval(checkScanLimits, 60000);
    return () => clearInterval(interval);
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
        .maybeSingle();

      if (scanLimit && scanLimit.scan_count >= 5) {
        const lastResetTime = new Date(scanLimit.last_reset_time);
        const now = new Date();
        const hoursSinceReset = (now.getTime() - lastResetTime.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceReset < 24) {
          const nextResetTime = new Date(lastResetTime.getTime() + (24 * 60 * 60 * 1000));
          toast({
            title: "Scan Limit Reached",
            description: `You've reached your daily scan limit. Next scan available at ${format(nextResetTime, 'h:mm a')}`,
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

      // Fetch results using OutscraperService
      const results = await OutscraperService.findEmails(domain);
      setSearchResults(results);
      setSearchedDomain(domain);
      setShowCelebration(true);

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

      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-1">
          Domain H<Flame className="w-8 h-8 text-white" />nter
        </h1>
        <p className="text-xl text-white/80 mb-6">Find Professional Email Addresses in Seconds</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-12">
          <div className="glass-dark p-6 rounded-xl">
            <Target className="w-8 h-8 text-white mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-white mb-2">Sales & Marketing</h2>
            <p className="text-white/80">Connect directly with decision-makers to boost your conversion rates</p>
          </div>
          
          <div className="glass-dark p-6 rounded-xl">
            <Rocket className="w-8 h-8 text-white mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-white mb-2">Recruiters</h2>
            <p className="text-white/80">Reach top talent and hiring managers efficiently</p>
          </div>
          
          <div className="glass-dark p-6 rounded-xl">
            <Shield className="w-8 h-8 text-white mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-white mb-2">Security Research</h2>
            <p className="text-white/80">Contact security teams for responsible disclosure</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <SearchBox onSearch={handleSearch} isLoading={isLoading} />
        
        <div className="mt-4 text-center">
          <p className="text-white/80">
            Scans Remaining Today: <span className="font-bold text-white">{scansRemaining}</span>
            {resetTime && scansRemaining === 0 && (
              <span className="ml-2 text-white/60">
                (Reset at {format(resetTime, 'h:mm a')})
              </span>
            )}
          </p>
        </div>

        {searchResults.length > 0 && !showCelebration && (
          <div className="mt-8 space-y-4">
            {searchResults.map((result, index) => (
              <ResultCard key={index} result={result} />
            ))}
          </div>
        )}
      </div>

      {showCelebration && (
        <CelebrationScreen
          domain={searchedDomain}
          resultsCount={searchResults.length}
          onComplete={() => setShowCelebration(false)}
        />
      )}

      {/* Hidden SEO content */}
      <div className="sr-only">
        <h2>Professional Email Finder Tool</h2>
        <p>Domain Hunter is the ultimate tool for finding professional email addresses of company executives, CTOs, CEOs, and decision-makers. Perfect for sales teams, marketers, recruiters, and security researchers conducting bug bounty programs.</p>
        <h3>Features</h3>
        <ul>
          <li>Verify email addresses of company leadership</li>
          <li>Direct access to decision-makers</li>
          <li>Ideal for B2B sales and marketing</li>
          <li>Security research and responsible disclosure</li>
          <li>Recruitment and talent acquisition</li>
        </ul>
      </div>
    </div>
  );
};

export default Index;