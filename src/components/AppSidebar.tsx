import { MessageSquare, BookOpen, Clock, User, Settings, Folder, Globe, Puzzle, BarChart3 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const sidebarItems = [
    { icon: MessageSquare, label: "New Chat", path: "/home" },
    { icon: Folder, label: "Projects", path: "/projects" },
    { icon: BookOpen, label: "Library", path: "/library" },
    { icon: Clock, label: "History", path: "/history" },
    { icon: BarChart3, label: "AI Analytics", path: "/ai-analytics" },
    { icon: Globe, label: "Web Tools", path: "/web-tools" },
    { icon: Puzzle, label: "Plugins", path: "/plugins" },
    { icon: User, label: "Profile", path: "/user-profile" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <Sidebar className="border-sidebar-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-300 ${
                      location.pathname === item.path
                        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md scale-105" 
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-102"
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${location.pathname === item.path ? 'animate-pulse' : ''}`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
