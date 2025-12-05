import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from './useSubscription';
import { toast } from './use-toast';
import { formatTextForDisplay, detectQueryType } from '@/utils/textProcessing';

export type ChatMode = 'normal' | 'reasoning' | 'image-generator' | 'deep-research' | 'web-search';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  image?: string;
  generatedImage?: string;
  searchResults?: any;
}

export const useAdvancedChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>('normal');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageSearchActive, setImageSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const { canPerformAction, currentPlan, isLoading: subscriptionLoading } = useSubscription();

  const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
    setIsLoading(false);
    setTypingMessage('');
  };

  const sendMessage = async (message: string) => {
    console.log('🚀 SendMessage called with:', message);
    if (!message.trim()) return;

    // Debug subscription status
    console.log('📊 Current subscription status:', { 
      canPerform: canPerformAction('free'),
      currentPlan: currentPlan,
      isLoadingSubscription: subscriptionLoading 
    });

    // Check access permissions - Allow if user is authenticated or has free access
    const hasAccess = canPerformAction('free');
    console.log('🔐 Access check result:', hasAccess);
    
    if (!hasAccess) {
      console.log('❌ Access denied, showing toast');
      toast({
        title: "Access Denied",
        description: "Please sign in to use the chat feature.",
        variant: "destructive",
      });
      return;
    }

    console.log('✅ Access granted, proceeding with message send');

    // Handle image search mode
    if (imageSearchActive) {
      await handleImageSearch(message);
      return;
    }

    const userMessage: Message = {
      id: generateMessageId(),
      role: 'user',
      content: message,
      timestamp: new Date(),
      image: uploadedImage || undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsGenerating(true);

    abortControllerRef.current = new AbortController();

    try {
      console.log('📤 Starting API call, mode:', chatMode);
      let response;
      
      if (chatMode === 'image-generator') {
        // Generate image
        console.log('🎨 Calling generate-image function');
        response = await supabase.functions.invoke('generate-image', {
          body: { prompt: message }
        });
        
        console.log('🎨 Generate-image response:', response);
        if (response.error) throw response.error;
        
        const assistantMessage: Message = {
          id: generateMessageId(),
          role: 'assistant',
          content: `I've generated an image based on your prompt: "${message}"`,
          timestamp: new Date(),
          generatedImage: response.data.imageUrl,
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      } else if (chatMode === 'web-search' || chatMode === 'deep-research') {
        // First get web search results
        const searchResponse = await supabase.functions.invoke('web-search', {
          body: { query: message }
        });
        
        if (searchResponse.error) throw searchResponse.error;
        
        // Then get AI response with search context
        response = await supabase.functions.invoke('chat-openai', {
          body: {
            message: `Based on this search query: "${message}", here are the search results: ${JSON.stringify(searchResponse.data.results)}. Please provide a comprehensive answer using this information and cite your sources.`,
            conversation: messages.map(m => ({ role: m.role, content: m.content })),
            mode: chatMode,
            imageData: uploadedImage
          }
        });
        
        if (response.error) throw response.error;
        
        const assistantMessage: Message = {
          id: generateMessageId(),
          role: 'assistant',
          content: response.data.reply,
          timestamp: new Date(),
          searchResults: searchResponse.data.results,
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Regular chat or reasoning mode
        console.log('💬 Calling chat-openai function');
        response = await supabase.functions.invoke('chat-openai', {
          body: {
            message,
            conversation: messages.map(m => ({ role: m.role, content: m.content })),
            mode: chatMode,
            imageData: uploadedImage
          }
        });
        
        console.log('💬 Chat-openai response:', response);
        if (response.error) throw response.error;

        // Typewriter effect - 5x faster (6ms instead of 30ms)
        const fullResponse = response.data.reply;
        let currentText = '';
        
        for (let i = 0; i < fullResponse.length; i++) {
          if (abortControllerRef.current?.signal.aborted) return;
          
          currentText += fullResponse[i];
          setTypingMessage(currentText);
          await new Promise(resolve => setTimeout(resolve, 6));
        }
        
        const assistantMessage: Message = {
          id: generateMessageId(),
          role: 'assistant',
          content: fullResponse,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
        setTypingMessage('');
      }
      
      // Reset mode if it's reasoning (one-time use)
      if (chatMode === 'reasoning') {
        setChatMode('normal');
      }
      
      // Clear uploaded image after sending
      setUploadedImage(null);
      
    } catch (error) {
      if (abortControllerRef.current?.signal.aborted) return;
      
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleImageSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await supabase.functions.invoke('search-images', {
        body: { query, per_page: 8 }
      });
      
      if (response.error) throw response.error;
      
      setSearchResults(response.data.photos || []);
      
      // Add search results as a message
      const searchMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: `Found ${response.data.photos?.length || 0} images for "${query}"`,
        timestamp: new Date(),
        searchResults: response.data.photos || [],
      };
      
      setMessages(prev => [...prev, searchMessage]);
    } catch (error) {
      console.error('Image search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search for images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const uploadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
    };
    reader.readAsDataURL(file);
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
  };

  const downloadImage = async (url: string, quality: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `image_${quality}_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(downloadUrl);
      
      toast({
        title: "Downloaded",
        description: `Image downloaded in ${quality} quality`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download image",
        variant: "destructive",
      });
    }
  };

  const regenerateMessage = async (messageId: string) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1 || messageIndex === 0) return;

    const previousUserMessage = messages[messageIndex - 1];
    if (previousUserMessage.role !== 'user') return;

    setMessages(prev => prev.slice(0, messageIndex));
    await sendMessage(previousUserMessage.content);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
      });
    }).catch(() => {
      toast({
        title: "Copy Failed",
        description: "Failed to copy message to clipboard",
        variant: "destructive",
      });
    });
  };

  const clearChat = () => {
    setMessages([]);
    setTypingMessage('');
    setUploadedImage(null);
    setImageSearchActive(false);
    setSearchResults([]);
    setChatMode('normal');
    stopGeneration();
  };

  return {
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
    clearChat,
  };
};