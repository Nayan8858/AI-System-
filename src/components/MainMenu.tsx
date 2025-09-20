import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, Settings, Home, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const MainMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <div className="flex flex-col space-y-4 mt-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Navigation</h2>
            
            <Button
              variant="ghost"
              className="justify-start h-12"
              onClick={() => handleNavigate("/")}
            >
              <Home className="mr-3 h-5 w-5" />
              Landing Page
            </Button>

            {user && (
              <Button
                variant="ghost"
                className="justify-start h-12"
                onClick={() => handleNavigate("/home")}
              >
                <MessageSquare className="mr-3 h-5 w-5" />
                Chat Home
              </Button>
            )}

            {user && (
              <Button
                variant="ghost"
                className="justify-start h-12"
                onClick={() => handleNavigate("/user-profile")}
              >
                <User className="mr-3 h-5 w-5" />
                Profile Management
              </Button>
            )}

            <Button
              variant="ghost"
              className="justify-start h-12"
              onClick={() => handleNavigate("/settings")}
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MainMenu;