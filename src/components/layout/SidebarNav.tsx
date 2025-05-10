
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  LayoutDashboard,
  PartyPopper,
  Target,
  Home,
  Newspaper,
  Wallet,
  User,
  Gift,
  Inbox as InboxIcon,
  LogOut
} from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

interface SidebarNavProps {
  collapsed: boolean;
  hovered: boolean;
}

export const SidebarNav = ({ collapsed, hovered }: SidebarNavProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/dashboard", icon: <Home className="h-4 w-4" />, label: "儀表板" },
    { to: "/profile", icon: <User className="h-4 w-4" />, label: "個人資料" },
    { to: "/wallet", icon: <Wallet className="h-4 w-4" />, label: "錢包" },
    { to: "/news", icon: <Newspaper className="h-4 w-4" />, label: "新聞" },
    { to: "/gift-code", icon: <Gift className="h-4 w-4" />, label: "禮品兌換" },
    { to: "/inbox", icon: <InboxIcon className="h-4 w-4" />, label: "站內信" },
    { to: "/balloon-game", icon: <PartyPopper className="h-4 w-4" />, label: "射氣球遊戲" },
    { to: "/dart-game", icon: <Target className="h-4 w-4" />, label: "射飛鏢遊戲" },
  ];
  
  const adminItems = [
    { to: "/admin", icon: <ShieldAlert className="h-4 w-4" />, label: "管理員" },
    { to: "/backend", icon: <LayoutDashboard className="h-4 w-4" />, label: "後台管理" },
  ];

  return (
    <nav className="flex flex-col space-y-1">
      {navItems.map((item) => (
        <SidebarItem 
          key={item.to}
          to={item.to}
          icon={item.icon}
          label={item.label}
          collapsed={collapsed}
          hovered={hovered}
        />
      ))}
      
      {user.role === "admin" && (
        <>
          {adminItems.map((item) => (
            <SidebarItem 
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              collapsed={collapsed}
              hovered={hovered}
            />
          ))}
        </>
      )}
      
      <Button 
        variant="ghost" 
        className={`justify-start ${collapsed && !hovered ? 'px-2' : ''}`}
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
        {(!collapsed || hovered) && <span className="ml-2">登出</span>}
      </Button>
    </nav>
  );
};
