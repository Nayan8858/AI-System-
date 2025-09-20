import { UserProfile as ClerkUserProfile } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <span className="text-lg font-semibold">Profile Management</span>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <ClerkUserProfile
            appearance={{
              baseTheme: undefined,
              variables: {
                colorPrimary: "hsl(217 91% 60%)",
                colorBackground: "hsl(var(--background))",
                colorText: "hsl(var(--foreground))",
                colorInputBackground: "hsl(var(--background))",
                colorInputText: "hsl(var(--foreground))",
              },
              elements: {
                rootBox: "mx-auto",
                card: "shadow-lg border border-border",
              }
            }}
            routing="hash"
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;