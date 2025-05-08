
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Captcha } from "@/components/ui/captcha";
import RegisterForm from "@/components/auth/RegisterForm";

const Register = () => {
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleCaptchaVerify = (code: string) => {
    setCaptchaVerified(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="border-2 border-primary/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">註冊帳號</CardTitle>
            <CardDescription>
              創建一個新帳號來使用我們的服務
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RegisterForm />
            
            <div className="space-y-2">
              <label className="text-sm font-medium">驗證碼</label>
              <Captcha onVerify={handleCaptchaVerify} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
