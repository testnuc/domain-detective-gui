import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBox from "@/components/SearchBox";
import ResultCard, { EmailResult } from "@/components/ResultCard";
import { useToast } from "@/components/ui/use-toast";
import { Flame } from "lucide-react";
import CelebrationScreen from "@/components/CelebrationScreen";
import { OutscraperService } from "@/utils/OutscraperService";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [results, setResults] = useState<EmailResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [searchedDomain, setSearchedDomain] = useState("");
  const [remainingScans, setRemainingScans] = useState(5);
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkRateLimit = async (domain: string) => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const { count } = await supabase
      .from("user_scans")
      .select("*", { count: 'exact' })
      .gte('created_at', twentyFourHoursAgo.toISOString())
      .eq('domain', domain);

    if (count && count >= 5) {
      throw new Error("You have reached your daily scan limit of 5 scans for this domain.");
    }
    
    setRemainingScans(5 - (count || 0));
    return count;
  };

  const storeDomainSearch = async (domain: string) => {
    const { error: domainSearchError } = await supabase
      .from("domain_searches")
      .insert({ domain });

    if (domainSearchError) {
      console.error('Error storing domain search:', domainSearchError);
    }

    const { error: scanError } = await supabase
      .from("user_scans")
      .insert({ domain });

    if (scanError) {
      console.error('Error storing user scan:', scanError);
      throw scanError;
    }
  };

  const handleSearch = async (domain: string) => {
    setIsLoading(true);
    try {
      await checkRateLimit(domain);
      await storeDomainSearch(domain);

      const data = await OutscraperService.findEmails(domain);
      setSearchedDomain(domain);
      setResults(data);
      
      if (data.length > 0) {
        setShowCelebration(true);
      } else {
        toast({
          title: "No Results",
          description: "No email addresses found for this domain",
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch email addresses",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCelebrationComplete = () => {
    setShowCelebration(false);
  };

  useEffect(() => {
    if (searchedDomain) {
      checkRateLimit(searchedDomain);
    }
  }, [searchedDomain]);

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-white flex items-center justify-center gap-2">
            Email H<Flame className="text-fandom-accent w-8 h-8 inline-block" />nter
          </h1>
          <p className="text-xl text-white/90 font-medium">
            Find Professional Email Addresses Instantly
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <SearchBox onSearch={handleSearch} isLoading={isLoading} />
          <div className="text-center mt-4 text-white/80">
            <p>Total scans remaining: {remainingScans} out of 5 per day {searchedDomain && `for ${searchedDomain}`}</p>
          </div>
        </div>

        {showCelebration && (
          <CelebrationScreen
            domain={searchedDomain}
            resultsCount={results.length}
            onComplete={handleCelebrationComplete}
          />
        )}

        {!showCelebration && results.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {results.map((result, index) => (
              <ResultCard key={index} result={result} />
            ))}
          </div>
        )}

        {isLoading && !showCelebration && (
          <div className="text-center mt-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
            <p className="text-lg text-white/90 mt-4">Searching for email addresses...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
