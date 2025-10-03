import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-RAZORPAY-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const { clerkUserId, userEmail } = await req.json();
    
    if (!clerkUserId || !userEmail) {
      throw new Error("User ID and email are required");
    }

    logStep("Request data received", { clerkUserId, userEmail });

    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    
    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error("Razorpay credentials not configured");
    }

    logStep("Razorpay credentials verified");

    const razorpayAuth = `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`;
    
    // Get customer by email
    const customersResponse = await fetch(`https://api.razorpay.com/v1/customers`, {
      method: "GET",
      headers: {
        "Authorization": razorpayAuth,
        "Content-Type": "application/json",
      },
    });

    if (!customersResponse.ok) {
      logStep("No customer found");
      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customersData = await customersResponse.json();
    const customer = customersData.items?.find((c: any) => c.email === userEmail);

    if (!customer) {
      logStep("No Razorpay customer found for email");
      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    logStep("Found Razorpay customer", { customerId: customer.id });

    // Get subscriptions for customer
    const subscriptionsResponse = await fetch(
      `https://api.razorpay.com/v1/subscriptions?customer_id=${customer.id}`,
      {
        method: "GET",
        headers: {
          "Authorization": razorpayAuth,
          "Content-Type": "application/json",
        },
      }
    );

    const subscriptionsData = await subscriptionsResponse.json();
    const activeSubscriptions = subscriptionsData.items?.filter(
      (sub: any) => sub.status === "active" || sub.status === "authenticated"
    );

    if (!activeSubscriptions || activeSubscriptions.length === 0) {
      logStep("No active subscriptions found");
      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const subscription = activeSubscriptions[0];
    const planType = subscription.notes?.plan_type || "basic_monthly";
    const subscriptionEnd = new Date(subscription.current_end * 1000).toISOString();

    logStep("Active subscription found", { 
      subscriptionId: subscription.id, 
      planType,
      endDate: subscriptionEnd 
    });

    return new Response(JSON.stringify({
      subscribed: true,
      plan_type: planType,
      subscription_end: subscriptionEnd,
      subscription_id: subscription.id,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-razorpay-subscription", { message: errorMessage });
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
