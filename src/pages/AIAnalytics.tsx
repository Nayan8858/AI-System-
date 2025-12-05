import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, Zap, Image, FileText, DollarSign, BarChart3 } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface ModelUsage {
  model: string;
  calls: number;
  words: number;
  color: string;
}

const AIAnalytics = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Sample analytics data - would come from Lovable Cloud DB
  const [analytics] = useState({
    totalCalls: 1247,
    totalWords: 89432,
    imageAnalysis: 156,
    pdfUploads: 43,
    monthlyBill: 12.47,
  });

  const modelUsageData: ModelUsage[] = [
    { model: 'DeepSeek-V3.1', calls: 450, words: 32000, color: '#3B82F6' },
    { model: 'Qwen2.5-Coder', calls: 280, words: 18500, color: '#22C55E' },
    { model: 'Qwen3-235B', calls: 190, words: 12800, color: '#A855F7' },
    { model: 'LLaMA-4-Scout', calls: 120, words: 9800, color: '#F97316' },
    { model: 'Gemini-2.0', calls: 95, words: 7200, color: '#06B6D4' },
    { model: 'DeepSeek-R1', calls: 72, words: 5400, color: '#6366F1' },
    { model: 'LLaMA-3.3', calls: 40, words: 3732, color: '#EC4899' },
  ];

  const weeklyData = [
    { day: 'Mon', calls: 145, words: 10200 },
    { day: 'Tue', calls: 198, words: 14500 },
    { day: 'Wed', calls: 167, words: 12300 },
    { day: 'Thu', calls: 212, words: 15800 },
    { day: 'Fri', calls: 189, words: 13900 },
    { day: 'Sat', calls: 156, words: 11200 },
    { day: 'Sun', calls: 180, words: 11532 },
  ];

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
                        <p className="text-2xl font-bold text-foreground">{analytics.totalCalls.toLocaleString()}</p>
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
                        <p className="text-2xl font-bold text-foreground">{analytics.totalWords.toLocaleString()}</p>
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
                        <p className="text-2xl font-bold text-foreground">{analytics.imageAnalysis}</p>
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
                        <p className="text-2xl font-bold text-foreground">{analytics.pdfUploads}</p>
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
                        <p className="text-2xl font-bold text-foreground">${analytics.monthlyBill.toFixed(2)}</p>
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
                                width: `${(model.calls / 450) * 100}%`,
                                backgroundColor: model.color
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                      <p className="text-sm text-muted-foreground">API Calls</p>
                      <p className="text-xl font-bold">$8.24</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-background/50">
                      <p className="text-sm text-muted-foreground">Image Analysis</p>
                      <p className="text-xl font-bold">$2.34</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-background/50">
                      <p className="text-sm text-muted-foreground">PDF Processing</p>
                      <p className="text-xl font-bold">$1.29</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-background/50">
                      <p className="text-sm text-muted-foreground">Storage</p>
                      <p className="text-xl font-bold">$0.60</p>
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
