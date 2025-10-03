import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-RAZORPAY-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = await req.json();
    
    if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
      throw new Error("Missing payment verification parameters");
    }

    logStep("Payment verification data received", { 
      payment_id: razorpay_payment_id,
      subscription_id: razorpay_subscription_id 
    });

    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!razorpayKeySecret) {
      throw new Error("Razorpay key secret not configured");
    }

    // Verify signature
    const crypto = await import("https://deno.land/std@0.177.0/crypto/mod.ts");
    const encoder = new TextEncoder();
    const data = encoder.encode(`${razorpay_payment_id}|${razorpay_subscription_id}`);
    const key = encoder.encode(razorpayKeySecret);
    
    const signature = await crypto.crypto.subtle.importKey(
      "raw",
      key,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signatureBytes = await crypto.crypto.subtle.sign("HMAC", signature, data);
    const expectedSignature = Array.from(new Uint8Array(signatureBytes))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (expectedSignature !== razorpay_signature) {
      logStep("Signature verification failed");
      throw new Error("Invalid signature");
    }

    logStep("Payment signature verified successfully");

    return new Response(JSON.stringify({ 
      success: true,
      message: "Payment verified successfully"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in verify-razorpay-payment", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
