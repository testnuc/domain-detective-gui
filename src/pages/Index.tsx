import { useState } from "react";
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
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleSearch = async (domain: string) => {
    setIsLoading(true);
    try {
      // First, try to insert into user_scans to check the limit
      const { error: scanError } = await supabase
        .from("user_scans")
        .insert({ domain });

      if (scanError) {
        if (scanError.message.includes("daily limit")) {
          throw new Error("You have reached your daily scan limit of 5 scans.");
        }
        throw scanError;
      }

      // If successful, proceed with the search
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

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-end mb-4">
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

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