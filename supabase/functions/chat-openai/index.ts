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

    // Smart model routing based on prompt keywords
    const q = message.toLowerCase();
    let apiKey = openRouterApiKey;
    let modelName = 'deepseek/deepseek-chat';
    let selectedModel = 'DeepSeek-V3.1';
    
    // Check for specific API keys and route accordingly
    if (q.includes("code") || q.includes("debug") || q.includes("html") || q.includes("css") || q.includes("javascript") || q.includes("python") || q.includes("program")) {
      const qwenKey = Deno.env.get('API_QWEN_CODER_KEY');
      if (qwenKey) apiKey = qwenKey;
      modelName = 'qwen/qwen-2.5-coder-32b-instruct';
      selectedModel = 'Qwen2.5-Coder-32B';
    } else if (q.includes("math") || q.includes("solve") || q.includes("calculate") || q.includes("reason") || q.includes("logic")) {
      const qwen3Key = Deno.env.get('API_QWEN3_KEY');
      if (qwen3Key) apiKey = qwen3Key;
      modelName = 'qwen/qwen-2.5-72b-instruct';
      selectedModel = 'Qwen3-235B';
    } else if (q.includes("email") || q.includes("report") || q.includes("resume") || q.includes("formal") || q.includes("professional")) {
      const llama4Key = Deno.env.get('API_LLAMA4_KEY');
      if (llama4Key) apiKey = llama4Key;
      modelName = 'meta-llama/llama-3.3-70b-instruct';
      selectedModel = 'LLaMA-4-Scout';
    } else if (q.includes("write") || q.includes("blog") || q.includes("story") || q.includes("creative") || q.includes("poem")) {
      const llama3Key = Deno.env.get('API_LLAMA3_KEY');
      if (llama3Key) apiKey = llama3Key;
      modelName = 'meta-llama/llama-3.3-70b-instruct';
      selectedModel = 'LLaMA-3.3-70B';
    } else if (q.includes("search") || q.includes("find") || q.includes("latest") || q.includes("news")) {
      const geminiKey = Deno.env.get('API_GEMINI_KEY');
      if (geminiKey) apiKey = geminiKey;
      modelName = 'google/gemini-2.0-flash-exp:free';
      selectedModel = 'Gemini-2.0-Flash';
    } else if (imageData) {
      const qwenVlKey = Deno.env.get('API_QWEN_VL_KEY');
      if (qwenVlKey) apiKey = qwenVlKey;
      modelName = 'qwen/qwen-2-vl-72b-instruct';
      selectedModel = 'Qwen2.5-VL-32B';
    } else if (q.includes("research") || q.includes("compare") || q.includes("analyze") || q.includes("deep") || q.includes("study")) {
      const r1Key = Deno.env.get('API_DEEPSEEK_R1_KEY');
      if (r1Key) apiKey = r1Key;
      modelName = 'deepseek/deepseek-r1-distill-llama-70b';
      selectedModel = 'DeepSeek-R1-Distill';
    } else {
      // Default to DeepSeek V3
      const dsKey = Deno.env.get('API_DEEPSEEK_V3_KEY');
      if (dsKey) apiKey = dsKey;
    }

    // Fallback to OpenRouter key if specific key is not available
    if (!apiKey) {
      apiKey = openRouterApiKey;
    }

    // Convert conversation format
    const messages = [];
    
    // Add system message based on mode
    let systemMessage = 'You are NayandeepGPT, a helpful AI assistant created by Nayandeep. Be concise, accurate, and helpful. Format your responses using markdown when appropriate.';
    
    switch (mode) {
      case 'reasoning':
        systemMessage = 'You are NayandeepGPT in reasoning mode. Engage in critical thinking and provide thoughtful, in-depth analysis. Break down complex problems step by step. Show your reasoning process.';
        break;
      case 'image-generator':
        systemMessage = 'You are NayandeepGPT in image generation mode. Help users create detailed image prompts and descriptions for image generation.';
        break;
      case 'deep-research':
        systemMessage = 'You are NayandeepGPT in deep research mode. Provide comprehensive, well-researched answers with detailed explanations. Cite sources when possible.';
        break;
      case 'web-search':
        systemMessage = 'You are NayandeepGPT in web search mode. Act as a search assistant, finding and presenting the most relevant information.';
        break;
      case 'study':
        systemMessage = 'You are NayandeepGPT in study mode. Help users learn and understand topics better. Explain concepts clearly and provide examples.';
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
    
    // Add current message with image context if present
    const messageContent = imageData 
      ? `[User has attached an image for analysis] ${message}`
      : message;
      
    messages.push({
      role: 'user',
      content: messageContent
    });

    console.log(`[CHAT] Using model: ${modelName} (${selectedModel}) for prompt: "${message.substring(0, 50)}..."`);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://auxvsufpyxbyrufpjkkq.supabase.co',
        'X-Title': 'NayandeepGPT'
      },
      body: JSON.stringify({
        model: modelName,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('[CHAT] OpenRouter API error:', errorData);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    console.log(`[CHAT] Response received from ${selectedModel}, length: ${reply.length} chars`);

    return new Response(JSON.stringify({ 
      reply,
      model: selectedModel,
      wordCount: reply.split(/\s+/).length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[CHAT] Error in chat function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
