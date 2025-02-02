import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { FirecrawlService } from "@/utils/FirecrawlService";

interface ApiKeyInputProps {
  onKeySet: () => void;
}

const ApiKeyInput = ({ onKeySet }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      toast({
        title: "Error",
        description: "Please enter your Outscraper API key",
        variant: "destructive",
      });
      return;
    }

    FirecrawlService.saveApiKey(apiKey);
    toast({
      title: "Success",
      description: "API key saved successfully",
    });
    onKeySet();
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-white mb-2">
            Outscraper API Key
          </label>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Outscraper API key"
            className="w-full"
          />
          <p className="text-sm text-gray-300 mt-2">
            Get your API key from{" "}
            <a
              href="https://app.outscraper.com/profile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              Outscraper Dashboard
            </a>
          </p>
        </div>
        <Button type="submit" className="w-full">
          Save API Key
        </Button>
      </form>
    </div>
  );
};

export default ApiKeyInput;