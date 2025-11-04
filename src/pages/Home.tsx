import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Link, 
  Upload, 
  Search, 
  X, 
  Square, 
  Send,
  Crown,
  Lightbulb,
  Diamond,
  Globe,
  Code
} from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { useAuth } from "@/hooks/useAuth";
import { useAdvancedChat } from "@/hooks/useAdvancedChat";
import ImageUpload from "@/components/ImageUpload";
import ImageSearchResults from "@/components/ImageSearchResults";
import WebSearchResults from "@/components/WebSearchResults";
import ChatModeSelector from "@/components/ChatModeSelector";
import AttachmentMenu from "@/components/AttachmentMenu";
import { useSubscription } from "@/hooks/useSubscription";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import MainMenu from "@/components/MainMenu";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import ContextMenu from "@/components/ui/context-menu-custom";
import { FeatureGate } from "@/components/FeatureGate";
import { formatTextForDisplay, detectQueryType } from "@/utils/textProcessing";
import { SearchAnimation } from "@/components/animations/SearchAnimation";
import { ImageGenAnimation } from "@/components/animations/ImageGenAnimation";
import { TypingAnimation } from "@/components/animations/TypingAnimation";
import { ConfettiEffect } from "@/components/animations/ConfettiEffect";
import { CodeMode } from "@/components/CodeMode";

const Home = () => {
  const [message, setMessage] = useState("");
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    messageId: string;
    content: string;
  } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [codeModeActive, setCodeModeActive] = useState(false);
  const [codeContent, setCodeContent] = useState("");
  const { user } = useAuth();
  const { 
    messages, 
    isLoading, 
    typingMessage, 
    isGenerating,
    chatMode,
    setChatMode,
    uploadedImage,
    imageSearchActive,
    setImageSearchActive,
    searchResults,
    isSearching,
    sendMessage, 
    stopGeneration,
    uploadImage,
    removeUploadedImage,
    downloadImage,
    regenerateMessage,
    copyMessage,
    clearChat 
  } = useAdvancedChat();
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
      
      // Show confetti effect
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      
      // Show success message with plan details
      setTimeout(() => {
        const successMessage = planName && planPrice 
          ? `✅ Premium Unlocked! You have completed your payment of $${planPrice} for ${planName}.`
          : "✅ Premium Unlocked! Welcome to your new plan! Your subscription is now active.";
          
        toast({
          title: "Payment Successful! 🎉",
          description: successMessage,
        });
      }, 500);
    }
  }, []);

  const actionCards = [
    {
      icon: () => <span className="text-2xl">🖼️</span>,
      title: "Create Image",
      description: "Generate images from text descriptions"
    },
    {
      icon: () => <span className="text-2xl">💻</span>,
      title: "Generate Code",
      description: "Write and debug code in multiple languages"
    },
    {
      icon: () => <span className="text-2xl">📄</span>,
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
      // Auto-detect query type and handle code mode
      const queryType = detectQueryType(message);
      
      if (queryType === 'code') {
        // Extract code if present in the message
        const codeMatch = message.match(/```[\s\S]*?```/);
        if (codeMatch) {
          setCodeContent(codeMatch[0].replace(/```\w*\n?/g, ''));
          setCodeModeActive(true);
        }
      }
      
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
      {showConfetti && <ConfettiEffect />}
      {codeModeActive && (
        <CodeMode 
          initialCode={codeContent}
          onClose={() => {
            setCodeModeActive(false);
            setCodeContent('');
          }}
        />
      )}
      
      <div className="h-screen flex w-full" 
           style={{ background: 'var(--chat-gradient)' }}>
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
                <div className="space-y-4 animate-fade-in">
                  <h1 className="text-5xl font-bold text-foreground bg-clip-text">
                    What can I help with?
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Ask NayandeepGPT anything, from creative writing to complex coding problems.
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
                        className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-border bg-card hover:scale-105 rounded-[20px] animate-slide-up"
                        style={{ 
                          animationDelay: `${index * 0.1}s`,
                          boxShadow: 'var(--message-shadow)'
                        }}
                        onClick={() => setMessage(card.description)}
                      >
                        <CardContent className="flex flex-col items-center space-y-3 text-center p-0">
                          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20">
                            <card.icon />
                          </div>
                          <h3 className="font-semibold text-card-foreground">{card.title}</h3>
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
                      className={`max-w-[80%] p-4 rounded-[20px] cursor-pointer transition-all hover:scale-[1.02] ${
                        msg.role === 'user' 
                          ? 'bg-primary text-primary-foreground shadow-lg' 
                          : 'bg-card text-card-foreground shadow-md'
                      }`}
                      style={{ boxShadow: 'var(--message-shadow)' }}
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
                      <div className="flex items-start space-x-2">
                        <span className="text-2xl">
                          {msg.role === 'user' ? '👤' : '🤖'}
                        </span>
                        <div className="flex-1">
                          <p className="whitespace-pre-wrap">
                            {formatTextForDisplay(msg.content)}
                          </p>
                        </div>
                      </div>
                      
                      {/* Show uploaded image */}
                      {msg.image && (
                        <img 
                          src={msg.image} 
                          alt="Uploaded" 
                          className="max-w-48 rounded-xl mt-3 border-2 border-border animate-bounce-in"
                        />
                      )}
                      
                      {/* Show generated image */}
                      {msg.generatedImage && (
                        <div className="mt-3 animate-bounce-in">
                          <img 
                            src={msg.generatedImage} 
                            alt="Generated" 
                            className="max-w-64 rounded-xl border-2 border-border cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = msg.generatedImage!;
                              link.download = `generated-image-${Date.now()}.png`;
                              link.click();
                            }}
                          />
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="mt-2 w-full"
                            onClick={() => regenerateMessage(msg.id || `${index}`)}
                          >
                            Regenerate Image
                          </Button>
                        </div>
                      )}
                      
                      {/* Show web search results */}
                      {msg.searchResults && !Array.isArray(msg.searchResults) && msg.searchResults.sources && (
                        <WebSearchResults results={msg.searchResults} />
                      )}
                      
                      {/* Show image search results */}
                      {msg.searchResults && Array.isArray(msg.searchResults) && msg.searchResults.length > 0 && (
                        <ImageSearchResults 
                          results={msg.searchResults} 
                          onDownload={downloadImage}
                        />
                      )}
                      
                      <p className="text-xs opacity-60 mt-2">
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                
                 {/* Typing Message with enhanced animation */}
                {typingMessage && <TypingAnimation text={formatTextForDisplay(typingMessage)} />}
                
                {/* Loading Animations */}
                {isSearching && !typingMessage && <SearchAnimation />}
                {isLoading && !typingMessage && !isSearching && chatMode === 'image-generator' && (
                  <ImageGenAnimation />
                )}
                {isLoading && !typingMessage && !isSearching && chatMode !== 'image-generator' && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="bg-card text-card-foreground p-4 rounded-[20px] shadow-md">
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                        <span className="text-sm font-medium">
                          AI is thinking...
                        </span>
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
                {/* Uploaded Image Preview */}
                {uploadedImage && (
                  <div className="mb-3">
                    <ImageUpload 
                      onImageUpload={uploadImage}
                      uploadedImage={uploadedImage}
                      onRemoveImage={removeUploadedImage}
                    />
                  </div>
                )}
                
                <div className="flex items-center space-x-2 bg-card border-2 border-border rounded-[20px] p-3 shadow-lg">
                  <AttachmentMenu 
                    onImageUpload={uploadImage}
                    onImageSearchToggle={() => setImageSearchActive(!imageSearchActive)}
                    imageSearchActive={imageSearchActive}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="shrink-0"
                    onClick={() => {
                      setCodeModeActive(true);
                      setCodeContent('');
                    }}
                  >
                    <Code className="w-5 h-5" />
                  </Button>
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      imageSearchActive 
                        ? "Search for images..." 
                        : chatMode === 'image-generator'
                        ? "Describe the image you want to generate..."
                        : "Message NayandeepGPT..."
                    }
                    className="border-0 bg-transparent focus-visible:ring-0 text-foreground"
                    disabled={isLoading || isSearching}
                  />
                  <Button
                    size="icon"
                    className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
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
                
                {/* Current Mode Indicator */}
                {chatMode !== 'normal' && (
                  <div className="mt-2 text-xs text-muted-foreground text-center">
                    Mode: {chatMode.charAt(0).toUpperCase() + chatMode.slice(1).replace('-', ' ')}
                    {chatMode === 'reasoning' && ' (Single use)'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Chat Modes */}
        <div className="w-16 bg-sidebar border-l border-sidebar-border flex flex-col items-center py-20 mr-2">
          <ChatModeSelector 
            currentMode={chatMode}
            onModeChange={setChatMode}
          />
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