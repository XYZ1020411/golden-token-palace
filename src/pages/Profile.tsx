
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useSync } from "@/context/SyncContext";
import MainLayout from "@/components/layout/MainLayout";
import SyncStatusIndicator from "@/components/sync/SyncStatusIndicator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { User, Edit, Save, X, Crown, Star } from "lucide-react";

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { syncStatus } = useSync();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    username: user?.username || "",
    email: "user@example.com" // Mock email
  });

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleSave = () => {
    // In a real app, this would update the user profile
    toast({
      title: "個人資料已更新",
      description: "您的個人資料已成功更新",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser({
      username: user?.username || "",
      email: "user@example.com"
    });
    setIsEditing(false);
  };

  const getRoleBadge = () => {
    switch (user?.role) {
      case "admin":
        return <Badge variant="destructive" className="gap-1"><Crown className="h-3 w-3" />管理員</Badge>;
      case "vip":
        return <Badge variant="default" className="gap-1"><Star className="h-3 w-3" />VIP會員</Badge>;
      default:
        return <Badge variant="secondary">普通會員</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6 max-w-4xl space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">個人資料</h1>
          <Button onClick={logout} variant="outline">
            登出
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 主要個人資料卡片 */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    基本資料
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                    {isEditing ? "取消" : "編輯"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} />
                    <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">{user?.username}</h2>
                    {getRoleBadge()}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">用戶名</Label>
                    {isEditing ? (
                      <Input
                        id="username"
                        value={editedUser.username}
                        onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                      />
                    ) : (
                      <div className="p-2 bg-muted rounded-md">{user?.username}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">電子郵件</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editedUser.email}
                        onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                      />
                    ) : (
                      <div className="p-2 bg-muted rounded-md">{editedUser.email}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>點數餘額</Label>
                    <div className="p-2 bg-muted rounded-md font-bold text-primary">
                      {user?.points?.toLocaleString() || 0}
                    </div>
                  </div>

                  {user?.role === "vip" && (
                    <div className="space-y-2">
                      <Label>VIP 等級</Label>
                      <div className="p-2 bg-muted rounded-md font-bold text-yellow-600">
                        Level {user?.vipLevel || 1}
                      </div>
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSave} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      保存
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      取消
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 同步狀態側邊欄 */}
          <div className="space-y-6">
            <SyncStatusIndicator />
            
            {/* 帳戶統計 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">帳戶統計</CardTitle>
                <CardDescription>您的帳戶活動概覽</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">同步版本</span>
                  <span className="font-medium">v{syncStatus.syncVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">帳戶狀態</span>
                  <Badge variant={syncStatus.isOnline ? "default" : "secondary"}>
                    {syncStatus.isOnline ? "活躍" : "離線"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">註冊時間</span>
                  <span className="font-medium">2024-01-01</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
