
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Facebook, Globe, MessageSquare, Eye, EyeOff } from "lucide-react";
import { PrivacyAgreement } from "@/components/auth/PrivacyAgreement";

interface RegisterFormProps {
  onCaptchaVerify?: (verified: boolean) => void;
  captchaVerified?: boolean;
}

const RegisterForm = ({ onCaptchaVerify, captchaVerified }: RegisterFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const { register, socialLogin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "密碼不匹配",
        description: "請確認兩次輸入的密碼一致。",
        variant: "destructive",
      });
      return;
    }

    if (!privacyAgreed) {
      toast({
        title: "請同意隱私權政策",
        description: "註冊前必須同意隱私權政策。",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const success = await register(username, password);

      if (success) {
        toast({
          title: "註冊成功",
          description: "歡迎加入！",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "註冊失敗",
          description: "用戶名可能已被使用，請嘗試其他用戶名。",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "註冊失敗",
        description: "發生錯誤，請稍後再試。",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    if (!privacyAgreed) {
      toast({
        title: "請同意隱私權政策",
        description: "註冊前必須同意隱私權政策。",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const success = await socialLogin(provider);
      if (success) {
        toast({
          title: "註冊成功",
          description: "歡迎加入！",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "註冊失敗",
          description: "無法使用社交媒體註冊，請重試。",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "註冊失敗",
        description: "發生錯誤，請稍後再試。",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
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
          <Label htmlFor="password">密碼</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="輸入密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={toggleShowPassword}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">確認密碼</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="再次輸入密碼"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={toggleShowPassword}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <PrivacyAgreement 
          agreed={privacyAgreed}
          onAgreeChange={setPrivacyAgreed}
        />
      </div>

      <div className="mt-6 flex flex-col space-y-4">
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "註冊中..." : "註冊帳號"}
        </Button>
        
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-muted" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              或使用社交媒體註冊
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
          已有帳號?{" "}
          <Link to="/login" className="text-primary hover:underline">
            登入
          </Link>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;
