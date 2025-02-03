import { Mail, Briefcase, Building2, User, Copy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

export interface EmailResult {
  name: string;
  email: string;
  designation: string;
  company: string;
}

interface ResultCardProps {
  result: EmailResult;
}

const ResultCard = ({ result }: ResultCardProps) => {
  const capitalize = (str: string) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(result.email);
    toast({
      title: "Email Copied",
      description: "Email address has been copied to clipboard",
    });
  };

  return (
    <Card className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-fandom-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-fandom-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">{capitalize(result.name)}</h3>
              <p className="text-xs text-gray-500">{capitalize(result.designation)}</p>
            </div>
          </div>
          <span className="px-2 py-0.5 bg-fandom-primary/10 text-fandom-primary text-xs font-medium rounded-full">
            {result.company}
          </span>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="w-3.5 h-3.5 text-fandom-primary" />
              <span className="text-xs font-medium break-all">{result.email}</span>
            </div>
            <button
              onClick={handleCopyEmail}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              title="Copy email address"
            >
              <Copy className="w-3.5 h-3.5 text-gray-600" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Briefcase className="w-3.5 h-3.5 text-fandom-primary" />
            <span className="text-xs">{capitalize(result.designation)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Building2 className="w-3.5 h-3.5 text-fandom-primary" />
            <span className="text-xs">{result.company}</span>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
            <span className="text-xs text-green-600 font-medium">Verified Email</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ResultCard;