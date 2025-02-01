import { useEffect } from "react";
import { motion } from "framer-motion";
import { PartyPopper } from "lucide-react";

interface CelebrationScreenProps {
  domain: string;
  resultsCount: number;
  onComplete: () => void;
}

const CelebrationScreen = ({ domain, resultsCount, onComplete }: CelebrationScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
    >
      <div className="glass-dark p-8 rounded-3xl text-center max-w-md mx-4">
        <PartyPopper className="w-16 h-16 text-fandom-accent mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-white mb-2">Success!</h2>
        <p className="text-lg text-white/90 mb-4">
          Found {resultsCount} email{resultsCount !== 1 ? 's' : ''} for {domain}
        </p>
        <p className="text-sm text-white/70">
          Loading results...
        </p>
      </div>
    </motion.div>
  );
};

export default CelebrationScreen;