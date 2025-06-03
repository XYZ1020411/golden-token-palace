
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useAdmin } from "@/context/AdminContext";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { BackendStatsSection } from "@/components/backend/BackendStatsSection";
import { BackendAnnouncementSection } from "@/components/backend/BackendAnnouncementSection";
import { BackendUserManagement } from "@/components/backend/BackendUserManagement";
import { BackendSyncManagement } from "@/components/backend/BackendSyncManagement";
import { BackendSystemSettings } from "@/components/backend/BackendSystemSettings";
import { BackendAiSettings } from "@/components/backend/BackendAiSettings";
import { WishPoolManagement } from "@/components/backend/WishPoolManagement";
import GiftCodeManagement from "@/components/backend/GiftCodeManagement";
import { RedemptionCodeManagement } from "@/components/backend/RedemptionCodeManagement";
import { GameManagement } from "@/components/backend/GameManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@/context/AuthContext";

const BackendManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const { 
    users, 
    announcements, 
    supportMessages,
    currentTemperature,
    addUser, 
    deleteUser, 
    updateUser,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    backupData,
    restoreData,
    respondToSupportMessage,
    markSupportMessageResolved
  } = useAdmin();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  if (user?.role !== "admin") {
    navigate("/dashboard");
    return null;
  }

  // Mock users data for BackendUserManagement
  const mockUsers = [
    {
      id: "1",
      username: "vip8888",
      role: "vip" as UserRole,
      points: 100000000,
      vipLevel: 5,
    },
    {
      id: "2",
      username: "001",
      role: "vip" as UserRole,
      points: 100000000,
      vipLevel: 5,
    },
    {
      id: "3",
      username: "002",
      role: "admin" as UserRole,
      points: 100000000,
    },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">後台管理系統</h1>
        </div>

        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="stats">統計數據</TabsTrigger>
            <TabsTrigger value="users">用戶管理</TabsTrigger>
            <TabsTrigger value="sync">網路同步</TabsTrigger>
            <TabsTrigger value="announcements">公告管理</TabsTrigger>
            <TabsTrigger value="wishpool">許願池</TabsTrigger>
            <TabsTrigger value="giftcodes">禮品碼</TabsTrigger>
            <TabsTrigger value="redemption">兌換碼</TabsTrigger>
            <TabsTrigger value="games">遊戲管理</TabsTrigger>
          </TabsList>

          <TabsContent value="stats">
            <BackendStatsSection 
              users={users}
              announcements={announcements}
              supportMessages={supportMessages}
              currentTemperature={currentTemperature}
            />
          </TabsContent>

          <TabsContent value="users">
            <BackendUserManagement
              users={mockUsers}
              addUser={addUser}
              deleteUser={deleteUser}
              updateUser={updateUser}
            />
          </TabsContent>

          <TabsContent value="sync">
            <BackendSyncManagement />
          </TabsContent>

          <TabsContent value="announcements">
            <BackendAnnouncementSection 
              announcements={announcements}
              addAnnouncement={addAnnouncement}
              deleteAnnouncement={deleteAnnouncement}
              updateAnnouncement={updateAnnouncement}
            />
          </TabsContent>

          <TabsContent value="wishpool">
            <WishPoolManagement />
          </TabsContent>

          <TabsContent value="giftcodes">
            <GiftCodeManagement />
          </TabsContent>

          <TabsContent value="redemption">
            <RedemptionCodeManagement />
          </TabsContent>

          <TabsContent value="games">
            <GameManagement />
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BackendSystemSettings 
            backupData={backupData}
            restoreData={restoreData}
          />
          <BackendAiSettings 
            supportMessages={supportMessages}
            respondToSupportMessage={respondToSupportMessage}
            markSupportMessageResolved={markSupportMessageResolved}
            getAiAssistantResponse={async (message: string) => {
              // This is a placeholder - the actual implementation would call the AI service
              return { status: 'success' as const, content: 'AI回覆內容' };
            }}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default BackendManagement;
