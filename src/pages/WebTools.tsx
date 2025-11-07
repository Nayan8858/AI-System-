import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Globe, FileText, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/logo.png';

const WebTools = () => {
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [result, setResult] = useState('');

  const tools = [
    { icon: Globe, title: 'Web Reader', desc: 'Summarize any webpage', color: 'from-blue-500/20 to-cyan-500/20' },
    { icon: FileText, title: 'News Summarizer', desc: 'Get latest AI news', color: 'from-purple-500/20 to-pink-500/20' },
    { icon: ImageIcon, title: 'Screenshot to Code', desc: 'Convert UI to HTML/CSS', color: 'from-yellow-500/20 to-orange-500/20' },
    { icon: Sparkles, title: 'Image Enhancer', desc: 'Upscale image quality', color: 'from-green-500/20 to-teal-500/20' },
  ];

  const handleWebReader = async () => {
    if (!url.trim()) {
      toast({ title: 'Error', description: 'Please enter a URL', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('google-search', {
        body: { query: `summarize content from ${url}` }
      });

      if (error) throw error;
      setResult(JSON.stringify(data, null, 2));
      toast({ title: 'Success', description: 'Webpage analyzed' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleNews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('google-search', {
        body: { query: 'latest AI news today' }
      });

      if (error) throw error;
      setResult(JSON.stringify(data, null, 2));
      toast({ title: 'Success', description: 'Latest news fetched' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full">
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border h-14 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            {isMobile && <SidebarTrigger />}
            <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
            <span className="font-semibold">Web Integration Tools</span>
          </div>
        </div>

        <AppSidebar />

        <div className="flex-1 pt-14 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">AI-Powered Web Tools</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tools.map((tool, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`glass hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br ${tool.color}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <tool.icon className="w-6 h-6" />
                        {tool.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{tool.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card className="glass">
              <CardHeader>
                <CardTitle>Try Web Reader</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter webpage URL..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button onClick={handleWebReader} disabled={loading} className="flex-1">
                    {loading ? 'Analyzing...' : 'Summarize Page'}
                  </Button>
                  <Button onClick={handleNews} disabled={loading} variant="outline">
                    Get AI News
                  </Button>
                </div>
                {result && (
                  <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-64">
                    {result}
                  </pre>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default WebTools;
