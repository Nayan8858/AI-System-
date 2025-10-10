import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    
    console.log('[GENERATE-IMAGE] Generating image with prompt:', prompt);
    
    // Use OpenRouter API for image generation
    const response = await fetch('https://openrouter.ai/api/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterApiKey}`,
        'HTTP-Referer': 'https://hyntihxkukwnpwmlinhf.supabase.co',
        'X-Title': 'NayandeepGPT'
      },
      body: JSON.stringify({
        model: 'black-forest-labs/flux-pro',
        prompt: prompt,
        n: 1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('[GENERATE-IMAGE] OpenRouter API error:', errorData);
      return new Response(JSON.stringify({ 
        error: "Image generation failed",
        message: "Unable to generate image. Please try again."
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const imageUrl = data.data?.[0]?.url;
    
    if (!imageUrl) {
      console.error('[GENERATE-IMAGE] No image data in response');
      return new Response(JSON.stringify({ 
        error: "Image generation failed",
        message: "No image data received."
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('[GENERATE-IMAGE] Image generated successfully');

    return new Response(JSON.stringify({ 
      imageUrl: imageUrl
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[GENERATE-IMAGE] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});