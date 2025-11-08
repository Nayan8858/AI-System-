import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import aiRobotImage from "@/assets/ai-robot-illustration.png";
import { ExampleIdeasModal } from "./ExampleIdeasModal";
import { ImageIcon, Code, FileText } from "lucide-react";

const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'image' | 'code' | 'text'>('image');

  const handleGetStarted = () => {
    if (user) {
      navigate('/home');
    }
  };

  const handleOpenModal = (type: 'image' | 'code' | 'text') => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleSelectIdea = (idea: string) => {
    if (user) {
      navigate('/home', { state: { initialMessage: idea } });
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center bg-background pt-20 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] font-inter">
                Your AI
                <br />
                Assistant for
                <br />
                <span className="text-primary">Everything</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                Chat, research, create, and code with NayandeepGPT. Your intelligent companion for all tasks.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {user ? (
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-medium rounded-xl w-fit"
                  onClick={handleGetStarted}
                >
                  Get Started
                </Button>
              ) : (
                <SignUpButton mode="modal" fallbackRedirectUrl="/home">
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-medium rounded-xl w-fit"
                  >
                    Get Started
                  </Button>
                </SignUpButton>
              )}
              
              {/* Quick Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-secondary hover:border-border transition-all rounded-xl py-5 border-border shadow-sm"
                  onClick={() => handleOpenModal('image')}
                >
                  <ImageIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Create Image</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-secondary hover:border-border transition-all rounded-xl py-5 border-border shadow-sm"
                  onClick={() => handleOpenModal('code')}
                >
                  <Code className="w-5 h-5" />
                  <span className="text-sm font-medium">Generate Code</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-secondary hover:border-border transition-all rounded-xl py-5 border-border shadow-sm"
                  onClick={() => handleOpenModal('text')}
                >
                  <FileText className="w-5 h-5" />
                  <span className="text-sm font-medium">Summarize Text</span>
                </Button>
              </div>
            </div>

            <ExampleIdeasModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              type={modalType}
              onSelectIdea={handleSelectIdea}
            />
          </div>

          {/* Right content - Robot illustration */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg">
              <img
                src={aiRobotImage}
                alt="AI Robot Assistant"
                className="w-full h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;