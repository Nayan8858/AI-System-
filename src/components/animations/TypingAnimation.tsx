interface TypingAnimationProps {
  text: string;
}

export const TypingAnimation = ({ text }: TypingAnimationProps) => {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="bg-muted text-muted-foreground p-4 rounded-[20px] max-w-[80%] shadow-lg" 
           style={{ boxShadow: 'var(--message-shadow)' }}>
        <div className="flex items-start">
          <span className="text-2xl mr-3">🤖</span>
          <div className="flex-1">
            <p className="whitespace-pre-wrap">{text}</p>
            <span className="inline-block w-2 h-5 ml-1 animate-typing-blink" 
                  style={{ backgroundColor: 'var(--typing-cursor)' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
