
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useAdmin } from "@/context/AdminContext";
import { useVip } from "@/context/VipContext";
import { useProduct, Product } from "@/context/ProductContext";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, Users, Bell, Database, ArrowLeft, UserPlus, FileText, Thermometer, Tag, ScanBarcode, LayoutDashboard } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { getAiAssistantResponse } from "@/services/aiAssistant";
import { BackendStatsSection } from "@/components/backend/BackendStatsSection";
import { BackendUserManagement } from "@/components/backend/BackendUserManagement";
import { BackendAnnouncementSection } from "@/components/backend/BackendAnnouncementSection";
import { BackendAiSettings } from "@/components/backend/BackendAiSettings";
import { BackendSystemSettings } from "@/components/backend/BackendSystemSettings";

const BackendManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const { 
    users, 
    announcements, 
    supportMessages,
    currentTemperature,
    addUser, 
    updateUser, 
    deleteUser,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    backupData,
    restoreData,
    respondToSupportMessage,
    markSupportMessageResolved
  } = useAdmin();
  
  const { vipLevels, updateVipLevel } = useVip();
  const { products, addProduct, updateProduct, deleteProduct, generateDailyUsageCode, dailyUsageCode, lastCodeUpdateTime } = useProduct();
  
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  const handleReturn = () => {
    navigate("/dashboard");
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">後台管理系統</h1>
            <p className="text-muted-foreground">管理系統用戶、公告與設置</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-full">
              <Thermometer className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">{currentTemperature}</span>
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-1" 
              onClick={handleReturn}
            >
              <ArrowLeft className="h-4 w-4" />
              返回儀表板
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-1" 
              onClick={() => navigate("/admin")}
            >
              <LayoutDashboard className="h-4 w-4" />
              管理員面板
            </Button>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">儀表板</TabsTrigger>
            <TabsTrigger value="users">用戶管理</TabsTrigger>
            <TabsTrigger value="announcements">系統公告</TabsTrigger>
            <TabsTrigger value="ai-settings">AI設置</TabsTrigger>
            <TabsTrigger value="system">系統設置</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="mt-4">
            <BackendStatsSection 
              users={users} 
              announcements={announcements} 
              supportMessages={supportMessages}
              products={products}
            />
          </TabsContent>
          
          <TabsContent value="users" className="mt-4">
            <BackendUserManagement 
              users={users}
              addUser={addUser}
              deleteUser={deleteUser}
              updateUser={updateUser}
            />
          </TabsContent>
          
          <TabsContent value="announcements" className="mt-4">
            <BackendAnnouncementSection 
              announcements={announcements}
              addAnnouncement={addAnnouncement}
              deleteAnnouncement={deleteAnnouncement}
            />
          </TabsContent>
          
          <TabsContent value="ai-settings" className="mt-4">
            <BackendAiSettings 
              supportMessages={supportMessages}
              respondToSupportMessage={respondToSupportMessage}
              markSupportMessageResolved={markSupportMessageResolved}
              getAiAssistantResponse={getAiAssistantResponse}
            />
          </TabsContent>
          
          <TabsContent value="system" className="mt-4">
            <BackendSystemSettings 
              backupData={backupData}
              restoreData={restoreData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default BackendManagement;
