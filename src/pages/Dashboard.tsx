
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { UserRole } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/context/WalletContext";

// Icons
import {
  Gift,
  Mail,
  CalendarDays,
  CloudSun,
  BookOpen,
  PartyPopper,
  BookText,
  Gamepad2,
  CreditCard,
  BookOpen as BookOpenIcon,
} from "lucide-react";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { balance } = useWallet();
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Create welcome message based on time of day
    const hours = new Date().getHours();
    let message = "";
    if (hours < 12) {
      message = "早安！";
    } else if (hours < 18) {
      message = "午安！";
    } else {
      message = "晚安！";
    }
    setWelcomeMessage(message);

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const isAdmin = user?.role === UserRole.ADMIN;

  const handleFeatureClick = (featureName: string, path: string) => {
    if (path) {
      navigate(path);
    } else {
      toast({
        title: "功能開發中",
        description: `${featureName} 功能即將推出，敬請期待！`,
      });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Welcome section */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {welcomeMessage} {user?.username || user?.email}
            </h1>
            <p className="text-muted-foreground">
              {currentTime.toLocaleDateString("zh-TW", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          {isAdmin && (
            <Button variant="outline" onClick={() => navigate("/admin")}>
              管理後台
            </Button>
          )}
        </div>

        {/* Feature highlight */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold mb-2">精彩漫畫與小說</h2>
                <p>來自 TTKan.co 的優質內容已可瀏覽！全新體驗等您探索。</p>
                <Button 
                  variant="secondary" 
                  className="mt-4"
                  onClick={() => navigate("/manga-fox")}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  立即閱讀
                </Button>
              </div>
              <BookOpenIcon className="h-24 w-24 opacity-20" />
            </div>
          </CardContent>
        </Card>

        {/* Main features grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Features with their icons, titles, and navigation */}
          
          {/* Manga Feature */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => navigate("/manga-fox")}>
            <CardHeader className="pb-2">
              <BookOpen className="h-8 w-8 mb-2 text-blue-500 group-hover:text-blue-600 transition-colors" />
              <CardTitle className="group-hover:text-blue-600 transition-colors">漫畫小說</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">來自TTKan的優質漫畫和小說</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => navigate("/gift-code")}>
            <CardHeader className="pb-2">
              <Gift className="h-8 w-8 mb-2 text-red-500 group-hover:text-red-600 transition-colors" />
              <CardTitle className="group-hover:text-red-600 transition-colors">禮包兌換</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">兌換禮包碼獲取獎勵</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => navigate("/inbox")}>
            <CardHeader className="pb-2">
              <Mail className="h-8 w-8 mb-2 text-purple-500 group-hover:text-purple-600 transition-colors" />
              <CardTitle className="group-hover:text-purple-600 transition-colors">站內信箱</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">接收最新消息與通知</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => navigate("/news")}>
            <CardHeader className="pb-2">
              <CalendarDays className="h-8 w-8 mb-2 text-yellow-500 group-hover:text-yellow-600 transition-colors" />
              <CardTitle className="group-hover:text-yellow-600 transition-colors">新聞資訊</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">查看最新公告與資訊</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => navigate("/weather")}>
            <CardHeader className="pb-2">
              <CloudSun className="h-8 w-8 mb-2 text-sky-500 group-hover:text-sky-600 transition-colors" />
              <CardTitle className="group-hover:text-sky-600 transition-colors">天氣預報</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">查看本地天氣情況</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => navigate("/vip-rewards")}>
            <CardHeader className="pb-2">
              <PartyPopper className="h-8 w-8 mb-2 text-amber-500 group-hover:text-amber-600 transition-colors" />
              <CardTitle className="group-hover:text-amber-600 transition-colors">會員福利</CardTitle>
              {user?.isVip && <Badge className="absolute top-2 right-2">VIP</Badge>}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">專屬會員優惠與福利</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => navigate("/wish-pool")}>
            <CardHeader className="pb-2">
              <BookText className="h-8 w-8 mb-2 text-indigo-500 group-hover:text-indigo-600 transition-colors" />
              <CardTitle className="group-hover:text-indigo-600 transition-colors">許願池</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">許下願望等待達成</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => navigate("/balloon-game")}>
            <CardHeader className="pb-2">
              <Gamepad2 className="h-8 w-8 mb-2 text-green-500 group-hover:text-green-600 transition-colors" />
              <CardTitle className="group-hover:text-green-600 transition-colors">氣球遊戲</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">趣味小遊戲，贏得獎勵</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => navigate("/dart-game")}>
            <CardHeader className="pb-2">
              <Gamepad2 className="h-8 w-8 mb-2 text-orange-500 group-hover:text-orange-600 transition-colors" />
              <CardTitle className="group-hover:text-orange-600 transition-colors">飛鏢遊戲</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">投擲飛鏢，贏取積分</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => navigate("/wallet")}>
            <CardHeader className="pb-2">
              <CreditCard className="h-8 w-8 mb-2 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
              <CardTitle className="group-hover:text-emerald-600 transition-colors">錢包</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                目前積分: {balance.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          {/* Additional cards can be added as needed */}
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
