import { useState } from "react";
import SearchBox from "@/components/SearchBox";
import ResultCard, { EmailResult } from "@/components/ResultCard";
import { useToast } from "@/components/ui/use-toast";

// Mock data - replace with actual API call
const mockSearch = async (domain: string): Promise<EmailResult[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return [
    {
      name: "John Smith",
      email: `john.smith@${domain}`,
      designation: "Chief Technology Officer",
      company: domain,
    },
    {
      name: "Sarah Johnson",
      email: `sarah.j@${domain}`,
      designation: "Marketing Director",
      company: domain,
    },
  ];
};

const Index = () => {
  const [results, setResults] = useState<EmailResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (domain: string) => {
    setIsLoading(true);
    try {
      const data = await mockSearch(domain);
      setResults(data);
      toast({
        title: "Success",
        description: `Found ${data.length} email(s) for ${domain}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch email addresses",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Email Finder
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Find professional email addresses in seconds
          </p>
        </div>

        <SearchBox onSearch={handleSearch} isLoading={isLoading} />

        {results.length > 0 && (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((result, index) => (
              <ResultCard key={index} result={result} />
            ))}
          </div>
        )}

        {isLoading && (
          <div className="text-center mt-12">
            <p className="text-lg text-gray-600">Searching for email addresses...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;