import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Wallet,
  Award,
  Cloud,
  Newspaper,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  LogOut,
  User,
  Inbox,
  Terminal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMobile } from "@/hooks/use-mobile";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isMobile = useMobile();
  const [collapsed, setCollapsed] = React.useState(isMobile);
  const [toggled, setToggled] = React.useState(false);

  const currentPath = location.pathname;

  // Handle sidebar toggling
  const handleToggle = () => {
    setToggled(!toggled);
  };

  // Handle sidebar collapsing (only used on desktop)
  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  // Reset toggled state when route changes
  React.useEffect(() => {
    setToggled(false);
  }, [currentPath]);

  // On mobile, always collapse sidebar
  React.useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

  // Define navigation items
  const navigationItems = [
    {
      icon: LayoutDashboard,
      label: "儀表板",
      href: "/dashboard",
    },
    {
      icon: Wallet,
      label: "錢包",
      href: "/wallet",
    },
    {
      icon: Award,
      label: "VIP獎勵",
      href: "/vip",
    },
    {
      icon: Cloud,
      label: "天氣資訊",
      href: "/weather",
    },
    {
      icon: Newspaper,
      label: "新聞",
      href: "/news",
    },
    {
      icon: Inbox,
      label: "收件夾",
      href: "/inbox"
    },
    {
      icon: User,
      label: "個人資料",
      href: "/profile",
    },
  ];

  // Admin navigation items
  const adminItems = user?.role === "admin" ? [
    {
      icon: Settings,
      label: "管理員",
      href: "/admin",
    },
    {
      icon: Terminal,
      label: "後台管理",
      href: "/backend",
    },
  ] : [];

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={handleToggle}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Mobile overlay */}
      {toggled && isMobile && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={handleToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full border-r bg-background transition-all duration-300",
          collapsed ? "w-[4.5rem]" : "w-64",
          isMobile && !toggled && "translate-x-[-100%]",
          isMobile && toggled && "translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-16 items-center border-b px-4">
            {!collapsed && <span className="text-xl font-bold">系統選單</span>}
            {/* Collapse button (desktop only) */}
            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className={cn("ml-auto", collapsed && "rotate-180")}
                onClick={handleCollapse}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            {/* Close button (mobile only) */}
            {isMobile && toggled && (
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto"
                onClick={handleToggle}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Sidebar Content */}
          <ScrollArea className="flex-1">
            <nav className="flex flex-col gap-1 p-2">
              {/* Default navigation items */}
              {navigationItems.map((item) => (
                <Button
                  key={item.href}
                  variant={currentPath === item.href ? "default" : "ghost"}
                  className={cn(
                    "justify-start",
                    collapsed && "justify-center"
                  )}
                  asChild
                >
                  <Link to={item.href}>
                    <item.icon className="h-4 w-4 mr-2" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </Button>
              ))}

              {/* Admin items */}
              {adminItems.length > 0 && (
                <>
                  <div
                    className={cn(
                      "my-2 border-t",
                      collapsed && "mx-2"
                    )}
                  />
                  {adminItems.map((item) => (
                    <Button
                      key={item.href}
                      variant={currentPath === item.href ? "default" : "ghost"}
                      className={cn(
                        "justify-start",
                        collapsed && "justify-center"
                      )}
                      asChild
                    >
                      <Link to={item.href}>
                        <item.icon className="h-4 w-4 mr-2" />
                        {!collapsed && <span>{item.label}</span>}
                      </Link>
                    </Button>
                  ))}
                </>
              )}
            </nav>
          </ScrollArea>

          {/* Sidebar Footer */}
          <div className="mt-auto border-t p-2">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                collapsed && "justify-center"
              )}
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {!collapsed && <span>登出</span>}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
