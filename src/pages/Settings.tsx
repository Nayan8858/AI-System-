import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  Palette,
  Brain,
  Volume2,
  Shield,
  CreditCard,
  Key,
  Bell,
  Link2,
  LogOut,
  Trash2,
  ChevronRight,
  ArrowLeft,
  Sun,
  Moon,
  Monitor,
  Copy,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { clearMemory } from "@/utils/memorySystem";

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { subscribed, currentPlan } = useSubscription();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoadingApiKey, setIsLoadingApiKey] = useState(false);

  const [settings, setSettings] = useState({
    theme: localStorage.getItem('theme') || 'auto',
    accentColor: localStorage.getItem('accentColor') || '#4F46E5',
    messageAnimation: localStorage.getItem('messageAnimation') !== 'false',
    voiceReply: localStorage.getItem('voiceReply') === 'true',
    voiceInput: localStorage.getItem('voiceInput') === 'true',
    chatMemory: localStorage.getItem('chatMemory') !== 'false',
    notificationSound: localStorage.getItem('notificationSound') === 'true',
    doNotStore: localStorage.getItem('doNotStore') === 'true',
  });

  useEffect(() => {
    if (subscribed && user) {
      fetchApiKey();
    }
  }, [subscribed, user]);

  const fetchApiKey = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('api-key-me');
      if (error) throw error;
      setApiKey(data.apiKey);
    } catch (error) {
      console.error('Error fetching API key:', error);
    }
  };

  const handleGenerateApiKey = async () => {
    setIsLoadingApiKey(true);
    try {
      const { data, error } = await supabase.functions.invoke('api-key-create');
      if (error) throw error;
      setApiKey(data.apiKey);
      toast({ title: "API Key Generated", description: "Your new API key is ready." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate API key.", variant: "destructive" });
    } finally {
      setIsLoadingApiKey(false);
    }
  };

  const handleRegenerateApiKey = async () => {
    setIsLoadingApiKey(true);
    try {
      const { data, error } = await supabase.functions.invoke('api-key-regenerate');
      if (error) throw error;
      setApiKey(data.apiKey);
      toast({ title: "API Key Regenerated", description: "Your old key has been revoked." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to regenerate API key.", variant: "destructive" });
    } finally {
      setIsLoadingApiKey(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    localStorage.setItem(key, String(value));
    toast({ title: "Setting Updated", description: "Your preferences have been saved." });
  };

  const handleClearHistory = () => {
    localStorage.removeItem('chatHistory');
    clearMemory();
    toast({ title: "History Cleared", description: "All chat history has been deleted." });
  };

  const copyApiKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      toast({ title: "Copied!", description: "API key copied to clipboard." });
    }
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'auto', label: 'System', icon: Monitor },
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
              <h1 className="text-xl font-semibold text-foreground">Settings</h1>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto space-y-4">
              <Accordion type="multiple" className="space-y-4">
                {/* Appearance */}
                <AccordionItem value="appearance" className="border rounded-2xl bg-card/50 backdrop-blur-sm px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <Palette className="w-5 h-5 text-purple-500" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Appearance</p>
                        <p className="text-sm text-muted-foreground">Theme, colors, animations</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 space-y-4">
                    {/* Theme Selection */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Theme</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {themeOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => updateSetting('theme', option.value)}
                            className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                              settings.theme === option.value 
                                ? 'border-primary bg-primary/10' 
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <option.icon className="w-5 h-5 mb-1" />
                            <span className="text-xs">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <Label>Message Animations</Label>
                      <Switch
                        checked={settings.messageAnimation}
                        onCheckedChange={(v) => updateSetting('messageAnimation', v)}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* AI Behavior */}
                <AccordionItem value="ai" className="border rounded-2xl bg-card/50 backdrop-blur-sm px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Brain className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">AI Behavior</p>
                        <p className="text-sm text-muted-foreground">Voice, memory, personality</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Voice Reply (TTS)</Label>
                        <p className="text-xs text-muted-foreground">AI speaks responses aloud</p>
                      </div>
                      <Switch
                        checked={settings.voiceReply}
                        onCheckedChange={(v) => updateSetting('voiceReply', v)}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Voice Input (STT)</Label>
                        <p className="text-xs text-muted-foreground">Speak to send messages</p>
                      </div>
                      <Switch
                        checked={settings.voiceInput}
                        onCheckedChange={(v) => updateSetting('voiceInput', v)}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Chat Memory</Label>
                        <p className="text-xs text-muted-foreground">Remember conversation context</p>
                      </div>
                      <Switch
                        checked={settings.chatMemory}
                        onCheckedChange={(v) => updateSetting('chatMemory', v)}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Notifications */}
                <AccordionItem value="notifications" className="border rounded-2xl bg-card/50 backdrop-blur-sm px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Notifications</p>
                        <p className="text-sm text-muted-foreground">Sounds and alerts</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Notification Sounds</Label>
                        <p className="text-xs text-muted-foreground">Play sounds for new messages</p>
                      </div>
                      <Switch
                        checked={settings.notificationSound}
                        onCheckedChange={(v) => updateSetting('notificationSound', v)}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* API Keys */}
                <AccordionItem value="api" className="border rounded-2xl bg-card/50 backdrop-blur-sm px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                        <Key className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">API Keys</p>
                        <p className="text-sm text-muted-foreground">Manage your API access</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 space-y-4">
                    {subscribed ? (
                      <>
                        {apiKey ? (
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-xl">
                              <code className="flex-1 text-sm truncate">
                                {showApiKey ? apiKey : '••••••••••••••••••••'}
                              </code>
                              <Button variant="ghost" size="icon" onClick={() => setShowApiKey(!showApiKey)}>
                                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </Button>
                              <Button variant="ghost" size="icon" onClick={copyApiKey}>
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              className="w-full" 
                              onClick={handleRegenerateApiKey}
                              disabled={isLoadingApiKey}
                            >
                              <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingApiKey ? 'animate-spin' : ''}`} />
                              Regenerate Key
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            className="w-full" 
                            onClick={handleGenerateApiKey}
                            disabled={isLoadingApiKey}
                          >
                            Generate API Key
                          </Button>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Upgrade to a paid plan to access API keys
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* Billing */}
                <AccordionItem value="billing" className="border rounded-2xl bg-card/50 backdrop-blur-sm px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Billing</p>
                        <p className="text-sm text-muted-foreground">Subscription and payments</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 space-y-4">
                    <div className="p-4 rounded-xl bg-muted/30">
                      <p className="text-sm font-medium">Current Plan</p>
                      <p className="text-2xl font-bold text-primary">{currentPlan?.name || 'Free'}</p>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => navigate('/pricing')}
                    >
                      {subscribed ? 'Manage Subscription' : 'Upgrade Plan'}
                    </Button>
                  </AccordionContent>
                </AccordionItem>

                {/* Privacy */}
                <AccordionItem value="privacy" className="border rounded-2xl bg-card/50 backdrop-blur-sm px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-red-500" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Privacy & Data</p>
                        <p className="text-sm text-muted-foreground">Manage your data</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Do Not Store Data</Label>
                        <p className="text-xs text-muted-foreground">Prevent data collection</p>
                      </div>
                      <Switch
                        checked={settings.doNotStore}
                        onCheckedChange={(v) => updateSetting('doNotStore', v)}
                      />
                    </div>

                    <Separator />

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Clear All History
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Clear All History?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete all your chat conversations and memory.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleClearHistory}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </AccordionContent>
                </AccordionItem>

                {/* Connected Accounts */}
                <AccordionItem value="accounts" className="border rounded-2xl bg-card/50 backdrop-blur-sm px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center">
                        <Link2 className="w-5 h-5 text-cyan-500" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Connected Accounts</p>
                        <p className="text-sm text-muted-foreground">Linked services</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 space-y-4">
                    <div className="p-4 rounded-xl bg-muted/30 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{user?.emailAddresses?.[0]?.emailAddress || 'Email'}</p>
                        <p className="text-xs text-muted-foreground">Primary account</p>
                      </div>
                      <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full">Connected</span>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Danger Zone */}
              <Card className="border-destructive/50 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="text-destructive flex items-center space-x-2">
                    <Trash2 className="w-5 h-5" />
                    <span>Danger Zone</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout All Devices
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Account?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. All your data will be permanently deleted.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;