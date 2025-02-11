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
        <div className="glass rounded-full p-1 flex gap-2 max-w-[400px] mx-auto">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Enter domain (e.g., company.com)"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="search-input h-10 text-sm"
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-fandom-accent hover:bg-fandom-accent/90 text-white px-4 py-2 h-10 rounded-full transition-all duration-200 disabled:bg-white/5 disabled:text-white/40 font-semibold text-sm"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
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