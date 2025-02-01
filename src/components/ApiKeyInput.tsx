import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { FirecrawlService } from "@/utils/FirecrawlService";

const ApiKeyInput = () => {
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive",
      });
      return;
    }

    try {
      FirecrawlService.saveApiKey(apiKey);
      toast({
        title: "Success",
        description: "API key saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save API key",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-8">
      <div className="glass-dark p-6 rounded-2xl">
        <h2 className="text-xl font-semibold text-white mb-4">Enter Firecrawl API Key</h2>
        <div className="flex gap-4">
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Firecrawl API key"
            className="flex-1 bg-black/20 border-none text-white placeholder:text-white/60"
          />
          <Button type="submit" className="bg-fandom-accent hover:bg-fandom-accent/90">
            Save Key
          </Button>
        </div>
        <p className="text-sm text-white/70 mt-4">
          You can get your Firecrawl API key from the{" "}
          <a
            href="https://firecrawl.co/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-fandom-accent hover:underline"
          >
            Firecrawl Dashboard
          </a>
        </p>
      </div>
    </form>
  );
};

export default ApiKeyInput;