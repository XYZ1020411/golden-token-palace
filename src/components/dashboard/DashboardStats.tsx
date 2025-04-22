
import { CreditCard, User, Bell, Gift } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";
import { useVip } from "@/context/VipContext";
import { Transaction } from "@/context/WalletContext";
import { WeatherAlert } from "@/context/InfoServicesContext";

interface DashboardStatsProps {
  balance: number;
  transactions: Transaction[];
  userRole: string;
  username: string;
  vipLevel?: number;
  currentWeatherAlerts: WeatherAlert[];
  onClaimReward: () => void;
  dailyRewardClaimed: boolean;
}

const DashboardStats = ({
  balance,
  transactions,
  userRole,
  username,
  vipLevel,
  currentWeatherAlerts,
  onClaimReward,
  dailyRewardClaimed,
}: DashboardStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">當前點數</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{formatNumber(balance)}</div>
          <p className="text-xs text-muted-foreground">點數可用於轉帳與兌換</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">帳戶類型</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {userRole === "admin" 
              ? "管理員" 
              : userRole === "vip" 
                ? "VIP會員" 
                : "普通會員"}
          </div>
          <p className="text-xs text-muted-foreground">
            {userRole === "vip" ? `VIP等級: ${vipLevel}` : "升級至VIP可獲得更多功能"}
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

      {userRole === "vip" ? (
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
                  onClick={onClaimReward}
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
  );
};

export default DashboardStats;
