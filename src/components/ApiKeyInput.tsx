import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { FirecrawlService } from "@/utils/FirecrawlService";

interface ApiKeyInputProps {
  onKeySet: () => void;
}

const ApiKeyInput = ({ onKeySet }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState("");

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
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Enter API Key</h2>
      <p className="text-gray-600 mb-6">
        To use Email Hunter, you need an Outscraper API key. Please enter your API key below.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Outscraper API key"
            className="w-full"
          />
        </div>
        <Button type="submit" className="w-full bg-[#ea384c] hover:bg-[#d32f41]">
          Save API Key
        </Button>
      </form>
      <p className="mt-4 text-sm text-gray-500">
        Don't have an API key?{" "}
        <a
          href="https://app.outscraper.com/api"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#ea384c] hover:underline"
        >
          Get one here
        </a>
      </p>
    </div>
  );
};

export default ApiKeyInput;