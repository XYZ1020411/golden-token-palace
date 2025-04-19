
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useAdmin } from "@/context/AdminContext";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Users, Bell, Database, ArrowLeft } from "lucide-react";

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const { users, announcements } = useAdmin();
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
            <h1 className="text-3xl font-bold tracking-tight">管理員控制台</h1>
            <p className="text-muted-foreground">管理系統用戶、公告與設置</p>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-1" 
            onClick={handleReturn}
          >
            <ArrowLeft className="h-4 w-4" />
            返回儀表板
          </Button>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">用戶管理</TabsTrigger>
            <TabsTrigger value="announcements">系統公告</TabsTrigger>
            <TabsTrigger value="points">點數管理</TabsTrigger>
            <TabsTrigger value="settings">系統設置</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    用戶列表
                  </CardTitle>
                  <Button>新增用戶</Button>
                </div>
                <CardDescription>系統中的所有用戶帳號</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-2 border-b">
                      <div>
                        <div className="font-medium">{user.username}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.role === "admin" 
                            ? "管理員" 
                            : user.role === "vip" 
                              ? "VIP會員" 
                              : "普通會員"}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">編輯</Button>
                        <Button variant="destructive" size="sm">刪除</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="announcements" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5" />
                    系統公告
                  </CardTitle>
                  <Button>新增公告</Button>
                </div>
                <CardDescription>管理系統公告</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="p-4 border rounded-md">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold">{announcement.title}</h3>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">編輯</Button>
                          <Button variant="destructive" size="sm">刪除</Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{new Date(announcement.date).toLocaleString()}</span>
                        <span>
                          顯示給: {announcement.showToRoles.map(role => 
                            role === "admin" ? "管理員" : 
                            role === "vip" ? "VIP會員" : "普通會員"
                          ).join(", ")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="points" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2 h-5 w-5" />
                  點數管理
                </CardTitle>
                <CardDescription>管理用戶點數</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">點數管理功能即將上線</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  系統設置
                </CardTitle>
                <CardDescription>管理系統設置與備份</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-md">
                    <div>
                      <h3 className="font-medium">資料備份</h3>
                      <p className="text-sm text-muted-foreground">創建系統數據的備份</p>
                    </div>
                    <Button>創建備份</Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 border rounded-md">
                    <div>
                      <h3 className="font-medium">資料恢復</h3>
                      <p className="text-sm text-muted-foreground">從備份恢復系統數據</p>
                    </div>
                    <Button variant="outline">恢復資料</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Admin;
