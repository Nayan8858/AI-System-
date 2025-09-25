import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const pexelsApiKey = 'UZyYtGW6E2JrA9FSIz9ePA0sZDjmLDfri6fMska0Q4OHqpWUvBZKmnhW';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, page = 1, per_page = 8 } = await req.json();

    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${per_page}`, {
      headers: {
        'Authorization': pexelsApiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Pexels API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    const formattedResults = data.photos.map((photo: any) => ({
      id: photo.id,
      url: photo.url,
      photographer: photo.photographer,
      alt: photo.alt,
      src: {
        original: photo.src.original,
        large: photo.src.large,
        medium: photo.src.medium,
        small: photo.src.small,
        tiny: photo.src.tiny,
      }
    }));

    return new Response(JSON.stringify({ 
      photos: formattedResults,
      total_results: data.total_results,
      page: data.page,
      per_page: data.per_page
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in search-images function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});