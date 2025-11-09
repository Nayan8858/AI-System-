import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface VoiceAssistantProps {
  onTranscript: (text: string) => void;
}

export const VoiceAssistant = ({ onTranscript }: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast.error('Voice recognition is not supported in your browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      
      if (event.results[event.results.length - 1].isFinal) {
        onTranscript(transcript);
        setIsListening(false);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        toast.error('Microphone access denied. Please allow microphone permission.');
        setHasPermission(false);
      } else {
        toast.error('Voice recognition error. Please try again.');
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript]);

  const toggleListening = async () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        if (hasPermission === null || hasPermission === false) {
          toast.info('Requesting microphone permission...');
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(track => track.stop());
          setHasPermission(true);
          toast.success('Microphone access granted!');
        }

        recognitionRef.current.start();
        setIsListening(true);
        toast.success('🎤 Listening... Speak now');
      } catch (error) {
        console.error('Microphone permission error:', error);
        toast.error('Please allow microphone access to use voice input');
        setHasPermission(false);
      }
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleListening}
        className={`shrink-0 transition-all ${
          isListening 
            ? 'text-red-500 hover:text-red-600' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title={isListening ? 'Stop listening' : 'Start voice input'}
      >
        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </Button>
      
      {isListening && (
        <div className="absolute -top-2 -left-2 -right-2 -bottom-2 pointer-events-none">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 opacity-30 animate-ping" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 opacity-20 animate-pulse" 
               style={{ animationDelay: '0.2s' }} />
        </div>
      )}
    </div>
  );
};
