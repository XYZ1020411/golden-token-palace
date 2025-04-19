
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  CreditCard,
  Layout,
  Gift,
  CloudSun,
  FileText,
  User,
  Settings,
  Users,
  CalendarCheck,
  Database,
  MessageCircle
} from "lucide-react";

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  active?: boolean;
}

const SidebarItem = ({ href, icon, title, active }: SidebarItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      {icon}
      <span>{title}</span>
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  // Define common menu items
  const menuItems = [
    {
      href: "/dashboard",
      icon: <Layout className="h-5 w-5" />,
      title: "儀表板",
    },
    {
      href: "/wallet",
      icon: <CreditCard className="h-5 w-5" />,
      title: "錢包系統",
    },
    {
      href: "/weather",
      icon: <CloudSun className="h-5 w-5" />,
      title: "天氣服務",
    },
    {
      href: "/news",
      icon: <FileText className="h-5 w-5" />,
      title: "新聞資訊",
    },
    {
      href: "/profile",
      icon: <User className="h-5 w-5" />,
      title: "個人資料",
    },
  ];

  // VIP-specific menu items
  const vipMenuItems = [
    {
      href: "/vip",
      icon: <Gift className="h-5 w-5" />,
      title: "VIP專區",
    },
  ];

  // Admin-specific menu items
  const adminMenuItems = [
    {
      href: "/admin",
      icon: <Settings className="h-5 w-5" />,
      title: "管理員選項",
    },
    {
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
      title: "用戶管理",
    },
    {
      href: "/admin/announcements",
      icon: <CalendarCheck className="h-5 w-5" />,
      title: "系統公告",
    },
    {
      href: "/admin/points",
      icon: <Database className="h-5 w-5" />,
      title: "點數管理",
    },
  ];

  return (
    <aside className="hidden md:flex w-64 shrink-0 border-r border-r-border bg-sidebar-background flex-col">
      <div className="flex flex-col gap-2 p-4">
        <div className="py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">主菜單</h2>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                title={item.title}
                active={isActive(item.href)}
              />
            ))}
          </div>
        </div>

        {user?.role === "vip" && (
          <div className="py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold text-vip-gold">VIP服務</h2>
            <div className="space-y-1">
              {vipMenuItems.map((item) => (
                <SidebarItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  title={item.title}
                  active={isActive(item.href)}
                />
              ))}
            </div>
          </div>
        )}

        {user?.role === "admin" && (
          <div className="py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold">管理員功能</h2>
            <div className="space-y-1">
              {adminMenuItems.map((item) => (
                <SidebarItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  title={item.title}
                  active={isActive(item.href)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto p-4">
          <div className="rounded-lg bg-sidebar-accent p-4">
            <div className="mb-2 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <span className="font-medium">需要幫助?</span>
            </div>
            <p className="mb-3 text-sm text-sidebar-foreground">
              有任何問題嗎？我們的AI客服隨時為您服務。
            </p>
            <Link
              to="/support"
              className="block w-full rounded bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground"
            >
              聯繫客服
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
