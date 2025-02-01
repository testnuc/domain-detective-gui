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
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Enter company domain (e.g., company.com)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="pl-4 pr-10 py-6 text-lg w-full"
          />
        </div>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-primary hover:bg-primary-hover text-white px-8 py-6 text-lg h-auto"
        >
          {isLoading ? (
            "Searching..."
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