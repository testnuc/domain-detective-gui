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
    <Card className="glass-dark p-6 transition-all duration-200 animate-fadeIn hover:bg-black/30">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">{result.name}</h3>
          <span className="text-white/90 font-medium text-sm px-3 py-1 bg-white/10 rounded-full">
            {result.company}
          </span>
        </div>
        
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-white/90">
            <Mail className="w-4 h-4 text-white" />
            <span className="font-medium">{result.email}</span>
          </div>
          
          <div className="flex items-center gap-3 text-white/80">
            <Briefcase className="w-4 h-4 text-white" />
            <span>{result.designation}</span>
          </div>
          
          <div className="flex items-center gap-3 text-white/80">
            <Building2 className="w-4 h-4 text-white" />
            <span>{result.company}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ResultCard;