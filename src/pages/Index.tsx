import { useState } from 'react';
import SearchBox from '@/components/SearchBox';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const totalScansRemaining = 100; // You can replace this with actual remaining scans logic

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

  const handleSearch = async (domain: string) => {
    setIsLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to perform this action",
          variant: "destructive",
        });
        return;
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
      {/* Logout Button */}
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
        
        {/* Total Scans Counter */}
        <div className="mt-4 text-center">
          <p className="text-white/80">
            Total Scans Remaining: <span className="font-bold text-white">{totalScansRemaining}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;