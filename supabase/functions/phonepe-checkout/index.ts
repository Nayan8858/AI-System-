import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { crypto } from "https://deno.land/std@0.224.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PHONEPE_MERCHANT_ID = Deno.env.get('PHONEPE_MERCHANT_ID');
const PHONEPE_CLIENT_ID = Deno.env.get('PHONEPE_CLIENT_ID');
const PHONEPE_CLIENT_SECRET = Deno.env.get('PHONEPE_CLIENT_SECRET');

// PhonePe UAT environment
const PHONEPE_BASE_URL = 'https://api-preprod.phonepe.com/apis/pg-sandbox';

function logStep(step: string, details?: any) {
  console.log(`[PhonePe Checkout] ${step}`, details || '');
}

interface CheckoutRequest {
  amount: number;
  planName: string;
  billingCycle: 'monthly' | 'yearly';
  userEmail: string;
  userId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep('Starting PhonePe checkout');

    if (!PHONEPE_MERCHANT_ID || !PHONEPE_CLIENT_ID || !PHONEPE_CLIENT_SECRET) {
      throw new Error('PhonePe credentials not configured');
    }

    const body: CheckoutRequest = await req.json();
    const { amount, planName, billingCycle, userEmail, userId } = body;

    logStep('Request body', { amount, planName, billingCycle, userEmail, userId });

    // Generate unique transaction ID
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substring(2, 9)}`;
    
    // Create payment payload
    const paymentPayload = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: userId,
      amount: amount * 100, // Convert to paise
      redirectUrl: `${req.headers.get('origin')}/payment-status?txnId=${transactionId}`,
      redirectMode: 'POST',
      callbackUrl: `${req.headers.get('origin')}/api/phonepe-callback`,
      mobileNumber: '9999999999', // Default for testing
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    logStep('Payment payload', paymentPayload);

    // Base64 encode the payload
    const base64Payload = btoa(JSON.stringify(paymentPayload));
    
    // Create X-VERIFY header using Web Crypto API
    const stringToHash = base64Payload + '/pg/v1/pay' + PHONEPE_CLIENT_SECRET;
    const encoder = new TextEncoder();
    const data = encoder.encode(stringToHash);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const sha256Hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    const xVerifyHeader = `${sha256Hash}###1`;

    logStep('Making PhonePe API request');

    // Make payment request to PhonePe
    const response = await fetch(`${PHONEPE_BASE_URL}/pg/v1/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerifyHeader,
        'X-MERCHANT-ID': PHONEPE_MERCHANT_ID,
      },
      body: JSON.stringify({
        request: base64Payload
      })
    });

    const responseData = await response.json();
    logStep('PhonePe response', responseData);

    if (!response.ok || !responseData.success) {
      throw new Error(responseData.message || 'PhonePe payment initiation failed');
    }

    // Return the payment URL
    return new Response(
      JSON.stringify({
        success: true,
        url: responseData.data.instrumentResponse.redirectInfo.url,
        transactionId: transactionId
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    logStep('Error', error);
    console.error('Error in phonepe-checkout function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
