import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import { OnboardingManager } from "@/components/onboarding/OnboardingManager";
import Index from "./pages/Index";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import Pricing from "./pages/Pricing";
import PaymentStatus from "./pages/PaymentStatus";
import Library from "./pages/Library";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Projects from "./pages/Projects";
import WebTools from "./pages/WebTools";
import Plugins from "./pages/Plugins";
import AIAnalytics from "./pages/AIAnalytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const PUBLISHABLE_KEY = "pk_test_ZGVhci1zd2FuLTY4LmNsZXJrLmFjY291bnRzLmRldiQ";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const App = () => (
  <ClerkProvider 
    publishableKey={PUBLISHABLE_KEY}
    afterSignInUrl="/home"
    afterSignUpUrl="/home"
    appearance={{
      baseTheme: undefined,
      variables: {
        colorPrimary: "hsl(217 91% 60%)",
      }
    }}
  >
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public landing page */}
            <Route path="/" element={<Index />} />
            <Route path="/pricing" element={<Pricing />} />
            
            {/* Protected routes with onboarding */}
            <Route path="/home" element={
              <OnboardingManager>
                <Home />
              </OnboardingManager>
            } />
            <Route path="/user-profile" element={
              <OnboardingManager>
                <UserProfile />
              </OnboardingManager>
            } />
            <Route path="/payment-status" element={<PaymentStatus />} />
            <Route path="/library" element={
              <OnboardingManager>
                <Library />
              </OnboardingManager>
            } />
            <Route path="/history" element={
              <OnboardingManager>
                <History />
              </OnboardingManager>
            } />
            <Route path="/settings" element={
              <OnboardingManager>
                <Settings />
              </OnboardingManager>
            } />
            <Route path="/projects" element={
              <OnboardingManager>
                <Projects />
              </OnboardingManager>
            } />
            <Route path="/web-tools" element={
              <OnboardingManager>
                <WebTools />
              </OnboardingManager>
            } />
            <Route path="/plugins" element={
              <OnboardingManager>
                <Plugins />
              </OnboardingManager>
            } />
            <Route path="/ai-analytics" element={
              <OnboardingManager>
                <AIAnalytics />
              </OnboardingManager>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;
