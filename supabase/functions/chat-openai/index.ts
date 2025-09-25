import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

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

    // Convert conversation to Gemini format
    const contents = [];
    
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
    
    // Add system message as first user message and model response
    contents.push({
      role: 'user',
      parts: [{ text: systemMessage }]
    });
    contents.push({
      role: 'model',
      parts: [{ text: 'I understand. I\'ll help you accordingly as NayandeepGPT.' }]
    });
    
    // Add conversation history
    for (const msg of conversation) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    }
    
    // Add current message (note about image limitation)
    const messageText = imageData 
      ? `${message} (Note: An image was uploaded but cannot be processed with Gemini API)`
      : message;
      
    contents.push({
      role: 'user',
      parts: [{ text: messageText }]
    });

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-gemini function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});