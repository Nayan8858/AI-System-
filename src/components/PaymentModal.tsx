import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Loader2, CreditCard } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  planPrice: string;
  priceId: string;
}

export const PaymentModal = ({ isOpen, onClose, planName, planPrice, priceId }: PaymentModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Open Stripe checkout in popup
      window.open(
        `/checkout?plan=${planName}&price=${planPrice}&priceId=${priceId}`,
        'stripe-checkout',
        'width=600,height=800'
      );
      setIsLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Secure Payment</DialogTitle>
        </DialogHeader>
        
        <div className="py-6 space-y-4">
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-primary">{planPrice}</div>
            <p className="text-muted-foreground">{planName} Plan</p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">🔒 Securing payment...</p>
            </div>
          ) : (
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
              onClick={handlePayment}
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Proceed to Checkout
            </Button>
          )}

          <p className="text-xs text-center text-muted-foreground">
            Your payment is secured with Stripe
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
