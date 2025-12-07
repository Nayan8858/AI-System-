import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, Zap, Image, FileText, DollarSign, BarChart3, RefreshCw } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface ModelUsage {
  model: string;
  calls: number;
  words: number;
  color: string;
}

interface AnalyticsData {
  totalCalls: number;
  totalWords: number;
  imageAnalysis: number;
  pdfUploads: number;
  monthlyBill: number;
}

// Pricing constants
const PRICE_PER_1000_WORDS = 0.40;
const PRICE_PER_IMAGE = 1.50;
const PRICE_PER_ANALYSIS = 2.10;

const AIAnalytics = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalCalls: 0,
    totalWords: 0,
    imageAnalysis: 0,
    pdfUploads: 0,
    monthlyBill: 0,
  });
  const [modelUsageData, setModelUsageData] = useState<ModelUsage[]>([]);
  const [weeklyData, setWeeklyData] = useState<{ day: string; calls: number; words: number }[]>([]);

  const modelColors: Record<string, string> = {
    'DeepSeek-V3.1': '#3B82F6',
    'Qwen2.5-Coder': '#22C55E',
    'Qwen3-235B': '#A855F7',
    'LLaMA-4-Scout': '#F97316',
    'LLaMA-3.3-70B': '#EC4899',
    'Gemini-2.0': '#06B6D4',
    'DeepSeek-R1': '#6366F1',
    'Qwen2.5-VL': '#8B5CF6',
  };

  const fetchAnalytics = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      // Fetch analytics data from Supabase
      const { data: usageData, error } = await supabase
        .from('analytics_usage')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching analytics:', error);
        // Use cached data from localStorage as fallback
        loadCachedAnalytics();
        return;
      }

      if (usageData && usageData.length > 0) {
        // Calculate totals
        const totals = usageData.reduce((acc, item) => ({
          totalCalls: acc.totalCalls + 1,
          totalWords: acc.totalWords + (item.tokens_or_words || 0),
          imageAnalysis: acc.imageAnalysis + (item.image_analysis ? 1 : 0),
          pdfUploads: acc.pdfUploads + (item.pdf_uploaded ? 1 : 0),
          totalCost: acc.totalCost + (item.cost_usd || 0),
        }), { totalCalls: 0, totalWords: 0, imageAnalysis: 0, pdfUploads: 0, totalCost: 0 });

        // Calculate monthly bill based on pricing
        const monthlyBill = 
          (totals.totalWords / 1000) * PRICE_PER_1000_WORDS +
          totals.imageAnalysis * PRICE_PER_ANALYSIS +
          totals.pdfUploads * PRICE_PER_ANALYSIS;

        setAnalytics({
          totalCalls: totals.totalCalls,
          totalWords: totals.totalWords,
          imageAnalysis: totals.imageAnalysis,
          pdfUploads: totals.pdfUploads,
          monthlyBill: Math.round(monthlyBill * 100) / 100,
        });

        // Calculate model usage
        const modelMap = new Map<string, { calls: number; words: number }>();
        usageData.forEach(item => {
          const model = item.model_used || 'DeepSeek-V3.1';
          const existing = modelMap.get(model) || { calls: 0, words: 0 };
          modelMap.set(model, {
            calls: existing.calls + 1,
            words: existing.words + (item.tokens_or_words || 0),
          });
        });

        const modelUsage: ModelUsage[] = Array.from(modelMap.entries()).map(([model, data]) => ({
          model,
          calls: data.calls,
          words: data.words,
          color: modelColors[model] || '#6B7280',
        }));

        setModelUsageData(modelUsage.sort((a, b) => b.calls - a.calls));

        // Calculate weekly data
        const now = new Date();
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weekly: { day: string; calls: number; words: number }[] = [];
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const dayStart = new Date(date.setHours(0, 0, 0, 0));
          const dayEnd = new Date(date.setHours(23, 59, 59, 999));
          
          const dayData = usageData.filter(item => {
            const itemDate = new Date(item.created_at);
            return itemDate >= dayStart && itemDate <= dayEnd;
          });

          weekly.push({
            day: dayNames[date.getDay()],
            calls: dayData.length,
            words: dayData.reduce((sum, item) => sum + (item.tokens_or_words || 0), 0),
          });
        }
        
        setWeeklyData(weekly);

        // Cache the data
        localStorage.setItem('nayandeep_analytics_cache', JSON.stringify({
          analytics: { ...totals, monthlyBill },
          modelUsage,
          weeklyData: weekly,
          timestamp: Date.now(),
        }));
      } else {
        loadCachedAnalytics();
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      loadCachedAnalytics();
    } finally {
      setIsLoading(false);
    }
  };

  const loadCachedAnalytics = () => {
    const cached = localStorage.getItem('nayandeep_analytics_cache');
    if (cached) {
      try {
        const data = JSON.parse(cached);
        setAnalytics(data.analytics || analytics);
        setModelUsageData(data.modelUsage || []);
        setWeeklyData(data.weeklyData || []);
      } catch (e) {
        console.error('Failed to parse cached analytics:', e);
      }
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [user?.id]);

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="h-14 border-b border-border flex items-center px-4 justify-between bg-card/50 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              {isMobile && <SidebarTrigger />}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/home')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <h1 className="text-xl font-semibold text-foreground">AI Analytics</h1>
            </div>
            <Button variant="outline" size="sm" onClick={fetchAnalytics} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total API Calls</p>
                        {isLoading ? (
                          <Skeleton className="h-8 w-20" />
                        ) : (
                          <p className="text-2xl font-bold text-foreground">{analytics.totalCalls.toLocaleString()}</p>
                        )}
                      </div>
                      <Zap className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Words Generated</p>
                        {isLoading ? (
                          <Skeleton className="h-8 w-24" />
                        ) : (
                          <p className="text-2xl font-bold text-foreground">{analytics.totalWords.toLocaleString()}</p>
                        )}
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Image Analysis</p>
                        {isLoading ? (
                          <Skeleton className="h-8 w-16" />
                        ) : (
                          <p className="text-2xl font-bold text-foreground">{analytics.imageAnalysis}</p>
                        )}
                      </div>
                      <Image className="w-8 h-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">PDF Uploads</p>
                        {isLoading ? (
                          <Skeleton className="h-8 w-12" />
                        ) : (
                          <p className="text-2xl font-bold text-foreground">{analytics.pdfUploads}</p>
                        )}
                      </div>
                      <FileText className="w-8 h-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly Bill (USD)</p>
                        {isLoading ? (
                          <Skeleton className="h-8 w-20" />
                        ) : (
                          <p className="text-2xl font-bold text-foreground">${analytics.monthlyBill.toFixed(2)}</p>
                        )}
                      </div>
                      <DollarSign className="w-8 h-8 text-emerald-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Usage Chart */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      <span>Weekly API Usage</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      {isLoading ? (
                        <div className="h-full flex items-center justify-center">
                          <Skeleton className="h-full w-full" />
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={weeklyData}>
                            <defs>
                              <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                            <XAxis dataKey="day" className="text-muted-foreground" />
                            <YAxis className="text-muted-foreground" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))', 
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px'
                              }} 
                            />
                            <Area 
                              type="monotone" 
                              dataKey="calls" 
                              stroke="hsl(var(--primary))" 
                              fillOpacity={1} 
                              fill="url(#colorCalls)" 
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Model Usage Distribution */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <span>Model Usage Distribution</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      {isLoading ? (
                        <div className="h-full flex items-center justify-center">
                          <Skeleton className="h-full w-full rounded-full" />
                        </div>
                      ) : modelUsageData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={modelUsageData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="calls"
                            >
                              {modelUsageData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))', 
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px'
                              }} 
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                          No usage data yet
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Model Breakdown Table */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Model Performance Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-14 w-full" />
                      ))}
                    </div>
                  ) : modelUsageData.length > 0 ? (
                    <div className="space-y-4">
                      {modelUsageData.map((model) => (
                        <div key={model.model} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: model.color }}
                            />
                            <span className="font-medium">{model.model}</span>
                          </div>
                          <div className="flex items-center space-x-6 text-sm">
                            <div className="text-muted-foreground">
                              <span className="font-semibold text-foreground">{model.calls}</span> calls
                            </div>
                            <div className="text-muted-foreground">
                              <span className="font-semibold text-foreground">{model.words.toLocaleString()}</span> words
                            </div>
                            <div className="w-32 bg-muted rounded-full h-2">
                              <div 
                                className="h-2 rounded-full transition-all"
                                style={{ 
                                  width: `${Math.min((model.calls / Math.max(...modelUsageData.map(m => m.calls))) * 100, 100)}%`,
                                  backgroundColor: model.color
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No model usage data yet. Start chatting to see analytics!
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Billing Section */}
              <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <span>Monthly Billing Summary (USD)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg bg-background/50">
                      <p className="text-sm text-muted-foreground">LLM Usage</p>
                      <p className="text-xl font-bold">
                        ${((analytics.totalWords / 1000) * PRICE_PER_1000_WORDS).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">${PRICE_PER_1000_WORDS}/1K words</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-background/50">
                      <p className="text-sm text-muted-foreground">Image Analysis</p>
                      <p className="text-xl font-bold">
                        ${(analytics.imageAnalysis * PRICE_PER_ANALYSIS).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">${PRICE_PER_ANALYSIS}/analysis</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-background/50">
                      <p className="text-sm text-muted-foreground">PDF Processing</p>
                      <p className="text-xl font-bold">
                        ${(analytics.pdfUploads * PRICE_PER_ANALYSIS).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">${PRICE_PER_ANALYSIS}/upload</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-primary/20">
                      <p className="text-sm text-muted-foreground">Total Bill</p>
                      <p className="text-2xl font-bold text-primary">${analytics.monthlyBill.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </div>
                  </div>
                  <div className="mt-4 text-center text-sm text-muted-foreground">
                    This is a display-only summary. Actual billing is managed through your subscription plan.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AIAnalytics;
