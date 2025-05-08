
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Facebook, Mail, Globe, MessageSquare } from "lucide-react";
import { Captcha } from "@/components/ui/captcha";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const { login, socialLogin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // 用戶登入成功後根據角色導向
  const redirectAfterLogin = (role?: string) => {
    if (role === "admin") {
      navigate("/admin");
    } else if (role === "regular" || role === "vip") {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verify if captcha has been completed
    if (!captchaVerified) {
      toast({
        title: "驗證失敗",
        description: "請完成驗證碼驗證",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);

    try {
      const success = await login(username, password);

      if (success) {
        toast({
          title: "登入成功",
          description: "歡迎回來！",
        });

        // 這裡取得新用戶資訊，然後重導
        const userInfo = JSON.parse(localStorage.getItem("user") || "{}");
        redirectAfterLogin(userInfo.role);
      } else {
        toast({
          title: "登入失敗",
          description: "用戶名或密碼錯誤，請重試。",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "登入失敗",
        description: "發生錯誤，請稍後再試。",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setLoading(true);
    try {
      const success = await socialLogin(provider);
      if (success) {
        toast({
          title: "登入成功",
          description: "歡迎回來！",
        });

        // 這裡取得新用戶資訊，然後重導
        const userInfo = JSON.parse(localStorage.getItem("user") || "{}");
        redirectAfterLogin(userInfo.role);
      } else {
        toast({
          title: "登入失敗",
          description: "無法使用社交媒體登入，請重試。",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "登入失敗",
        description: "發生錯誤，請稍後再試。",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCaptchaVerify = (code: string) => {
    setCaptchaVerified(true);
    toast({
      title: "驗證成功",
      description: "驗證碼驗證成功",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="border-2 border-primary/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">登入系統</CardTitle>
            <CardDescription>
              輸入您的用戶名和密碼
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">用戶名</Label>
                <Input
                  id="username"
                  placeholder="輸入用戶名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">密碼</Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    忘記密碼?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="輸入密碼"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>驗證碼</Label>
                <Captcha onVerify={handleCaptchaVerify} />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "登入中..." : "登入"}
              </Button>
              
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    或使用社交媒體登入
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin("facebook")}
                  disabled={loading}
                >
                  <Facebook className="h-5 w-5 text-blue-600" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin("google")}
                  disabled={loading}
                >
                  <Globe className="h-5 w-5 text-red-500" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin("discord")}
                  disabled={loading}
                >
                  <MessageSquare className="h-5 w-5 text-indigo-500" />
                </Button>
              </div>
              
              <div className="text-center text-sm">
                還沒有帳號?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  立即註冊
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
