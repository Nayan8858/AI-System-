import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { clerkUserId, onboardingData, preferencesData } = body as {
      clerkUserId?: string;
      onboardingData?: Record<string, unknown>;
      preferencesData?: Record<string, unknown>;
    };

    if (!clerkUserId || !onboardingData || !preferencesData) {
      return new Response(
        JSON.stringify({ error: "Missing required onboarding payload" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceKey) {
      console.error("Missing Supabase env vars", { hasUrl: !!supabaseUrl, hasKey: !!serviceKey });
      return new Response(
        JSON.stringify({ error: "Supabase environment not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    // Ensure identifiers are correctly set on payloads
    const onboardingPayload = {
      ...onboardingData,
      clerk_user_id: clerkUserId,
    };

    const preferencesPayload = {
      ...preferencesData,
      user_id: clerkUserId,
    };

    // Upsert into legacy onboarding table
    const { data: existingOnboarding, error: fetchOnboardingError } = await supabase
      .from("user_onboarding_data")
      .select("id")
      .eq("clerk_user_id", clerkUserId)
      .maybeSingle();

    if (fetchOnboardingError) {
      console.error("Error fetching existing onboarding row", fetchOnboardingError);
      throw fetchOnboardingError;
    }

    let onboardingError = null;
    if (existingOnboarding) {
      const { error } = await supabase
        .from("user_onboarding_data")
        .update(onboardingPayload)
        .eq("clerk_user_id", clerkUserId);
      onboardingError = error;
    } else {
      const { error } = await supabase.from("user_onboarding_data").insert(onboardingPayload);
      onboardingError = error;
    }

    if (onboardingError) {
      console.error("Error saving onboarding data", onboardingError);
      throw onboardingError;
    }

    // Upsert into user_preferences table
    const { data: existingPrefs, error: fetchPrefsError } = await supabase
      .from("user_preferences")
      .select("id")
      .eq("user_id", clerkUserId)
      .maybeSingle();

    if (fetchPrefsError) {
      console.error("Error fetching existing preferences row", fetchPrefsError);
      throw fetchPrefsError;
    }

    let prefsError = null;
    if (existingPrefs) {
      const { error } = await supabase
        .from("user_preferences")
        .update(preferencesPayload)
        .eq("user_id", clerkUserId);
      prefsError = error;
    } else {
      const { error } = await supabase.from("user_preferences").insert(preferencesPayload);
      prefsError = error;
    }

    if (prefsError) {
      console.error("Error saving preferences data", prefsError);
      throw prefsError;
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("save-onboarding error", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
