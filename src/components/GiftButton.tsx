import { useState } from 'react';
import { Gift } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";

const GiftButton = () => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="fixed top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
      >
        <Gift className="h-6 w-6 text-white" />
      </button>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="glass-dark text-white relative fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => setShowDialog(false)}
            className="absolute right-4 top-4 p-2 hover:bg-white/10 rounded-full"
          >
            <X className="h-4 w-4 text-white" />
          </button>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-white">Welcome to Domain Hunter</AlertDialogTitle>
            <AlertDialogDescription className="text-white/90 space-y-4">
              <p>
                Domain Hunter is the ultimate tool for connecting with top-level decision-makers in any company. Simply log in, enter the company's domain, and let our smart search engine find key executives like the CEO, CTO, or COO.
              </p>
              <p>
                With verified email addresses, you can bypass traditional channels and directly reach the right people, dramatically improving your follow-up success rate.
              </p>
              <p>
                Our method, trusted by professionals, ensures 99% success by targeting decision-makers and automating personalized follow-ups.
              </p>
              <p>
                Whether you're in sales, marketing, or recruitment, Domain Hunter saves time, boosts responses, and gets you closer to your goals.
              </p>
              <p className="font-semibold text-fandom-primary">
                Want to remove the limit of 5? Sponsor the product for just ₹999 and enjoy 1 month of unlimited scans!
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setShowDialog(false)}
              className="bg-white/10 text-white hover:bg-white/20"
            >
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default GiftButton;