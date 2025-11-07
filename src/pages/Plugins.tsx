import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Cloud, Coins, Calendar, Mail, Zap, Download } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import logo from '@/assets/logo.png';

const Plugins = () => {
  const isMobile = useIsMobile();
  const [plugins, setPlugins] = useState([
    { id: '1', name: 'Weather', icon: Cloud, enabled: false, desc: 'Real-time weather data' },
    { id: '2', name: 'Crypto Tracker', icon: Coins, enabled: false, desc: 'Track cryptocurrency prices' },
    { id: '3', name: 'Calendar', icon: Calendar, enabled: false, desc: 'Schedule and reminders' },
    { id: '4', name: 'Email Writer', icon: Mail, enabled: false, desc: 'AI-powered email composer' },
  ]);

  const togglePlugin = (id: string) => {
    setPlugins(prev => prev.map(p => 
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
    toast({ title: 'Plugin Updated', description: 'Settings saved' });
  };

  const testPlugin = (name: string) => {
    toast({ title: `Testing ${name}`, description: 'Plugin is working!' });
  };

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full">
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border h-14 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            {isMobile && <SidebarTrigger />}
            <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
            <span className="font-semibold">Plugins</span>
          </div>
        </div>

        <AppSidebar />

        <div className="flex-1 pt-14 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Plugin Marketplace</h1>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Install Custom
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plugins.map((plugin, index) => (
                <motion.div
                  key={plugin.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`glass transition-all ${plugin.enabled ? 'border-primary border-2' : ''}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <plugin.icon className="w-6 h-6" />
                          {plugin.name}
                        </div>
                        <Switch
                          checked={plugin.enabled}
                          onCheckedChange={() => togglePlugin(plugin.id)}
                        />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{plugin.desc}</p>
                      {plugin.enabled && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => testPlugin(plugin.name)}
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Test Plugin
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Plugins;
