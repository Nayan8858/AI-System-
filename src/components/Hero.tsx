import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import aiRobotImage from "@/assets/ai-robot-illustration.png";

const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/home');
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                Your AI
                <br />
                Assistant for
                <br />
                <span className="text-primary">Everything</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-md">
                Chat, research, create, and code with Nayandeep GPT.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg"
                  onClick={handleGetStarted}
                >
                  Get Started
                </Button>
              ) : (
                <SignUpButton mode="modal" fallbackRedirectUrl="/home">
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg"
                  >
                    Get Started
                  </Button>
                </SignUpButton>
              )}
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg border-border hover:bg-accent"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right content - Robot illustration */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <img
                src={aiRobotImage}
                alt="AI Robot Assistant"
                className="w-full max-w-md lg:max-w-lg object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;