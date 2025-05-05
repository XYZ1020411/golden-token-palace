
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useWallet } from "@/context/WalletContext";
import { useVip } from "@/context/VipContext";
import { useInfoServices } from "@/context/InfoServicesContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { CalendarCheck, CreditCard, Gift, User, CloudSun, FileText, Bell, BookOpen, Star, AlertTriangle } from "lucide-react";
import { CouponRedemption } from "@/components/product/CouponRedemption";
import { AnnouncementBoard } from "@/components/announcement/AnnouncementBoard";
import { AiCustomerService } from "@/components/customer-service/AiCustomerService";
import { WishPool } from "@/components/wish/WishPool";
import { toast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { balance, transactions } = useWallet();
  const { vipLevel, dailyRewardClaimed, claimDailyReward } = useVip();
  const { weatherData, newsItems, currentWeatherAlerts } = useInfoServices();
  const navigate = useNavigate();
  
  // Check if in maintenance time
  const isMaintenanceTime = () => {
    const now = new Date();
    const hour = now.getHours();
    return hour >= 18 && hour < 20;
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  // Check maintenance on load
  useEffect(() => {
    if (isMaintenanceTime()) {
      toast({
        title: "系統維護通知",
        description: "目前處於系統維護時間（每天晚上6點至8點），部分功能可能無法使用。",
        variant: "default"
      });
    }
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("zh-TW").format(num);
  };

  const handleClaimReward = async () => {
    if (isMaintenanceTime()) {
      toast({
        title: "系統維護中",
        description: "系統目前處於定期維護時間（每天晚上6點到晚上8點），期間此功能暫時無法使用。",
        variant: "destructive"
      });
      return;
    }
    
    const success = await claimDailyReward();
    if (success) {
      // Reward claimed successfully
    }
  };
  
  const handleBalloonGame = () => {
    toast({
      title: "氣球遊戲獎勵系統通知",
      description: "氣球遊戲獎勵系統目前出現問題，技術團隊正在修復中。請稍後再試。",
      variant: "destructive"
    });
    navigate("/balloon-game");
  };

  if (!user) return null;

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        {/* Welcome header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            歡迎回來, {user.username}!
          </h1>
          <p className="text-muted-foreground">
            查看您的帳戶概況，管理您的點數，享受{user.role === "vip" ? "VIP" : ""}功能
          </p>
          
          {/* Maintenance Notice */}
          {isMaintenanceTime() && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 mt-2">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                <p className="text-yellow-800 dark:text-yellow-300">
                  系統維護中（每天晚上6點至8點）- 部分功能可能受限
                </p>
              </div>
            </div>
          )}
          
          {/* Balloon Game Issue Notice */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
              <p className="text-red-800 dark:text-red-300">
                氣球遊戲獎勵系統目前出現問題，技術團隊正在修復中
              </p>
            </div>
          </div>
        </div>

        {/* Main stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">當前點數</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{formatNumber(balance)}</div>
              <p className="text-xs text-muted-foreground">
                點數可用於轉帳與兌換
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">帳戶類型</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user.role === "admin" 
                  ? "管理員" 
                  : user.role === "vip" 
                    ? "VIP會員" 
                    : "普通會員"}
              </div>
              <p className="text-xs text-muted-foreground">
                {user.role === "vip" ? `VIP等級: ${vipLevel}` : "升級至VIP可獲得更多功能"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">最近交易</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {transactions.length > 0 
                  ? transactions[0].type === "transfer" 
                    ? "轉帳"
                    : transactions[0].type === "gift"
                    ? "贈送"
                    : transactions[0].type === "daily"
                    ? "每日獎勵"
                    : "系統" 
                  : "無交易"}
              </div>
              <p className="text-xs text-muted-foreground">
                {transactions.length > 0 
                  ? new Date(transactions[0].date).toLocaleDateString() 
                  : "尚未有交易記錄"}
              </p>
            </CardContent>
          </Card>

          {user.role === "vip" ? (
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">每日獎勵</CardTitle>
                <Gift className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                {dailyRewardClaimed ? (
                  <>
                    <div className="text-2xl font-bold">已領取</div>
                    <p className="text-xs text-muted-foreground">明天再來</p>
                  </>
                ) : (
                  <>
                    <Button 
                      className="w-full my-1 bg-primary hover:bg-primary/90"
                      onClick={handleClaimReward}
                    >
                      <Gift className="mr-2 h-4 w-4" />
                      領取獎勵
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      VIP專屬每日獎勵
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">警報</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentWeatherAlerts.length > 0 ? currentWeatherAlerts.length : "無"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {currentWeatherAlerts.length > 0 ? "有效天氣警報" : "目前無天氣警報"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Announcement Board - New Section */}
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
          <AnnouncementBoard />
        </div>

        {/* WishPool Section */}
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
          <WishPool />
        </div>

        {/* Information cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Weather card - takes 3 columns */}
          <Card className="col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>天氣預報</CardTitle>
                <CloudSun className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardDescription>今日主要城市天氣</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {weatherData.slice(0, 5).map((data) => (
                  <div key={data.city} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{data.city}</span>
                      <span className="text-sm text-muted-foreground">{data.condition}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">{data.temperature}°C</span>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full mt-2" onClick={() => navigate("/weather")}>
                  查看完整天氣
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* News card - takes 4 columns */}
          <Card className="col-span-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>最新消息</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardDescription>最新新聞摘要</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {newsItems.slice(0, 3).map((news) => (
                  <div key={news.id} className="space-y-2">
                    <h3 className="font-medium">{news.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {news.content}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>{new Date(news.date).toLocaleDateString()} · {news.source}</span>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full mt-2" onClick={() => navigate("/news")}>
                  查看更多新聞
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Coupon Redemption Section */}
        {user && user.role !== "admin" && (
          <>
            <h2 className="text-2xl font-semibold mt-6">商品券兌換</h2>
            <CouponRedemption />
          </>
        )}

        {/* Quick action buttons */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
          <Button variant="outline" onClick={() => navigate("/wallet")}>
            <CreditCard className="mr-2 h-4 w-4" />
            查看錢包
          </Button>
          
          {user.role === "vip" && (
            <Button variant="outline" onClick={() => navigate("/vip")}>
              <Gift className="mr-2 h-4 w-4" />
              VIP專區
            </Button>
          )}
          
          <Button variant="outline" onClick={() => navigate("/weather")}>
            <CloudSun className="mr-2 h-4 w-4" />
            天氣服務
          </Button>
          
          <Button variant="outline" onClick={() => navigate("/profile")}>
            <User className="mr-2 h-4 w-4" />
            個人資料
          </Button>

          <Button 
            variant="outline" 
            className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 border-purple-200 dark:border-purple-800"
            onClick={() => navigate("/daily-novel")}
          >
            <BookOpen className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
            每日小說
          </Button>
          
          <Button 
            variant="outline"
            className="bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 border-amber-200 dark:border-amber-800"
            onClick={() => navigate("/wish-pool")}
          >
            <Star className="mr-2 h-4 w-4 text-amber-600 dark:text-amber-400" />
            許願池
          </Button>
        </div>
        
        {/* Game Section */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">遊戲中心</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Button 
              variant="outline" 
              onClick={handleBalloonGame}
              className="flex flex-col h-24 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200"
            >
              <AlertTriangle className="h-6 w-6 text-red-600 mb-2" />
              <span>氣球遊戲</span>
              <span className="text-xs text-red-600 mt-1">獎勵系統維修中</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate("/dart-game")}
              className="flex flex-col h-24"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
              <span>飛鏢遊戲</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* AI Customer Service Floating Button */}
      <AiCustomerService />
    </MainLayout>
  );
};

export default Dashboard;
