import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-RAZORPAY-CHECKOUT] ${step}${detailsStr}`);
};

// Razorpay subscription plan IDs (these will be created if they don't exist)
const RAZORPAY_PLANS = {
  basic_monthly: { amount: 39900, period: "monthly", interval: 1, name: "Basic Monthly" },
  basic_yearly: { amount: 429900, period: "yearly", interval: 1, name: "Basic Yearly" },
  premium_monthly: { amount: 129900, period: "monthly", interval: 1, name: "Premium Monthly" },
  premium_yearly: { amount: 1399900, period: "yearly", interval: 1, name: "Premium Yearly" },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const { planType, userEmail, userId } = await req.json();
    
    if (!planType || !userEmail || !userId) {
      throw new Error("Plan type, user email, and user ID are required");
    }
    
    logStep("Request data received", { planType, userEmail, userId });

    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    
    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error("Razorpay credentials not configured");
    }

    const authHeader = `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`;
    
    // Get plan details
    const planConfig = RAZORPAY_PLANS[planType as keyof typeof RAZORPAY_PLANS];
    if (!planConfig) {
      throw new Error("Invalid plan type");
    }

    // Create or get Razorpay customer
    logStep("Creating/fetching Razorpay customer");
    const customersResponse = await fetch(`https://api.razorpay.com/v1/customers`, {
      method: "GET",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
    });

    let customerId;
    const customersData = await customersResponse.json();
    const existingCustomer = customersData.items?.find((c: any) => c.email === userEmail);
    
    if (existingCustomer) {
      customerId = existingCustomer.id;
      logStep("Existing customer found", { customerId });
    } else {
      const createCustomerResponse = await fetch(`https://api.razorpay.com/v1/customers`, {
        method: "POST",
        headers: {
          "Authorization": authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userEmail.split('@')[0],
          email: userEmail,
          notes: { user_id: userId },
        }),
      });
      
      const newCustomer = await createCustomerResponse.json();
      customerId = newCustomer.id;
      logStep("New customer created", { customerId });
    }

    // Create or get plan
    logStep("Creating/fetching Razorpay plan");
    const plansResponse = await fetch(`https://api.razorpay.com/v1/plans`, {
      method: "GET",
      headers: {
        "Authorization": authHeader,
      },
    });

    let planId;
    const plansData = await plansResponse.json();
    logStep("Plans data received", { count: plansData.items?.length });
    
    const existingPlan = plansData.items?.find((p: any) => 
      p.item?.name === planConfig.name && 
      p.item?.amount === planConfig.amount
    );

    if (existingPlan) {
      planId = existingPlan.id;
      logStep("Existing plan found", { planId });
    } else {
      const createPlanResponse = await fetch(`https://api.razorpay.com/v1/plans`, {
        method: "POST",
        headers: {
          "Authorization": authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          period: planConfig.period,
          interval: planConfig.interval,
          item: {
            name: planConfig.name,
            amount: planConfig.amount,
            currency: "INR",
          },
        }),
      });
      
      if (!createPlanResponse.ok) {
        const errorData = await createPlanResponse.json();
        logStep("Error creating plan", errorData);
        throw new Error(errorData.error?.description || "Failed to create plan");
      }
      
      const newPlan = await createPlanResponse.json();
      
      if (!newPlan.id) {
        logStep("Invalid plan response", newPlan);
        throw new Error("Failed to create plan - no ID returned");
      }
      
      planId = newPlan.id;
      logStep("New plan created", { planId, planData: newPlan });
    }
    
    if (!planId) {
      throw new Error("Plan ID is missing");
    }

    // Return plan details for frontend checkout
    logStep("Returning checkout data", { planId, amount: planConfig.amount });

    return new Response(JSON.stringify({ 
      planId: planId,
      razorpayKeyId: razorpayKeyId,
      amount: planConfig.amount,
      currency: "INR",
      name: planConfig.name,
      customerEmail: userEmail,
      customerId: customerId,
      notes: {
        user_id: userId,
        plan_type: planType,
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-razorpay-checkout", { message: errorMessage });
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
