import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-gemini', {
        body: {
          message,
          conversation: messages.map(m => ({ role: m.role, content: m.content }))
        }
      });

      if (error) throw error;

      // Typewriter effect for AI response
      const fullResponse = data.reply;
      let currentText = '';
      
      for (let i = 0; i < fullResponse.length; i++) {
        currentText += fullResponse[i];
        setTypingMessage(currentText);
        
        // Add delay for typing effect
        await new Promise(resolve => setTimeout(resolve, 30));
      }
      
      // After typing is complete, add to messages and clear typing
      const assistantMessage: Message = {
        role: 'assistant',
        content: fullResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setTypingMessage('');
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setTypingMessage('');
  };

  return {
    messages,
    isLoading,
    typingMessage,
    sendMessage,
    clearChat,
  };
};