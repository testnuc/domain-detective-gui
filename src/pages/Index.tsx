import { useState } from "react";
import SearchBox from "@/components/SearchBox";
import ResultCard, { EmailResult } from "@/components/ResultCard";
import { useToast } from "@/components/ui/use-toast";
import { Flame } from "lucide-react";
import CelebrationScreen from "@/components/CelebrationScreen";
import { FirecrawlService } from "@/utils/FirecrawlService";
import ApiKeyInput from "@/components/ApiKeyInput";

const Index = () => {
  const [results, setResults] = useState<EmailResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [searchedDomain, setSearchedDomain] = useState("");
  const [hasApiKey, setHasApiKey] = useState(!!FirecrawlService.getApiKey());
  const { toast } = useToast();

  const handleSearch = async (domain: string) => {
    if (!hasApiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your Firecrawl API key first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await FirecrawlService.crawlWebsite(`https://${domain}`);
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

  const handleApiKeySet = () => {
    setHasApiKey(true);
  };

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

        {!hasApiKey ? (
          <ApiKeyInput onKeySet={handleApiKeySet} />
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Index;