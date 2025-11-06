import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Trash2, Clock as ClockIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { toast } from "@/hooks/use-toast";
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

interface ChatSession {
  id: string;
  summary: string;
  timestamp: string;
  messageCount: number;
}

const History = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Load chat history from localStorage
    const loadHistory = () => {
      try {
        const savedHistory = localStorage.getItem('nayandeep_chats');
        if (savedHistory) {
          setSessions(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.error('Error loading history:', error);
        toast({
          title: "Error",
          description: "Failed to load chat history.",
          variant: "destructive",
        });
      }
    };
    
    loadHistory();
    
    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'nayandeep_chats') {
        loadHistory();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleOpenChat = (sessionId: string) => {
    // Load the chat session and navigate to home
    const savedChats = localStorage.getItem(`chat_${sessionId}`);
    if (savedChats) {
      localStorage.setItem('currentChat', savedChats);
      navigate('/home');
      toast({
        title: "Chat Loaded",
        description: "Your conversation has been restored.",
      });
    }
  };

  const handleClearAll = () => {
    setSessions([]);
    localStorage.removeItem('nayandeep_chats');
    // Clear all individual chat sessions
    sessions.forEach(session => {
      localStorage.removeItem(`chat_${session.id}`);
    });
    toast({
      title: "History Cleared",
      description: "All conversations have been deleted.",
    });
  };

  const handleDeleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(updatedSessions);
    localStorage.setItem('nayandeep_chats', JSON.stringify(updatedSessions));
    localStorage.removeItem(`chat_${sessionId}`);
    toast({
      title: "Deleted",
      description: "Conversation removed from history.",
    });
  };

  return (
    <div className="min-h-screen">
      <Header />
      <SidebarProvider>
        <div className="flex min-h-[calc(100vh-64px)] w-full">
          <AppSidebar />
          <main className="flex-1 p-6 animate-fade-in backdrop-blur-sm">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                    💬 Conversation History
                  </h1>
                  <p className="text-muted-foreground">
                    Review and restore your past conversations
                  </p>
                </div>
                {sessions.length > 0 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="gap-2">
                        <Trash2 className="w-4 h-4" />
                        Clear All
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete all your chat history. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearAll}>Delete All</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>

              {sessions.length === 0 ? (
                <Card className="glass p-12 text-center">
                  <ClockIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No history yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start a conversation to build your chat history
                  </p>
                  <Button onClick={() => navigate("/home")} className="gap-2">
                    <MessageSquare className="w-4 h-4" />
                    New Chat
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <Card 
                      key={session.id}
                      className="glass group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <MessageSquare className="w-4 h-4 text-primary" />
                              <p className="font-medium line-clamp-1">{session.summary}</p>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{new Date(session.timestamp).toLocaleString()}</span>
                              <span>{session.messageCount} messages</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleOpenChat(session.id)}
                              className="gap-2"
                            >
                              Open Chat
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteSession(session.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default History;
