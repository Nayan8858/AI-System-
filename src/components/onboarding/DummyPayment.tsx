import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CreditCard, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface DummyPaymentProps {
  userName: string;
  userId: string;
  onComplete: () => void;
}

export const DummyPayment: React.FC<DummyPaymentProps> = ({ userName, userId, onComplete }) => {
  const [phase, setPhase] = useState<'checkout' | 'processing' | 'success'>('checkout');

  const handlePayment = () => {
    setPhase('processing');
    setTimeout(() => {
      setPhase('success');
      setTimeout(() => {
        onComplete();
      }, 2000);
    }, 2000);
  };

  const generateAccountNumber = () => {
    return `NG${userId.slice(0, 4).toUpperCase()}${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl p-4"
    >
      <AnimatePresence mode="wait">
        {phase === 'checkout' && (
          <motion.div
            key="checkout"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md"
          >
            <div className="bg-card rounded-2xl border border-border shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-6 h-6" />
                  <span className="font-semibold">NayandeepGPT Checkout</span>
                </div>
                <div className="text-4xl font-bold">$0.00</div>
                <div className="text-white/80 text-sm">Free Plan Activation</div>
              </div>

              {/* Details */}
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Customer Name</span>
                    <span className="font-medium">{userName || 'User'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">User ID</span>
                    <span className="font-mono text-xs">{userId.slice(0, 12)}...</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Account Number</span>
                    <span className="font-mono text-xs">{generateAccountNumber()}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Price</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (0%)</span>
                    <span>$0.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-primary">$0.00</span>
                  </div>
                </div>

                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-sm">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Shield className="w-4 h-4" />
                    <span>NO PAYMENT DETAILS REQUIRED</span>
                  </div>
                  <p className="text-muted-foreground text-xs mt-1">
                    This is a zero-dollar activation. No credit card needed.
                  </p>
                </div>

                <div className="p-3 bg-muted/50 rounded-xl">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Free Plan Includes:
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• 1,000 words per day</li>
                    <li>• 5 AI image generations</li>
                    <li>• Basic chat features</li>
                    <li>• Email support</li>
                  </ul>
                </div>

                <Button
                  onClick={handlePayment}
                  className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 text-lg"
                >
                  Continue with $0.00
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'processing' && (
          <motion.div
            key="processing"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="text-center"
          >
            <motion.div
              className="w-24 h-24 mx-auto mb-6 rounded-full border-4 border-primary border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <h2 className="text-xl font-semibold mb-2">Activating Your Plan...</h2>
            <p className="text-muted-foreground">Please wait a moment</p>
          </motion.div>
        )}

        {phase === 'success' && (
          <motion.div
            key="success"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <motion.div
              className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <Check className="w-16 h-16 text-white" strokeWidth={3} />
              </motion.div>
            </motion.div>
            
            <motion.h2
              className="text-2xl font-bold mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Payment Successful!
            </motion.h2>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Your Free Plan is now active
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
