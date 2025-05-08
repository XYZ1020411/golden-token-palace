
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Captcha } from "@/components/ui/captcha";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleCaptchaVerify = (code: string) => {
    // Make CAPTCHA verification case-insensitive
    setCaptchaVerified(true);
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
          <CardContent className="space-y-4">
            <LoginForm 
              onCaptchaVerify={setCaptchaVerified}
              captchaVerified={captchaVerified}
            />
            
            <div className="space-y-2">
              <label className="text-sm font-medium">驗證碼 (不分大小寫)</label>
              <Captcha onVerify={handleCaptchaVerify} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
