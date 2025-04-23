
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/context/AuthContext";
import { SystemAnnouncement, CustomerSupportMessage } from "@/context/AdminContext";
import { Product } from "@/context/ProductContext";
import { Users, FileText, MessageSquare, ShoppingBag, TrendingUp } from "lucide-react";

interface BackendStatsSectionProps {
  users: User[];
  announcements: SystemAnnouncement[];
  supportMessages: CustomerSupportMessage[];
  products: Product[];
}

export const BackendStatsSection = ({
  users,
  announcements,
  supportMessages,
  products
}: BackendStatsSectionProps) => {
  // Count unresolved support messages
  const unresolvedMessages = supportMessages.filter(msg => !msg.resolved).length;
  
  // Count VIP users
  const vipUsers = users.filter(user => user.role === 'vip').length;
  
  // Count available products
  const availableProducts = products.filter(product => product.available).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">總用戶數</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{users.length}</div>
          <p className="text-xs text-muted-foreground">
            其中 VIP 用戶 {vipUsers} 人
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">系統公告</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{announcements.length}</div>
          <p className="text-xs text-muted-foreground">
            最近更新: {announcements.length > 0 ? new Date(announcements[0].date).toLocaleDateString() : "無"}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">待處理客戶訊息</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{unresolvedMessages}</div>
          <p className="text-xs text-muted-foreground">
            共 {supportMessages.length} 個客戶訊息
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">可用商品</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{availableProducts}</div>
          <p className="text-xs text-muted-foreground">
            共 {products.length} 個商品
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
