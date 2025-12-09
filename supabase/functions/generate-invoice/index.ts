import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PRICE_PER_1000_WORDS = 0.40;
const PRICE_PER_IMAGE = 1.50;
const PRICE_PER_ANALYSIS = 2.10;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, month, year } = await req.json();
    
    if (!userId) {
      throw new Error('User ID is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the month's start and end dates
    const currentMonth = month || new Date().getMonth();
    const currentYear = year || new Date().getFullYear();
    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

    console.log(`Generating invoice for user ${userId} from ${startDate} to ${endDate}`);

    // Fetch usage data for the month
    const { data: usageData, error: usageError } = await supabase
      .from('analytics_usage')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    if (usageError) {
      console.error('Error fetching usage data:', usageError);
      throw usageError;
    }

    // Calculate totals per model
    const modelUsage: Record<string, { calls: number; words: number }> = {};
    let totalWords = 0;
    let totalImages = 0;
    let totalAnalysis = 0;

    (usageData || []).forEach((item: any) => {
      const model = item.model_used || 'DeepSeek-V3.1';
      if (!modelUsage[model]) {
        modelUsage[model] = { calls: 0, words: 0 };
      }
      modelUsage[model].calls += 1;
      modelUsage[model].words += item.tokens_or_words || 0;
      totalWords += item.tokens_or_words || 0;
      
      if (item.image_analysis) totalAnalysis++;
      if (item.pdf_uploaded) totalAnalysis++;
    });

    // Calculate costs
    const wordsCost = (totalWords / 1000) * PRICE_PER_1000_WORDS;
    const imageCost = totalImages * PRICE_PER_IMAGE;
    const analysisCost = totalAnalysis * PRICE_PER_ANALYSIS;
    const totalCost = wordsCost + imageCost + analysisCost;

    // Generate invoice data
    const invoice = {
      invoiceNumber: `INV-${currentYear}${String(currentMonth + 1).padStart(2, '0')}-${userId.slice(0, 8).toUpperCase()}`,
      userId,
      periodStart: startDate.toISOString(),
      periodEnd: endDate.toISOString(),
      generatedAt: new Date().toISOString(),
      breakdown: {
        models: Object.entries(modelUsage).map(([model, data]) => ({
          model,
          calls: data.calls,
          words: data.words,
          cost: (data.words / 1000) * PRICE_PER_1000_WORDS,
        })),
        totalWords,
        totalImages,
        totalAnalysis,
      },
      costs: {
        words: Math.round(wordsCost * 100) / 100,
        images: Math.round(imageCost * 100) / 100,
        analysis: Math.round(analysisCost * 100) / 100,
        total: Math.round(totalCost * 100) / 100,
      },
      status: 'generated',
    };

    // Store invoice in billing_records
    const { error: insertError } = await supabase
      .from('billing_records')
      .upsert({
        user_id: userId,
        period_start: startDate.toISOString(),
        period_end: endDate.toISOString(),
        total_words: totalWords,
        total_images: totalImages,
        total_analysis: totalAnalysis,
        amount_usd: totalCost,
        is_paid: false,
        invoice_sent: true,
        due_date: new Date(endDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      });

    if (insertError) {
      console.error('Error storing invoice:', insertError);
    }

    console.log('Invoice generated successfully:', invoice.invoiceNumber);

    return new Response(JSON.stringify({ success: true, invoice }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating invoice:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
