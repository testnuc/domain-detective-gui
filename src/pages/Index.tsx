import { useState } from 'react';
import SearchBox from '@/components/SearchBox';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);

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

      // Store domain entry with user information
      const { error } = await supabase
        .from('user_domains')
        .insert({
          user_id: user.id,
          domain: domain,
        });

      if (error) throw error;

      // Store in domain_searches for general tracking
      await supabase
        .from('domain_searches')
        .insert({ domain });

      // Store in user_scans for scan history
      await supabase
        .from('user_scans')
        .insert({ domain });

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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <SearchBox onSearch={handleSearch} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Index;