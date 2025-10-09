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
    const { message, conversation = [], mode = 'normal', imageData = null } = await req.json();

    // Convert conversation to Grok AI format
    const messages = [];
    
    // Add system message based on mode
    let systemMessage = 'You are NayandeepGPT, a helpful AI assistant. Be concise and helpful.';
    
    switch (mode) {
      case 'reasoning':
        systemMessage = 'You are NayandeepGPT in reasoning mode. Engage in critical thinking and provide thoughtful, in-depth analysis. Break down complex problems step by step.';
        break;
      case 'image-generator':
        systemMessage = 'You are NayandeepGPT in image generation mode. Help users create detailed image prompts and descriptions for image generation.';
        break;
      case 'deep-research':
        systemMessage = 'You are NayandeepGPT in deep research mode. Combine your knowledge with internet research to provide comprehensive answers with sources.';
        break;
      case 'web-search':
        systemMessage = 'You are NayandeepGPT in web search mode. Act as a dedicated search engine, finding and presenting the most relevant information from various sources.';
        break;
    }
    
    messages.push({ role: 'system', content: systemMessage });
    
    // Add conversation history
    for (const msg of conversation) {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    }
    
    // Add current message (note about image limitation)
    const messageText = imageData 
      ? `${message} (Note: An image was uploaded but cannot be processed with Grok AI)`
      : message;
      
    messages.push({
      role: 'user',
      content: messageText
    });

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterApiKey}`,
        'HTTP-Referer': 'https://hyntihxkukwnpwmlinhf.supabase.co',
        'X-Title': 'NayandeepGPT'
      },
      body: JSON.stringify({
        model: 'x-ai/grok-beta',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', errorData);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});