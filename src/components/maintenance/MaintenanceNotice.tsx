
import React from "react";

interface MaintenanceNoticeProps {
  featureName: string;
}

const MaintenanceNotice: React.FC<MaintenanceNoticeProps> = ({ featureName }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">系統維護中</h1>
      <p className="text-lg text-muted-foreground mb-4">
        系統目前處於定期維護時間（每天晚上6點到晚上8點），期間{featureName}功能暫時無法使用。
      </p>
      <p className="text-muted-foreground">
        請於維護時間結束後再次訪問。感謝您的理解與支持。
      </p>
    </div>
  );
};

export default MaintenanceNotice;
