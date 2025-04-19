
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useAdmin } from "@/context/AdminContext";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, Users, Bell, Database, ArrowLeft, UserPlus, FileText } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const { 
    users, 
    announcements, 
    addUser, 
    updateUser, 
    deleteUser,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    backupData,
    restoreData
  } = useAdmin();
  const navigate = useNavigate();
  
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "regular" });
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    importance: "medium",
    showToRoles: ["admin", "vip", "regular"]
  });
  const [fileContent, setFileContent] = useState("");

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  const handleAddUser = async () => {
    const success = await addUser(newUser.username, newUser.password, newUser.role as "admin" | "vip" | "regular");
    if (success) {
      toast({
        title: "成功",
        description: "新用戶已創建",
      });
      setNewUser({ username: "", password: "", role: "regular" });
    } else {
      toast({
        title: "錯誤",
        description: "創建用戶失敗",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const success = await deleteUser(userId);
    if (success) {
      toast({
        title: "成功",
        description: "用戶已刪除",
      });
    } else {
      toast({
        title: "錯誤",
        description: "刪除用戶失敗",
        variant: "destructive"
      });
    }
  };

  const handleAddAnnouncement = () => {
    addAnnouncement({
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      importance: newAnnouncement.importance as "low" | "medium" | "high",
      showToRoles: newAnnouncement.showToRoles as ("admin" | "vip" | "regular")[]
    });
    
    toast({
      title: "成功",
      description: "公告已發布",
    });
    
    setNewAnnouncement({
      title: "",
      content: "",
      importance: "medium",
      showToRoles: ["admin", "vip", "regular"]
    });
  };

  const handleDeleteAnnouncement = (id: string) => {
    const success = deleteAnnouncement(id);
    if (success) {
      toast({
        title: "成功",
        description: "公告已刪除",
      });
    } else {
      toast({
        title: "錯誤",
        description: "刪除公告失敗",
        variant: "destructive"
      });
    }
  };

  const handleBackup = () => {
    const data = backupData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "成功",
      description: "系統數據已備份",
    });
  };

  const handleRestore = () => {
    try {
      const success = restoreData(fileContent);
      if (success) {
        toast({
          title: "成功",
          description: "系統數據已恢復",
        });
        setFileContent("");
      } else {
        throw new Error("還原失敗");
      }
    } catch (error) {
      toast({
        title: "錯誤",
        description: "還原數據失敗，請檢查文件格式",
        variant: "destructive"
      });
    }
  };

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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="h-4 w-4 mr-2" />
                        新增用戶
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>新增用戶</DialogTitle>
                        <DialogDescription>
                          創建新的系統用戶帳號
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>用戶名</Label>
                          <Input
                            value={newUser.username}
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>密碼</Label>
                          <Input
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>角色</Label>
                          <Select
                            value={newUser.role}
                            onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="regular">普通用戶</SelectItem>
                              <SelectItem value="vip">VIP用戶</SelectItem>
                              <SelectItem value="admin">管理員</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddUser}>創建用戶</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <CardDescription>系統中的所有用戶帳號</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-md">
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
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          刪除
                        </Button>
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <FileText className="h-4 w-4 mr-2" />
                        新增公告
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>新增公告</DialogTitle>
                        <DialogDescription>
                          發布新的系統公告
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>標題</Label>
                          <Input
                            value={newAnnouncement.title}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>內容</Label>
                          <Input
                            value={newAnnouncement.content}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>重要程度</Label>
                          <Select
                            value={newAnnouncement.importance}
                            onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, importance: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">低</SelectItem>
                              <SelectItem value="medium">中</SelectItem>
                              <SelectItem value="high">高</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddAnnouncement}>發布公告</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <CardDescription>管理系統公告</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="p-4 border rounded-md">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold">{announcement.title}</h3>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteAnnouncement(announcement.id)}
                        >
                          刪除
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{new Date(announcement.date).toLocaleString()}</span>
                        <span className="flex items-center gap-1">
                          重要程度：
                          <span className={
                            announcement.importance === "high" 
                              ? "text-red-500" 
                              : announcement.importance === "medium"
                                ? "text-yellow-500"
                                : "text-green-500"
                          }>
                            {announcement.importance === "high" ? "高" : announcement.importance === "medium" ? "中" : "低"}
                          </span>
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
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-md">
                      <div>
                        <div className="font-medium">{user.username}</div>
                        <div className="text-sm text-muted-foreground">
                          當前點數: {user.points.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="輸入點數"
                          className="w-32"
                          onChange={(e) => {
                            const points = parseInt(e.target.value) || 0;
                            updateUser(user.id, { points });
                          }}
                        />
                        <Button size="sm" onClick={() => {
                          toast({
                            title: "成功",
                            description: "點數已更新",
                          });
                        }}>
                          更新
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
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
                    <Button onClick={handleBackup}>創建備份</Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 border rounded-md">
                    <div>
                      <h3 className="font-medium">資料恢復</h3>
                      <p className="text-sm text-muted-foreground">從備份恢復系統數據</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        value={fileContent}
                        onChange={(e) => setFileContent(e.target.value)}
                        placeholder="貼上備份的JSON數據"
                      />
                      <Button variant="outline" onClick={handleRestore}>恢復資料</Button>
                    </div>
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
