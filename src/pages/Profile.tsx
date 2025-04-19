
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { User, Lock, MessageCircle, Gift } from "lucide-react";

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [redeemCode, setRedeemCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "密碼不匹配",
        description: "新密碼與確認密碼不匹配，請重新輸入",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "密碼已更新",
        description: "您的密碼已成功更改",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setLoading(false);
    }, 1000);
  };

  const handleRedeemCode = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!redeemCode) {
      toast({
        title: "兌換碼為空",
        description: "請輸入有效的兌換碼",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "兌換碼無效",
        description: "您輸入的兌換碼無效或已過期",
        variant: "destructive",
      });
      setLoading(false);
    }, 1000);
  };

  if (!user) return null;

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">個人資料</h1>
          <p className="text-muted-foreground">管理您的帳戶資料與設置</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                帳戶資訊
              </CardTitle>
              <CardDescription>您的個人資料</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>用戶名</Label>
                  <Input value={user.username} disabled />
                </div>
                <div className="space-y-2">
                  <Label>帳戶類型</Label>
                  <Input 
                    value={
                      user.role === "admin" 
                        ? "管理員" 
                        : user.role === "vip" 
                          ? "VIP會員" 
                          : "普通會員"
                    } 
                    disabled 
                  />
                </div>
                {user.role === "vip" && (
                  <div className="space-y-2">
                    <Label>VIP等級</Label>
                    <Input value={`Level ${user.vipLevel}`} disabled />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5" />
                修改密碼
              </CardTitle>
              <CardDescription>更新您的帳戶密碼</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">當前密碼</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">新密碼</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">確認新密碼</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "處理中..." : "更新密碼"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Redeem Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gift className="mr-2 h-5 w-5" />
                兌換碼
              </CardTitle>
              <CardDescription>輸入兌換碼獲取獎勵</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRedeemCode} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="redeemCode">輸入兌換碼</Label>
                  <Input
                    id="redeemCode"
                    placeholder="輸入兌換碼，例如: XXXX-XXXX-XXXX"
                    value={redeemCode}
                    onChange={(e) => setRedeemCode(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "處理中..." : "兌換"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* AI Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-2 h-5 w-5" />
                AI客服系統
              </CardTitle>
              <CardDescription>獲得即時客服支援</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4 py-6">
              <MessageCircle className="h-16 w-16 text-muted-foreground" />
              <p className="text-center text-muted-foreground">
                需要協助？我們的AI客服隨時為您提供幫助
              </p>
              <Button>
                <MessageCircle className="mr-2 h-4 w-4" />
                開始對話
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
