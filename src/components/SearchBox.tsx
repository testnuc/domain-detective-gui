import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

interface SearchBoxProps {
  onSearch: (domain: string) => void;
  isLoading: boolean;
}

const SearchBox = ({ onSearch, isLoading }: SearchBoxProps) => {
  const [domain, setDomain] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) {
      toast({
        title: "Error",
        description: "Please enter a domain",
        variant: "destructive",
      });
      return;
    }
    
    // Basic domain validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      toast({
        title: "Invalid Domain",
        description: "Please enter a valid domain (e.g., company.com)",
        variant: "destructive",
      });
      return;
    }

    onSearch(domain);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="flex gap-3 p-2 bg-white rounded-lg shadow-lg">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Enter company domain (e.g., company.com)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="pl-4 pr-10 py-6 text-lg w-full border-0 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-primary hover:bg-primary-hover text-white px-8 py-6 text-lg h-auto rounded-lg transition-all duration-200 hover:shadow-md disabled:bg-gray-300"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              Searching...
            </>
          ) : (
            <>
              <Search className="mr-2" />
              Search
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default SearchBox;