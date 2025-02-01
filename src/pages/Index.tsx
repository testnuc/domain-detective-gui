import { useState } from "react";
import SearchBox from "@/components/SearchBox";
import ResultCard, { EmailResult } from "@/components/ResultCard";
import { useToast } from "@/components/ui/use-toast";
import { Flame } from "lucide-react";

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
    {
      name: "Michael Brown",
      email: `m.brown@${domain}`,
      designation: "Sales Manager",
      company: domain,
    },
    {
      name: "Emily Davis",
      email: `emily.davis@${domain}`,
      designation: "HR Director",
      company: domain,
    },
    {
      name: "David Wilson",
      email: `d.wilson@${domain}`,
      designation: "Product Manager",
      company: domain,
    },
    {
      name: "Lisa Anderson",
      email: `l.anderson@${domain}`,
      designation: "Software Engineer",
      company: domain,
    },
    {
      name: "Robert Taylor",
      email: `r.taylor@${domain}`,
      designation: "Operations Manager",
      company: domain,
    },
    {
      name: "Jennifer Martinez",
      email: `j.martinez@${domain}`,
      designation: "Customer Success Manager",
      company: domain,
    },
    {
      name: "William Lee",
      email: `w.lee@${domain}`,
      designation: "Finance Director",
      company: domain,
    },
    {
      name: "Patricia Moore",
      email: `p.moore@${domain}`,
      designation: "Business Development Manager",
      company: domain,
    }
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
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-white flex items-center justify-center gap-2" style={{ fontFamily: 'Arial Rounded MT Bold, Arial, sans-serif' }}>
            Email H<Flame className="text-fandom-accent w-8 h-8 inline-block" />nter
          </h1>
          <p className="text-xl text-white/90 font-medium">
            Find mails of Top Professionals
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <SearchBox onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {results.length > 0 && (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((result, index) => (
              <ResultCard key={index} result={result} />
            ))}
          </div>
        )}

        {isLoading && (
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
