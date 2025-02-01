import { Mail, Briefcase, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";

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
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow animate-fadeIn">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">{result.name}</h3>
          <span className="text-primary font-medium">{result.company}</span>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Mail className="w-4 h-4" />
            <span>{result.email}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Briefcase className="w-4 h-4" />
            <span>{result.designation}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Building2 className="w-4 h-4" />
            <span>{result.company}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ResultCard;