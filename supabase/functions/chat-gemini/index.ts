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
    const { message, conversation = [] } = await req.json();

    // Smart model routing based on prompt keywords
    const q = message.toLowerCase();
    let modelKey = Deno.env.get('API_DEEPSEEK_V3_KEY');
    let modelName = 'deepseek/deepseek-chat';
    
    if (q.includes("code") || q.includes("debug") || q.includes("html") || q.includes("css") || q.includes("javascript")) {
      modelKey = Deno.env.get('API_QWEN_CODER_KEY');
      modelName = 'qwen/qwen-2.5-coder-32b-instruct';
    } else if (q.includes("math") || q.includes("solve") || q.includes("calculate") || q.includes("reason")) {
      modelKey = Deno.env.get('API_QWEN3_KEY');
      modelName = 'qwen/qwen-2.5-72b-instruct';
    } else if (q.includes("email") || q.includes("report") || q.includes("resume") || q.includes("formal")) {
      modelKey = Deno.env.get('API_LLAMA4_KEY');
      modelName = 'meta-llama/llama-3.3-70b-instruct';
    } else if (q.includes("write") || q.includes("blog") || q.includes("story") || q.includes("creative")) {
      modelKey = Deno.env.get('API_LLAMA3_KEY');
      modelName = 'meta-llama/llama-3.3-70b-instruct';
    } else if (q.includes("search") || q.includes("find") || q.includes("latest")) {
      modelKey = Deno.env.get('API_GEMINI_KEY');
      modelName = 'google/gemini-2.0-flash-exp:free';
    } else if (q.includes("research") || q.includes("compare") || q.includes("analyze")) {
      modelKey = Deno.env.get('API_DEEPSEEK_R1_KEY');
      modelName = 'deepseek/deepseek-r1-distill-llama-70b';
    }

    // Convert conversation format
    const messages = [
      { role: 'system', content: 'You are NayandeepGPT, a helpful AI assistant. Be concise and helpful.' }
    ];
    
    // Add conversation history
    for (const msg of conversation) {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    }
    
    // Add current message
    messages.push({
      role: 'user',
      content: message
    });

    console.log(`Using model: ${modelName} for prompt: ${message.substring(0, 50)}...`);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${modelKey || openRouterApiKey}`,
        'HTTP-Referer': 'https://ocjiljegwhcodeqxwjpe.supabase.co',
        'X-Title': 'NayandeepGPT'
      },
      body: JSON.stringify({
        model: modelName,
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