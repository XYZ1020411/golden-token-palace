
import React from "react";
import { Shield } from "lucide-react";

interface MaintenanceNoticeProps {
  featureName: string;
  isAdmin?: boolean;
}

const MaintenanceNotice: React.FC<MaintenanceNoticeProps> = ({ featureName, isAdmin = false }) => {
  if (isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg mb-6">
        <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 mb-2">
          <Shield className="h-5 w-5" />
          <h3 className="text-lg font-medium">管理員維護模式</h3>
        </div>
        <p className="text-muted-foreground">
          系統目前處於維護模式，但您以管理員身份可以繼續使用所有功能。
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">系統維護中</h1>
      <p className="text-lg text-muted-foreground mb-4">
        系統目前處於定期維護時間（每天晚上6點到晚上8點），期間{featureName}功能暫時無法使用。
      </p>
      <p className="text-muted-foreground mb-6">
        請於維護時間結束後再次訪問。感謝您的理解與支持。
      </p>
      <p className="text-sm text-muted-foreground">
        注意：維護期間包括登入功能在內的所有用戶功能將被暫停。僅系統管理員可以訪問。
      </p>
    </div>
  );
};

export default MaintenanceNotice;
