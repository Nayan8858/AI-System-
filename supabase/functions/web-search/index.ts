import "https://deno.land/x/xhr@0.1.0/mod.ts";
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

    // Use DuckDuckGo Instant Answer API for web search
    const searchResponse = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`);
    
    if (!searchResponse.ok) {
      throw new Error(`Search API request failed: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();
    
    // Format search results
    const results = {
      abstract: searchData.Abstract,
      abstract_source: searchData.AbstractSource,
      abstract_url: searchData.AbstractURL,
      related_topics: searchData.RelatedTopics?.slice(0, 5) || [],
      infobox: searchData.Infobox,
      answer: searchData.Answer,
      answer_type: searchData.AnswerType,
    };

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in web-search function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});