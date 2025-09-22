import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from './useSubscription';
import { toast } from './use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const useEnhancedChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { canPerformAction, currentPlan } = useSubscription();

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
    if (!message.trim()) return;

    // Check if user can send messages based on their plan
    if (!canPerformAction('free')) {
      toast({
        title: "Access Denied",
        description: "Please sign in to use the chat feature.",
        variant: "destructive",
      });
      return;
    }

    // Check message limits for non-premium users
    if (currentPlan && currentPlan.features.chatHistory !== -1 && messages.length >= currentPlan.features.chatHistory) {
      toast({
        title: "Message Limit Reached",
        description: `You've reached your ${currentPlan.features.chatHistory} message limit. Please upgrade to continue chatting.`,
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: generateMessageId(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsGenerating(true);

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const { data, error } = await supabase.functions.invoke('chat-gemini', {
        body: {
          message,
          conversation: messages.map(m => ({ role: m.role, content: m.content }))
        }
      });

      if (error) throw error;

      // Check if generation was stopped
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      // Typewriter effect for AI response
      const fullResponse = data.reply;
      let currentText = '';
      
      for (let i = 0; i < fullResponse.length; i++) {
        // Check if generation was stopped
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }
        
        currentText += fullResponse[i];
        setTypingMessage(currentText);
        
        // Add delay for typing effect
        await new Promise(resolve => setTimeout(resolve, 30));
      }
      
      // After typing is complete, add to messages and clear typing
      const assistantMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: fullResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setTypingMessage('');
    } catch (error) {
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }
      
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

  const regenerateMessage = async (messageId: string) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1 || messageIndex === 0) return;

    const previousUserMessage = messages[messageIndex - 1];
    if (previousUserMessage.role !== 'user') return;

    // Remove the message to regenerate and all messages after it
    setMessages(prev => prev.slice(0, messageIndex));
    
    // Send the previous user message again
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
    stopGeneration();
  };

  return {
    messages,
    isLoading,
    typingMessage,
    isGenerating,
    sendMessage,
    stopGeneration,
    regenerateMessage,
    copyMessage,
    clearChat,
  };
};