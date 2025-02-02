import { Mail, Briefcase, Building2, User } from "lucide-react";
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
    <Card className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-fandom-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-fandom-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{result.name}</h3>
              <p className="text-sm text-gray-500">{result.designation}</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-fandom-primary/10 text-fandom-primary text-xs font-medium rounded-full">
            {result.company}
          </span>
        </div>
        
        <div className="flex flex-col gap-3 mt-2">
          <div className="flex items-center gap-3 text-gray-700">
            <Mail className="w-4 h-4 text-fandom-primary" />
            <span className="text-sm font-medium break-all">{result.email}</span>
          </div>
          
          <div className="flex items-center gap-3 text-gray-600">
            <Briefcase className="w-4 h-4 text-fandom-primary" />
            <span className="text-sm">{result.designation}</span>
          </div>
          
          <div className="flex items-center gap-3 text-gray-600">
            <Building2 className="w-4 h-4 text-fandom-primary" />
            <span className="text-sm">{result.company}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-sm text-green-600 font-medium">Verified Email</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ResultCard;