
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { WishPool as WishPoolComponent } from "@/components/wish/WishPool";
import { useIsMobile } from "@/hooks/use-mobile";

const WishPool = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // 檢查是否在維護時間內 - 更新為每天晚上6點到8點
  const [isInMaintenance, setIsInMaintenance] = useState(false);
  
  useEffect(() => {
    const checkMaintenanceSchedule = () => {
      const now = new Date();
      const hour = now.getHours();
      
      // 每天晚上6點到晚上8點進行維護
      const inMaintenance = hour >= 18 && hour < 20;
      setIsInMaintenance(inMaintenance);
    };
    
    checkMaintenanceSchedule();
    // 每分鐘檢查一次維護狀態
    const interval = setInterval(checkMaintenanceSchedule, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <MainLayout showBackButton>
      {isInMaintenance ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">系統維護中</h1>
          <p className="text-lg text-muted-foreground mb-4">
            系統目前處於定期維護時間（每天晚上6點到晚上8點），期間許願池功能暫時無法使用。
          </p>
          <p className="text-muted-foreground">
            請於維護時間結束後再次訪問。感謝您的理解與支持。
          </p>
        </div>
      ) : (
        <div className={`space-y-6 ${isMobile ? "px-2" : ""}`}>
          <h1 className={`${isMobile ? "text-2xl" : "text-3xl"} font-bold tracking-tight`}>
            用戶許願池
          </h1>
          <p className="text-muted-foreground">
            在這裡提出您的建議和願望，最受歡迎的功能有機會被實現！
          </p>
          
          <WishPoolComponent />
        </div>
      )}
    </MainLayout>
  );
};

export default WishPool;
