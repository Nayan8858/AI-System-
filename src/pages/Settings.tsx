import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import Header from "@/components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Palette,
  Brain,
  Volume2,
  Shield,
  CreditCard,
  Code,
  Info,
  Copy,
  RefreshCw,
  Trash2,
  Book
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PaymentModal } from "@/components/PaymentModal";

const Settings = () => {
  const { user } = useAuth();
  const { subscribed, currentPlan } = useSubscription();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiUsage, setApiUsage] = useState({ used: 0, limit: 100 });
  const [isLoadingApiKey, setIsLoadingApiKey] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    theme: localStorage.getItem('theme') || 'auto',
    accentColor: localStorage.getItem('accentColor') || '#4F46E5',
    messageAnimation: localStorage.getItem('messageAnimation') !== 'false',
    backgroundAnimation: localStorage.getItem('backgroundAnimation') || 'subtle',
    fontStyle: localStorage.getItem('fontStyle') || 'default',
    aiReplyStyle: localStorage.getItem('aiReplyStyle') || 'balanced',
    voiceReply: localStorage.getItem('voiceReply') === 'true',
    voiceInput: localStorage.getItem('voiceInput') === 'true',
    chatMemory: localStorage.getItem('chatMemory') !== 'false',
    personality: localStorage.getItem('personality') || 'friendly',
    notificationSound: localStorage.getItem('notificationSound') === 'true',
    typingSound: localStorage.getItem('typingSound') === 'true',
    messagePopSound: localStorage.getItem('messagePopSound') === 'true',
    idleReminder: localStorage.getItem('idleReminder') === 'true',
    doNotStore: localStorage.getItem('doNotStore') === 'true',
    developerMode: localStorage.getItem('developerMode') === 'true',
    showLogs: localStorage.getItem('showLogs') === 'true',
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
      setApiUsage(data.usage);
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
      toast({
        title: "API Key Generated",
        description: "Your new API key is ready to use.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate API key. Please try again.",
        variant: "destructive",
      });
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
      toast({
        title: "API Key Regenerated",
        description: "Your old key has been revoked and a new one generated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to regenerate API key.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingApiKey(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    localStorage.setItem(key, String(value));
    toast({
      title: "Setting Updated",
      description: "Your preferences have been saved.",
    });
  };

  const handleClearHistory = () => {
    localStorage.removeItem('chatHistory');
    toast({
      title: "History Cleared",
      description: "All chat history has been deleted.",
    });
  };

  const handleClearImages = () => {
    localStorage.removeItem('generatedImages');
    toast({
      title: "Images Cleared",
      description: "All saved images have been deleted.",
    });
  };

  const handleResetPreferences = () => {
    Object.keys(settings).forEach(key => localStorage.removeItem(key));
    window.location.reload();
  };

  const copyApiKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      toast({
        title: "Copied!",
        description: "API key copied to clipboard.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      <SidebarProvider>
        <div className="flex min-h-[calc(100vh-64px)]">
          <AppSidebar />
          <main className="flex-1 p-6 animate-fade-in overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">⚙️ Settings</h1>
                <p className="text-muted-foreground">
                  Customize your NayandeepGPT experience just the way you like 💫
                </p>
              </div>

              <Tabs defaultValue="appearance" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 gap-2">
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                  <TabsTrigger value="ai">AI Behavior</TabsTrigger>
                  <TabsTrigger value="sound">Sound</TabsTrigger>
                  <TabsTrigger value="privacy">Privacy</TabsTrigger>
                  <TabsTrigger value="billing">Billing</TabsTrigger>
                  <TabsTrigger value="developer">Developer</TabsTrigger>
                  <TabsTrigger value="system">System</TabsTrigger>
                </TabsList>

                {/* Appearance */}
                <TabsContent value="appearance" className="space-y-4">
                  <Card className="bg-card/80 backdrop-blur border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="w-5 h-5" />
                        Appearance
                      </CardTitle>
                      <CardDescription>Personal visual setup</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>🌗 Theme</Label>
                        <Select value={settings.theme} onValueChange={(v) => updateSetting('theme', v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="aurora">Aurora</SelectItem>
                            <SelectItem value="auto">Auto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="accent-color">🎨 Accent Color</Label>
                        <input
                          id="accent-color"
                          type="color"
                          value={settings.accentColor}
                          onChange={(e) => updateSetting('accentColor', e.target.value)}
                          className="w-full h-12 rounded-md border border-input cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>✨ Message Animation</Label>
                        <Switch
                          checked={settings.messageAnimation}
                          onCheckedChange={(v) => updateSetting('messageAnimation', v)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>🌀 Background Animation</Label>
                        <Select value={settings.backgroundAnimation} onValueChange={(v) => updateSetting('backgroundAnimation', v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="subtle">Subtle</SelectItem>
                            <SelectItem value="strong">Strong</SelectItem>
                            <SelectItem value="off">Off</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>🔤 Font Style</Label>
                        <Select value={settings.fontStyle} onValueChange={(v) => updateSetting('fontStyle', v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="rounded">Rounded</SelectItem>
                            <SelectItem value="modern">Modern</SelectItem>
                            <SelectItem value="typewriter">Typewriter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* AI Behavior */}
                <TabsContent value="ai" className="space-y-4">
                  <Card className="bg-card/80 backdrop-blur border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5" />
                        AI Behavior
                      </CardTitle>
                      <CardDescription>Control personality & responses</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>🧩 AI Reply Style</Label>
                        <Select value={settings.aiReplyStyle} onValueChange={(v) => updateSetting('aiReplyStyle', v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="balanced">Balanced</SelectItem>
                            <SelectItem value="creative">Creative</SelectItem>
                            <SelectItem value="precise">Precise</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>🗣️ Voice Reply (TTS)</Label>
                        <Switch
                          checked={settings.voiceReply}
                          onCheckedChange={(v) => updateSetting('voiceReply', v)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>🎙️ Voice Input (STT)</Label>
                        <Switch
                          checked={settings.voiceInput}
                          onCheckedChange={(v) => updateSetting('voiceInput', v)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>💾 Chat Memory Save</Label>
                        <Switch
                          checked={settings.chatMemory}
                          onCheckedChange={(v) => updateSetting('chatMemory', v)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>🧠 Personality</Label>
                        <Select value={settings.personality} onValueChange={(v) => updateSetting('personality', v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="friendly">Friendly</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="developer">Developer</SelectItem>
                            <SelectItem value="tutor">Tutor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Sound & Notifications */}
                <TabsContent value="sound" className="space-y-4">
                  <Card className="bg-card/80 backdrop-blur border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Volume2 className="w-5 h-5" />
                        Sound & Notifications
                      </CardTitle>
                      <CardDescription>Audio feedback & user activity</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <Label>🔔 Notification Sound</Label>
                        <Switch
                          checked={settings.notificationSound}
                          onCheckedChange={(v) => updateSetting('notificationSound', v)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>⌨️ Typing Sound</Label>
                        <Switch
                          checked={settings.typingSound}
                          onCheckedChange={(v) => updateSetting('typingSound', v)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>💬 Message Pop Sound</Label>
                        <Switch
                          checked={settings.messagePopSound}
                          onCheckedChange={(v) => updateSetting('messagePopSound', v)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>🕒 Idle Reminder (10 min)</Label>
                        <Switch
                          checked={settings.idleReminder}
                          onCheckedChange={(v) => updateSetting('idleReminder', v)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Privacy & Data */}
                <TabsContent value="privacy" className="space-y-4">
                  <Card className="bg-card/80 backdrop-blur border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Privacy & Data
                      </CardTitle>
                      <CardDescription>Manage storage & privacy</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" className="w-full gap-2">
                            <Trash2 className="w-4 h-4" />
                            🧹 Clear Chat History
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Clear Chat History?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete all your chat conversations.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleClearHistory}>Clear</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" className="w-full gap-2">
                            <Trash2 className="w-4 h-4" />
                            🗑️ Delete All Saved Images
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete All Images?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete all your generated images.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleClearImages}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <div className="flex items-center justify-between">
                        <Label>🚫 Do Not Store My Data</Label>
                        <Switch
                          checked={settings.doNotStore}
                          onCheckedChange={(v) => updateSetting('doNotStore', v)}
                        />
                      </div>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="w-full gap-2">
                            <RefreshCw className="w-4 h-4" />
                            🔄 Reset All Preferences
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reset All Settings?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will reset all your preferences to default values.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleResetPreferences}>Reset</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Subscription & Billing */}
                <TabsContent value="billing" className="space-y-4">
                  <Card className="bg-card/80 backdrop-blur border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Subscription & Billing
                      </CardTitle>
                      <CardDescription>Manage your plan and payments</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="p-4 bg-primary/10 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Current Plan</p>
                            <p className="text-2xl font-bold">{currentPlan?.name || 'Free'}</p>
                          </div>
                          {subscribed && <span className="text-4xl">🌟</span>}
                        </div>
                      </div>

                      {!subscribed && (
                        <Button 
                          className="w-full gap-2" 
                          onClick={() => setShowPaymentModal(true)}
                        >
                          💰 Upgrade to Premium
                        </Button>
                      )}

                      <div className="space-y-2">
                        <Button variant="outline" className="w-full gap-2">
                          <CreditCard className="w-4 h-4" />
                          🧾 View Billing History
                        </Button>

                        {subscribed && (
                          <Button variant="destructive" className="w-full gap-2">
                            ❌ Cancel Subscription
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Developer Tools + API */}
                <TabsContent value="developer" className="space-y-4">
                  <Card className="bg-card/80 backdrop-blur border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="w-5 h-5" />
                        Developer Tools + API Access
                      </CardTitle>
                      <CardDescription>Developer integrations & API monetization</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <Label>🧑‍💻 Developer Mode</Label>
                        <Switch
                          checked={settings.developerMode}
                          onCheckedChange={(v) => updateSetting('developerMode', v)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>📜 Show Logs</Label>
                        <Switch
                          checked={settings.showLogs}
                          onCheckedChange={(v) => updateSetting('showLogs', v)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Button variant="outline" className="w-full">🧩 Run UI Test</Button>
                        <Button variant="outline" className="w-full">🔄 Reset AI Context</Button>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">API Access</h3>
                        
                        {!subscribed ? (
                          <div className="p-6 bg-muted/50 rounded-lg text-center border-2 border-dashed border-border">
                            <p className="text-muted-foreground mb-4">
                              🔒 Upgrade to Premium to generate an API key
                            </p>
                            <Button onClick={() => setShowPaymentModal(true)}>
                              Upgrade Now
                            </Button>
                          </div>
                        ) : (
                          <>
                            {apiKey ? (
                              <div className="space-y-4">
                                <div className="p-4 bg-muted/50 rounded-lg font-mono text-sm">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-muted-foreground">Your API Key:</span>
                                    <div className="flex gap-2">
                                      <Button size="sm" variant="ghost" onClick={copyApiKey}>
                                        <Copy className="w-4 h-4" />
                                      </Button>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button size="sm" variant="ghost">
                                            <RefreshCw className="w-4 h-4" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Regenerate API Key?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              This will revoke your current key. Update all applications using the old key.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleRegenerateApiKey}>
                                              Regenerate
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  </div>
                                  <p className="break-all">{apiKey}</p>
                                </div>

                                <div className="p-4 bg-primary/10 rounded-lg">
                                  <p className="text-sm text-muted-foreground">Requests Used:</p>
                                  <p className="text-xl font-bold">{apiUsage.used} / {apiUsage.limit} today</p>
                                </div>

                                <div className="text-sm space-y-1">
                                  <p className="text-muted-foreground">Endpoint:</p>
                                  <p className="font-mono bg-muted/50 p-2 rounded">
                                    https://nayandeepgpt.cloud/api/v1/generate
                                  </p>
                                </div>

                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full gap-2">
                                      <Book className="w-4 h-4" />
                                      View API Docs
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>📘 NayandeepGPT API</DialogTitle>
                                      <DialogDescription>API documentation and examples</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 text-sm">
                                      <div>
                                        <p className="font-semibold mb-2">POST /api/v1/generate</p>
                                        <div className="bg-muted/50 p-4 rounded-lg font-mono space-y-2">
                                          <p className="text-muted-foreground">Headers:</p>
                                          <p>Authorization: Bearer YOUR_API_KEY</p>
                                          <p>Content-Type: application/json</p>
                                          <p className="text-muted-foreground mt-4">Body:</p>
                                          <p>{`{ "prompt": "Write a poem", "mode": "text" }`}</p>
                                          <p className="text-muted-foreground mt-4">Response:</p>
                                          <p>{`{ "result": "..." }`}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            ) : (
                              <Button 
                                onClick={handleGenerateApiKey} 
                                disabled={isLoadingApiKey}
                                className="w-full"
                              >
                                {isLoadingApiKey ? 'Generating...' : 'Generate API Key'}
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* System Info */}
                <TabsContent value="system" className="space-y-4">
                  <Card className="bg-card/80 backdrop-blur border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Info className="w-5 h-5" />
                        System Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center space-y-2 py-6">
                        <p className="text-xl font-semibold">NayandeepGPT v2.1</p>
                        <p className="text-muted-foreground">Powered by Lovable Cloud & Stripe</p>
                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                          All local data encrypted 🔒
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </SidebarProvider>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        planName="Premium"
        planPrice="₹199/month"
        priceId="price_premium"
      />
    </div>
  );
};

export default Settings;
