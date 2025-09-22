import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Image, 
  Code, 
  FileText,
  Lightbulb,
  Diamond,
  Search,
  Globe,
  Paperclip,
  Send,
  Menu,
  Crown,
  Square
} from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { useAuth } from "@/hooks/useAuth";
import { useEnhancedChat } from "@/hooks/useEnhancedChat";
import { useSubscription } from "@/hooks/useSubscription";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import MainMenu from "@/components/MainMenu";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import ContextMenu from "@/components/ui/context-menu-custom";
import { FeatureGate } from "@/components/FeatureGate";

const Home = () => {
  const [message, setMessage] = useState("");
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    messageId: string;
    content: string;
  } | null>(null);
  const { user } = useAuth();
  const { 
    messages, 
    isLoading, 
    typingMessage, 
    isGenerating,
    sendMessage, 
    stopGeneration,
    regenerateMessage,
    copyMessage,
    clearChat 
  } = useEnhancedChat();
  const { subscribed, currentPlan, isLoading: subscriptionLoading } = useSubscription();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0 || isLoading || typingMessage) {
      scrollToBottom();
    }
  }, [messages, isLoading, typingMessage]);

  // Payment success handling with subscription details
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment');
    const planName = urlParams.get('plan');
    const planPrice = urlParams.get('price');
    
    if (paymentSuccess === 'success') {
      // Clear the URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Show success message with plan details
      setTimeout(() => {
        const successMessage = planName && planPrice 
          ? `You have Done Your Payment $${planPrice} And ${planName}.`
          : "Welcome to your new plan! Your subscription is now active.";
          
        toast({
          title: "Payment Successful! 🎉",
          description: successMessage,
        });
      }, 1000);
    }
  }, []);

  const actionCards = [
    {
      icon: Image,
      title: "Create Image",
      description: "Generate images from text descriptions"
    },
    {
      icon: Code,
      title: "Generate Code",
      description: "Write and debug code in multiple languages"
    },
    {
      icon: FileText,
      title: "Summarize Text",
      description: "Condense long content into key points"
    }
  ];

  const rightSidebarIcons = [
    { icon: Lightbulb, tooltip: "Ideas" },
    { icon: Diamond, tooltip: "Premium" },
    { icon: Search, tooltip: "Search" },
    { icon: Globe, tooltip: "Web" },
  ];

  const handleSendMessage = async () => {
    if (message.trim() && !isLoading) {
      await sendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleContextMenu = (e: React.MouseEvent, messageId: string, content: string) => {
    e.preventDefault();
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
      messageId,
      content,
    });
  };

  const handleSendClick = () => {
    if (isGenerating) {
      stopGeneration();
    } else {
      handleSendMessage();
    }
  };

  return (
    <SidebarProvider>
      <div className="h-screen bg-background flex w-full">
        {/* Top Navigation Bar */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border h-14 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            {isMobile && <SidebarTrigger />}
            <div className="flex items-center space-x-2">
              <div className="text-primary text-xl">✦</div>
              <span className="font-semibold text-foreground">NayandeepGPT</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {!subscribed && !subscriptionLoading && (
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs px-3 flex items-center space-x-1"
                onClick={() => navigate('/pricing')}
              >
                <Crown className="w-3 h-3" />
                <span>Upgrade Now</span>
              </Button>
            )}
            {subscribed && currentPlan && (
              <Button 
                size="sm" 
                variant="outline"
                className="text-xs px-3 flex items-center space-x-1"
                disabled
              >
                <Crown className="w-3 h-3 text-yellow-500" />
                <span>{currentPlan.name}</span>
              </Button>
            )}
            <UserButton
              appearance={{
                baseTheme: undefined,
                variables: {
                  colorPrimary: "hsl(217 91% 60%)",
                },
                elements: {
                  userButtonAvatarBox: "w-8 h-8",
                }
              }}
              userProfileMode="modal"
              afterSignOutUrl="/"
            />
          </div>
        </div>

        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col pt-14">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center space-y-8">
                {/* Main Heading */}
                <div className="space-y-4">
                  <h1 className="text-4xl font-semibold text-foreground">
                    What can I help with?
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Ask Nayandeep GPT anything, from creative writing to complex coding problems.
                  </p>
                </div>

                {/* Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
                  {actionCards.map((card, index) => (
                    <FeatureGate 
                      key={index}
                      requiredPlan={card.title === 'Create Image' ? 'basic' : 'free'}
                      feature={card.title.toLowerCase()}
                      showUpgrade={false}
                    >
                      <Card 
                        className="p-6 hover:shadow-md transition-shadow cursor-pointer border border-border bg-card"
                        onClick={() => setMessage(card.description)}
                      >
                        <CardContent className="flex flex-col items-center space-y-3 text-center p-0">
                          <div className="p-3 rounded-lg bg-muted">
                            <card.icon className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <h3 className="font-medium text-card-foreground">{card.title}</h3>
                        </CardContent>
                      </Card>
                    </FeatureGate>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.map((msg, index) => (
                  <div 
                    key={msg.id || index} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div 
                      className={`max-w-[80%] p-4 rounded-lg cursor-pointer ${
                        msg.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}
                      onContextMenu={(e) => msg.role === 'assistant' && handleContextMenu(e, msg.id || `${index}`, msg.content)}
                      onTouchStart={(e) => {
                        if (msg.role === 'assistant') {
                          const timer = setTimeout(() => {
                            const touch = e.touches[0];
                            handleContextMenu(e as any, msg.id || `${index}`, msg.content);
                          }, 500);
                          
                          const clearTimer = () => clearTimeout(timer);
                          e.currentTarget.addEventListener('touchend', clearTimer, { once: true });
                          e.currentTarget.addEventListener('touchmove', clearTimer, { once: true });
                        }
                      }}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                
                {/* Typing Message */}
                {typingMessage && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="bg-muted text-muted-foreground p-4 rounded-lg max-w-[80%]">
                      <p className="whitespace-pre-wrap">{typingMessage}</p>
                      <span className="inline-block w-2 h-5 bg-muted-foreground animate-pulse ml-1"></span>
                    </div>
                  </div>
                )}
                
                {/* Loading Animation */}
                {isLoading && !typingMessage && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="bg-muted text-muted-foreground p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-6 border-t border-border">
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="flex items-center space-x-2 bg-card border border-border rounded-lg p-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Message Nayandeep GPT..."
                    className="border-0 bg-transparent focus-visible:ring-0 text-foreground"
                    disabled={isLoading}
                  />
                  <Button
                    size="icon"
                    className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={!message.trim() && !isGenerating}
                    onClick={handleSendClick}
                  >
                    {isGenerating ? (
                      <Square className="w-4 h-4" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-16 bg-sidebar border-l border-sidebar-border flex flex-col items-center py-20 space-y-4 mr-2">
          {rightSidebarIcons.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              className="w-10 h-10 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              title={item.tooltip}
            >
              <item.icon className="w-4 h-4" />
            </Button>
          ))}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onCopy={() => copyMessage(contextMenu.content)}
          onRegenerate={() => regenerateMessage(contextMenu.messageId)}
        />
      )}
      
      <MainMenu />
    </SidebarProvider>
  );
};

export default Home;