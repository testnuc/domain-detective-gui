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
    <Card className="p-6 hover:shadow-lg transition-all duration-200 animate-fadeIn bg-white border-gray-100">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">{result.name}</h3>
          <span className="text-primary font-medium text-sm px-3 py-1 bg-primary-light bg-opacity-20 rounded-full">
            {result.company}
          </span>
        </div>
        
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-gray-700">
            <Mail className="w-4 h-4 text-primary" />
            <span className="font-medium">{result.email}</span>
          </div>
          
          <div className="flex items-center gap-3 text-gray-600">
            <Briefcase className="w-4 h-4 text-primary" />
            <span>{result.designation}</span>
          </div>
          
          <div className="flex items-center gap-3 text-gray-600">
            <Building2 className="w-4 h-4 text-primary" />
            <span>{result.company}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ResultCard;