import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const txnId = searchParams.get('txnId');
    
    if (!txnId) {
      setStatus('failed');
      setMessage('No transaction ID found');
      return;
    }

    // In a production app, you would verify the payment status with PhonePe
    // For now, we'll check the URL parameters or callback data
    const verifyPayment = async () => {
      try {
        // Simulate payment verification
        // In production, you would call your backend to verify with PhonePe
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // For demo purposes, assume success
        setStatus('success');
        setMessage('Your payment was successful! Your subscription has been activated.');
      } catch (error) {
        setStatus('failed');
        setMessage('Payment verification failed. Please contact support.');
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {status === 'loading' && 'Verifying Payment...'}
            {status === 'success' && 'Payment Successful!'}
            {status === 'failed' && 'Payment Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {status === 'loading' && (
            <div className="flex justify-center">
              <Loader2 className="w-16 h-16 animate-spin text-primary" />
            </div>
          )}
          
          {status === 'success' && (
            <div className="space-y-4">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
              <p className="text-muted-foreground">{message}</p>
              <Button onClick={() => navigate('/home')} className="w-full">
                Go to Home
              </Button>
            </div>
          )}
          
          {status === 'failed' && (
            <div className="space-y-4">
              <XCircle className="w-16 h-16 text-red-500 mx-auto" />
              <p className="text-muted-foreground">{message}</p>
              <div className="flex gap-4">
                <Button onClick={() => navigate('/pricing')} variant="outline" className="flex-1">
                  Try Again
                </Button>
                <Button onClick={() => navigate('/home')} className="flex-1">
                  Go to Home
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentStatus;
