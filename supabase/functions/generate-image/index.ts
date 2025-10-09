import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const hfToken = Deno.env.get('HF_TOKEN');

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
    
    // Use Hugging Face API for image generation
    const response = await fetch('https://router.huggingface.co/nebius/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hfToken}`,
      },
      body: JSON.stringify({
        response_format: 'b64_json',
        prompt: prompt,
        model: 'black-forest-labs/flux-dev',
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('[GENERATE-IMAGE] Hugging Face API error:', errorData);
      return new Response(JSON.stringify({ 
        error: "Image generation failed",
        message: "Unable to generate image. Please try again."
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const base64Image = data.data?.[0]?.b64_json;
    
    if (!base64Image) {
      console.error('[GENERATE-IMAGE] No image data in response');
      return new Response(JSON.stringify({ 
        error: "Image generation failed",
        message: "No image data received."
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const imageUrl = `data:image/png;base64,${base64Image}`;
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