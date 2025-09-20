import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  MessageSquare, 
  BookOpen, 
  Clock, 
  User, 
  Image, 
  Code, 
  FileText,
  Lightbulb,
  Diamond,
  Search,
  Globe,
  Paperclip,
  Send
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Home = () => {
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  const sidebarItems = [
    { icon: MessageSquare, label: "New Chat", active: true },
    { icon: BookOpen, label: "Library" },
    { icon: Clock, label: "History" },
    { icon: User, label: "Profile" },
  ];

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

  return (
    <div className="h-screen bg-background flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-primary text-xl">✦</div>
              <span className="font-semibold text-sidebar-foreground">NayandeepGPT</span>
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs px-3">
              Upgrade Now
            </Button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-2">
          <div className="space-y-1">
            {sidebarItems.map((item, index) => (
              <button
                key={index}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  item.active 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="max-w-2xl w-full text-center space-y-8">
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
                  placeholder="Message Nayandeep GPT..."
                  className="border-0 bg-transparent focus-visible:ring-0 text-foreground"
                />
                <Button
                  size="icon"
                  className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={!message.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-16 bg-sidebar border-l border-sidebar-border flex flex-col items-center py-4 space-y-4">
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
  );
};

export default Home;