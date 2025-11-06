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
    
    if (!query) {
      throw new Error('Search query is required');
    }

    const GOOGLE_API_KEY = "AIzaSyDZ2UIYIdYAxs8xWOtqPN37MQUJ1zYOHIM";
    const SEARCH_ENGINE_ID = "YOUR_SEARCH_ENGINE_ID"; // User needs to create this at https://programmablesearchengine.google.com/
    
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Search failed');
    }

    const results = data.items?.map((item: any) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      displayLink: item.displayLink,
      favicon: `https://www.google.com/s2/favicons?domain=${item.displayLink}`,
    })) || [];

    return new Response(
      JSON.stringify({ results }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Google Search error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
