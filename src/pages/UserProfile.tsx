import { UserProfile as ClerkUserProfile } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RewardSystem } from "@/components/RewardSystem";
import { Card } from "@/components/ui/card";
import { getMemory } from "@/utils/memorySystem";

const UserProfile = () => {
  const navigate = useNavigate();
  const memory = getMemory();

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
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Memory Summary */}
          <Card className="glass p-6">
            <h3 className="text-lg font-semibold mb-4">Activity Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{Math.floor((Date.now() - new Date(memory.lastActivity).getTime()) / (1000 * 60 * 60 * 24))}d</p>
                <p className="text-sm text-muted-foreground">Last Active</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{memory.projectsCount}</p>
                <p className="text-sm text-muted-foreground">Projects</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{memory.conversationsSummary.length}</p>
                <p className="text-sm text-muted-foreground">Conversations</p>
              </div>
            </div>
          </Card>

          {/* Clerk Profile */}
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

          {/* Rewards Section */}
          <RewardSystem />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;