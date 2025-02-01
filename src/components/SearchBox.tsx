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
    <div className="search-container">
      <form onSubmit={handleSubmit} className="relative">
        <div className="glass rounded-full p-1.5 flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Enter company domain (e.g., company.com)"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="search-input"
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-fandom-accent hover:bg-fandom-accent/90 text-fandom-secondary px-8 py-6 text-lg h-auto rounded-full transition-all duration-200 disabled:bg-white/5 disabled:text-white/40 font-semibold"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-fandom-secondary border-t-transparent mr-2"></div>
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
    </div>
  );
};

export default SearchBox;