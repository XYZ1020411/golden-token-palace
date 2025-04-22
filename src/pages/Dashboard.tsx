
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useWallet } from "@/context/WalletContext";
import { useVip } from "@/context/VipContext";
import { useInfoServices } from "@/context/InfoServicesContext";
import MainLayout from "@/components/layout/MainLayout";
import { AiCustomerService } from "@/components/customer-service/AiCustomerService";
import { CouponRedemption } from "@/components/product/CouponRedemption";
import DashboardStats from "@/components/dashboard/DashboardStats";
import WeatherSection from "@/components/dashboard/WeatherSection";
import NewsSection from "@/components/dashboard/NewsSection";
import QuickActions from "@/components/dashboard/QuickActions";
import { AnnouncementBoard } from "@/components/announcement/AnnouncementBoard";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { balance, transactions } = useWallet();
  const { vipLevel, dailyRewardClaimed, claimDailyReward } = useVip();
  const { weatherData, newsItems, currentWeatherAlerts } = useInfoServices();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleClaimReward = async () => {
    const success = await claimDailyReward();
    if (success) {
      // Reward claimed successfully
    }
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
        </div>

        <DashboardStats
          balance={balance}
          transactions={transactions}
          userRole={user.role}
          username={user.username}
          vipLevel={vipLevel}
          currentWeatherAlerts={currentWeatherAlerts}
          onClaimReward={handleClaimReward}
          dailyRewardClaimed={dailyRewardClaimed}
        />

        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
          <AnnouncementBoard />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <WeatherSection weatherData={weatherData} />
          <NewsSection newsItems={newsItems} />
        </div>

        {user && user.role !== "admin" && (
          <>
            <h2 className="text-2xl font-semibold mt-6">商品券兌換</h2>
            <CouponRedemption />
          </>
        )}

        <QuickActions userRole={user.role} />
      </div>
      
      <AiCustomerService />
    </MainLayout>
  );
};

export default Dashboard;
