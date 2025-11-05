import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, Settings, User, Home, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="NayandeepGPT Logo" 
              className="h-10 w-10 object-contain animate-fade-in"
            />
            <span className="text-2xl font-bold text-primary">NayandeepGPT</span>
          </div>

          {/* Right side - Menu + Auth */}
          <div className="flex items-center gap-4">
            {/* Menu Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card animate-fade-in z-50">
                <DropdownMenuItem onClick={() => navigate("/")} className="cursor-pointer">
                  <Home className="mr-2 h-4 w-4" />
                  Landing Page
                </DropdownMenuItem>
                {user && (
                  <DropdownMenuItem onClick={() => navigate("/home")} className="cursor-pointer">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat Home
                  </DropdownMenuItem>
                )}
                {user && (
                  <DropdownMenuItem onClick={() => navigate("/user-profile")} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile Management
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth buttons */}
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