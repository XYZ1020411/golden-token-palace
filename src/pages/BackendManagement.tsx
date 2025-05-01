
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useAdmin } from "@/context/AdminContext";
import { useVip } from "@/context/VipContext";
import { useProduct } from "@/context/ProductContext";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarInset
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { 
  LayoutDashboard, 
  Users, 
  Bell, 
  Database, 
  ArrowLeft, 
  Thermometer, 
  Settings, 
  Gift,
  ScanBarcode,
  Target,
  Balloon,
  Star
} from "lucide-react";

import { BackendStatsSection } from "@/components/backend/BackendStatsSection";
import { BackendUserManagement } from "@/components/backend/BackendUserManagement";
import { BackendAnnouncementSection } from "@/components/backend/BackendAnnouncementSection";
import { BackendAiSettings } from "@/components/backend/BackendAiSettings";
import { BackendSystemSettings } from "@/components/backend/BackendSystemSettings";
import { RedemptionCodeManagement } from "@/components/backend/RedemptionCodeManagement";
import { WishPoolManagement } from "@/components/backend/WishPoolManagement";
import { GameManagement } from "@/components/backend/GameManagement";

const BackendManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const { 
    users, 
    announcements, 
    supportMessages,
    currentTemperature,
  } = useAdmin();
  
  const { dailyUsageCode, lastCodeUpdateTime } = useProduct();
  
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  const handleReturn = () => {
    navigate("/dashboard");
  };

  const sections = [
    { id: "dashboard", label: "儀表板", icon: LayoutDashboard },
    { id: "users", label: "用戶管理", icon: Users },
    { id: "announcements", label: "系統公告", icon: Bell },
    { id: "redemption-codes", label: "兌換碼管理", icon: ScanBarcode },
    { id: "wish-pool", label: "許願池管理", icon: Star },
    { id: "games", label: "遊戲管理", icon: Target },
    { id: "ai-settings", label: "AI設置", icon: Settings },
    { id: "system", label: "系統設置", icon: Database }
  ];
  
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Sidebar>
          <SidebarContent>
            <div className="flex h-14 items-center border-b px-4">
              <h2 className="text-lg font-semibold">後台管理系統</h2>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <SidebarMenu>
                {sections.map((section) => (
                  <SidebarMenuItem key={section.id}>
                    <SidebarMenuButton 
                      onClick={() => setActiveSection(section.id)}
                      isActive={activeSection === section.id}
                      tooltip={section.label}
                    >
                      <section.icon className="mr-2 h-4 w-4" />
                      <span>{section.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </div>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-blue-500" />
              <span className="text-sm">{currentTemperature}</span>
            </div>
            <div className="mt-4 flex gap-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-1 w-full" 
                onClick={handleReturn}
              >
                <ArrowLeft className="h-4 w-4" />
                返回儀表板
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset>
          <div className="flex-1 overflow-auto p-6 pt-0">
            <div className="mx-auto max-w-6xl">
              <div className="py-4">
                <h1 className="text-2xl font-bold tracking-tight">
                  {sections.find(s => s.id === activeSection)?.label}
                </h1>
                <p className="text-muted-foreground mt-1">
                  管理系統 {sections.find(s => s.id === activeSection)?.label}
                </p>
              </div>
              
              {activeSection === "dashboard" && (
                <BackendStatsSection 
                  users={users} 
                  announcements={announcements} 
                  supportMessages={supportMessages}
                />
              )}
              
              {activeSection === "users" && (
                <BackendUserManagement />
              )}
              
              {activeSection === "announcements" && (
                <BackendAnnouncementSection />
              )}
              
              {activeSection === "redemption-codes" && (
                <RedemptionCodeManagement />
              )}
              
              {activeSection === "wish-pool" && (
                <WishPoolManagement />
              )}
              
              {activeSection === "games" && (
                <GameManagement />
              )}
              
              {activeSection === "ai-settings" && (
                <BackendAiSettings />
              )}
              
              {activeSection === "system" && (
                <BackendSystemSettings />
              )}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default BackendManagement;
