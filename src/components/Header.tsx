import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";

const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-primary">✦ NayandeepGPT</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Home
            </a>
            <a href="#features" className="text-foreground hover:text-primary transition-colors">
              Features
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              About
            </a>
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <UserButton
                appearance={{
                  baseTheme: undefined,
                  variables: {
                    colorPrimary: "hsl(217 91% 60%)",
                  },
                  elements: {
                    userButtonAvatarBox: "w-10 h-10",
                  }
                }}
                userProfileMode="modal"
                afterSignOutUrl="/"
              />
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost">
                    Login
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button>
                    Sign Up
                  </Button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;