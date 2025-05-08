
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useAdmin } from "@/context/AdminContext";
import { BackendStatsSection } from "@/components/backend/BackendStatsSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import {
  ArrowLeft,
  Users,
  FileText,
  MessageSquare,
  Settings,
  ShoppingBag,
  Menu,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Gift
} from "lucide-react";
import { BackendUserManagement } from "@/components/backend/BackendUserManagement";
import { BackendAnnouncementSection } from "@/components/backend/BackendAnnouncementSection";
import { BackendAiSettings } from "@/components/backend/BackendAiSettings";
import { BackendSystemSettings } from "@/components/backend/BackendSystemSettings";
import { RedemptionCodeManagement } from "@/components/backend/RedemptionCodeManagement";
import { WishPoolManagement } from "@/components/backend/WishPoolManagement";
import { GameManagement } from "@/components/backend/GameManagement";
import { UserRole } from "@/context/AuthContext";
import { getAiAssistantResponse } from "@/services/aiAssistant";
import MangaAdmin from "@/components/manga/MangaAdmin";
import { GiftCodeManagement } from "@/components/backend/GiftCodeManagement";
import { useState as useStateMock } from "react"; // Mock for sample data

const BackendManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  // Use admin context
  const {
    users,
    announcements,
    supportMessages,
    addUser,
    deleteUser,
    updateUser,
    addAnnouncement,
    deleteAnnouncement,
    updateAnnouncement,
    respondToSupportMessage,
    markSupportMessageResolved,
    backupData,
    restoreData,
    currentTemperature
  } = useAdmin();

  // Mock novels data for manga admin
  const [mockNovels, setMockNovels] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Load mock data for manga management
    // This would typically come from a real API
    const loadMockData = async () => {
      try {
        const response = await import("@/data/mockNovelsData");
        setMockNovels(response.default);
      } catch (error) {
        console.error("Failed to load mock novels data", error);
      }
    };
    
    loadMockData();
  }, []);

  // Selected tab state
  const [selectedTab, setSelectedTab] = useState("dashboard");

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/login");
    }
  }, [isAuthenticated, navigate, user]);

  if (!isAuthenticated || !user || user.role !== "admin") {
    return null;
  }

  const handleSyncContent = () => {
    setIsSyncing(true);
    // Simulate content synchronization
    setTimeout(() => {
      setIsSyncing(false);
    }, 2000);
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" onClick={() => navigate("/admin")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">後台管理</h1>
          </div>
          <Button variant="outline" size="icon" onClick={toggleSidebar}>
            {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Menu */}
          <div className={`border rounded-lg ${isSidebarCollapsed ? "w-12" : "w-52"} transition-all duration-300`}>
            <div className="p-2">
              <Button
                variant={selectedTab === "dashboard" ? "secondary" : "ghost"}
                className={`w-full justify-start mb-1 ${isSidebarCollapsed ? "px-2" : ""}`}
                onClick={() => setSelectedTab("dashboard")}
              >
                {isSidebarCollapsed ? (
                  <Menu className="h-4 w-4" />
                ) : (
                  <>
                    <Menu className="h-4 w-4 mr-2" />
                    儀表板
                  </>
                )}
              </Button>
              
              <Button
                variant={selectedTab === "users" ? "secondary" : "ghost"}
                className={`w-full justify-start mb-1 ${isSidebarCollapsed ? "px-2" : ""}`}
                onClick={() => setSelectedTab("users")}
              >
                {isSidebarCollapsed ? (
                  <Users className="h-4 w-4" />
                ) : (
                  <>
                    <Users className="h-4 w-4 mr-2" />
                    用戶管理
                  </>
                )}
              </Button>
              
              <Button
                variant={selectedTab === "announcements" ? "secondary" : "ghost"}
                className={`w-full justify-start mb-1 ${isSidebarCollapsed ? "px-2" : ""}`}
                onClick={() => setSelectedTab("announcements")}
              >
                {isSidebarCollapsed ? (
                  <FileText className="h-4 w-4" />
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    公告管理
                  </>
                )}
              </Button>
              
              <Button
                variant={selectedTab === "manga" ? "secondary" : "ghost"}
                className={`w-full justify-start mb-1 ${isSidebarCollapsed ? "px-2" : ""}`}
                onClick={() => setSelectedTab("manga")}
              >
                {isSidebarCollapsed ? (
                  <BookOpen className="h-4 w-4" />
                ) : (
                  <>
                    <BookOpen className="h-4 w-4 mr-2" />
                    漫畫管理
                  </>
                )}
              </Button>
              
              <Button
                variant={selectedTab === "support" ? "secondary" : "ghost"}
                className={`w-full justify-start mb-1 ${isSidebarCollapsed ? "px-2" : ""}`}
                onClick={() => setSelectedTab("support")}
              >
                {isSidebarCollapsed ? (
                  <MessageSquare className="h-4 w-4" />
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    客服訊息
                  </>
                )}
              </Button>
              
              <Button
                variant={selectedTab === "redemption" ? "secondary" : "ghost"}
                className={`w-full justify-start mb-1 ${isSidebarCollapsed ? "px-2" : ""}`}
                onClick={() => setSelectedTab("redemption")}
              >
                {isSidebarCollapsed ? (
                  <ShoppingBag className="h-4 w-4" />
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    兌換管理
                  </>
                )}
              </Button>
              
              <Button
                variant={selectedTab === "giftcodes" ? "secondary" : "ghost"}
                className={`w-full justify-start mb-1 ${isSidebarCollapsed ? "px-2" : ""}`}
                onClick={() => setSelectedTab("giftcodes")}
              >
                {isSidebarCollapsed ? (
                  <Gift className="h-4 w-4" />
                ) : (
                  <>
                    <Gift className="h-4 w-4 mr-2" />
                    禮包碼管理
                  </>
                )}
              </Button>
              
              <Button
                variant={selectedTab === "games" ? "secondary" : "ghost"}
                className={`w-full justify-start mb-1 ${isSidebarCollapsed ? "px-2" : ""}`}
                onClick={() => setSelectedTab("games")}
              >
                {isSidebarCollapsed ? (
                  <Settings className="h-4 w-4" />
                ) : (
                  <>
                    <Settings className="h-4 w-4 mr-2" />
                    遊戲管理
                  </>
                )}
              </Button>
              
              <Button
                variant={selectedTab === "ai" ? "secondary" : "ghost"}
                className={`w-full justify-start mb-1 ${isSidebarCollapsed ? "px-2" : ""}`}
                onClick={() => setSelectedTab("ai")}
              >
                {isSidebarCollapsed ? (
                  <Settings className="h-4 w-4" />
                ) : (
                  <>
                    <Settings className="h-4 w-4 mr-2" />
                    AI設定
                  </>
                )}
              </Button>
              
              <Button
                variant={selectedTab === "system" ? "secondary" : "ghost"}
                className={`w-full justify-start mb-1 ${isSidebarCollapsed ? "px-2" : ""}`}
                onClick={() => setSelectedTab("system")}
              >
                {isSidebarCollapsed ? (
                  <Settings className="h-4 w-4" />
                ) : (
                  <>
                    <Settings className="h-4 w-4 mr-2" />
                    系統設定
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1">
            {selectedTab === "dashboard" && (
              <>
                <h2 className="text-2xl font-bold mb-4">系統概況</h2>
                <BackendStatsSection
                  users={users}
                  announcements={announcements}
                  supportMessages={supportMessages}
                  currentTemperature={currentTemperature}
                />
              </>
            )}
            
            {selectedTab === "users" && (
              <BackendUserManagement
                users={users}
                addUser={addUser}
                deleteUser={deleteUser}
                updateUser={updateUser}
              />
            )}
            
            {selectedTab === "announcements" && (
              <BackendAnnouncementSection
                announcements={announcements}
                addAnnouncement={addAnnouncement}
                deleteAnnouncement={deleteAnnouncement}
                updateAnnouncement={updateAnnouncement}
              />
            )}
            
            {selectedTab === "manga" && (
              <MangaAdmin 
                novels={mockNovels}
                onAddNovel={(novel) => {
                  setMockNovels([...mockNovels, novel]);
                }}
                onUpdateNovel={(novel) => {
                  setMockNovels(mockNovels.map(n => n.id === novel.id ? novel : n));
                }}
                onDeleteNovel={(id) => {
                  setMockNovels(mockNovels.filter(n => n.id !== id));
                }}
                onSyncContent={handleSyncContent}
                isSyncing={isSyncing}
              />
            )}
            
            {selectedTab === "support" && (
              <Tabs defaultValue="pending" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="pending">待處理訊息</TabsTrigger>
                  <TabsTrigger value="resolved">已處理訊息</TabsTrigger>
                </TabsList>
                <TabsContent value="pending">
                  {/* Support messages management component will go here */}
                  <p>待處理的客戶訊息列表...</p>
                </TabsContent>
                <TabsContent value="resolved">
                  <p>已處理的客戶訊息歷史紀錄...</p>
                </TabsContent>
              </Tabs>
            )}
            
            {selectedTab === "redemption" && <RedemptionCodeManagement />}
            
            {selectedTab === "giftcodes" && <GiftCodeManagement />}
            
            {selectedTab === "games" && <GameManagement />}
            
            {selectedTab === "ai" && (
              <BackendAiSettings 
                supportMessages={supportMessages}
                respondToSupportMessage={respondToSupportMessage}
                markSupportMessageResolved={markSupportMessageResolved}
                getAiAssistantResponse={getAiAssistantResponse}
              />
            )}
            
            {selectedTab === "system" && (
              <BackendSystemSettings 
                backupData={backupData}
                restoreData={restoreData}
                wishPool={<WishPoolManagement />}
              />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BackendManagement;
