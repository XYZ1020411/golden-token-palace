
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { WishPool as WishPoolComponent } from "@/components/wish/WishPool";
import { useIsMobile } from "@/hooks/use-mobile";
import { checkMaintenanceTime, isAdminUser } from "@/utils/novelUtils";
import MaintenanceNotice from "@/components/maintenance/MaintenanceNotice";

const WishPool = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isAdmin = isAdminUser(user?.role);

  // 檢查登入狀態
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // 檢查是否在維護時間內 - 更新為每天晚上6點到8點
  const [isInMaintenance, setIsInMaintenance] = useState(false);
  
  useEffect(() => {
    const checkMaintenanceSchedule = () => {
      setIsInMaintenance(checkMaintenanceTime());
    };
    
    checkMaintenanceSchedule();
    // 每分鐘檢查一次維護狀態
    const interval = setInterval(checkMaintenanceSchedule, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // 維護中且非管理員時重定向到登入頁
  useEffect(() => {
    if (isInMaintenance && !isAdmin && isAuthenticated) {
      navigate("/login");
    }
  }, [isInMaintenance, isAdmin, isAuthenticated, navigate]);

  // 維護中且非管理員顯示維護通知
  if (isInMaintenance && !isAdmin) {
    return (
      <MainLayout showBackButton>
        <MaintenanceNotice featureName="許願池" />
      </MainLayout>
    );
  }

  return (
    <MainLayout showBackButton>
      {isInMaintenance && isAdmin && <MaintenanceNotice featureName="許願池" isAdmin />}
      
      <div className={`space-y-6 ${isMobile ? "px-2" : ""}`}>
        <h1 className={`${isMobile ? "text-2xl" : "text-3xl"} font-bold tracking-tight`}>
          用戶許願池
        </h1>
        <p className="text-muted-foreground">
          在這裡提出您的建議和願望，最受歡迎的功能有機會被實現！
        </p>
        
        <WishPoolComponent />
      </div>
    </MainLayout>
  );
};

export default WishPool;
