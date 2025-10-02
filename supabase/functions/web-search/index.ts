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
    
    // Format search results with summary and links
    let summary = '';
    const sources = [];
    
    // Build summary from available data
    if (searchData.Abstract) {
      const sentences = searchData.Abstract.split('. ');
      summary = sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '.' : '');
      
      if (searchData.AbstractURL && searchData.AbstractSource) {
        sources.push({
          title: `${searchData.AbstractSource}: ${searchData.Heading || 'Article'}`,
          url: searchData.AbstractURL,
          note: 'Primary source'
        });
      }
    } else if (searchData.Answer) {
      summary = searchData.Answer;
    } else {
      summary = 'No direct answer found. Please try a more specific query.';
    }
    
    // Add related topics as additional sources
    if (searchData.RelatedTopics && searchData.RelatedTopics.length > 0) {
      for (let i = 0; i < Math.min(2, searchData.RelatedTopics.length); i++) {
        const topic = searchData.RelatedTopics[i];
        if (topic.FirstURL && topic.Text) {
          sources.push({
            title: topic.Text.split(' - ')[0] || 'Related Article',
            url: topic.FirstURL,
            note: 'Related information'
          });
        }
      }
    }
    
    // Format the response
    const results = {
      summary,
      sources: sources.slice(0, 3), // Max 3 sources
      raw_data: {
        abstract: searchData.Abstract,
        abstract_source: searchData.AbstractSource,
        abstract_url: searchData.AbstractURL,
        answer: searchData.Answer,
        answer_type: searchData.AnswerType,
      }
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