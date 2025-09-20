import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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
  Crown
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const Home = () => {
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const { messages, isLoading, sendMessage } = useChat();
  const isMobile = useIsMobile();

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
    if (!message.trim()) return;
    await sendMessage(message);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
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
          
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs px-3 flex items-center space-x-1">
            <Crown className="w-3 h-3" />
            <span>Upgrade Now</span>
          </Button>
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
                    <Card 
                      key={index}
                      className="p-6 hover:shadow-md transition-shadow cursor-pointer border border-border bg-card"
                      onClick={() => setMessage(card.description)}
                    >
                      <div className="flex flex-col items-center space-y-3 text-center">
                        <div className="p-3 rounded-lg bg-muted">
                          <card.icon className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <h3 className="font-medium text-card-foreground">{card.title}</h3>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-lg ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-muted-foreground p-4 rounded-lg">
                      <p>Thinking...</p>
                    </div>
                  </div>
                )}
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
                    disabled={!message.trim() || isLoading}
                    onClick={handleSendMessage}
                  >
                    <Send className="w-4 h-4" />
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
    </SidebarProvider>
  );
};

export default Home;