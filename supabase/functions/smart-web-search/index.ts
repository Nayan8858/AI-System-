import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log('[SMART-WEB-SEARCH] Processing search query:', query);

    const systemPrompt = `You are an AI-powered web search assistant. Based on the user's query, provide:
1. A comprehensive answer synthesizing information from multiple sources
2. Key facts and data points
3. Recent developments or news (if relevant)
4. Multiple perspectives on the topic
5. Suggested related topics to explore

Format your response with clear sections and bullet points where appropriate.
Always indicate when information might be outdated or when the user should verify from official sources.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Search query: "${query}"\n\nProvide a comprehensive answer with relevant information.` }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error('[SMART-WEB-SEARCH] API error:', response.status, errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const searchResult = data.choices?.[0]?.message?.content || "Unable to perform search.";

    console.log('[SMART-WEB-SEARCH] Search complete, length:', searchResult.length);

    return new Response(JSON.stringify({ 
      result: searchResult,
      query,
      model: "Gemini-2.5-Flash",
      wordCount: searchResult.split(/\s+/).length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[SMART-WEB-SEARCH] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
