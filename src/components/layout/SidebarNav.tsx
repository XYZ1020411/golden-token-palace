
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { SidebarItem } from "./SidebarItem";
import {
  Home,
  User,
  Wallet,
  BookOpen,
  Globe,
  Settings,
  Shield,
  Database,
  Gift,
  Star,
  Heart,
  QrCode,
  Cloud,
  Newspaper,
  Mail,
  Gamepad2,
} from "lucide-react";

interface SidebarNavProps {
  collapsed: boolean;
  hovered: boolean;
}

export const SidebarNav = ({ collapsed, hovered }: SidebarNavProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      icon: Home,
      label: "首頁",
      path: "/dashboard",
      category: "main"
    },
    {
      icon: User,
      label: "個人資料",
      path: "/profile",
      category: "main"
    },
    {
      icon: Wallet,
      label: "錢包",
      path: "/wallet",
      category: "main"
    },
    {
      icon: BookOpen,
      label: "每日小說",
      path: "/daily-novel",
      category: "content"
    },
    {
      icon: Globe,
      label: "建立你自己的世界",
      path: "/manga",
      category: "content"
    },
    {
      icon: Gift,
      label: "VIP福利",
      path: "/vip-rewards",
      category: "rewards"
    },
    {
      icon: Heart,
      label: "許願池",
      path: "/wish-pool",
      category: "rewards"
    },
    {
      icon: Gift,
      label: "禮品碼",
      path: "/gift-code",
      category: "rewards"
    },
    {
      icon: QrCode,
      label: "商品兌換",
      path: "/coupon-redemption",
      category: "rewards"
    },
    {
      icon: QrCode,
      label: "掃描條碼",
      path: "/scan-barcode",
      category: "tools"
    },
    {
      icon: Cloud,
      label: "天氣",
      path: "/weather",
      category: "tools"
    },
    {
      icon: Newspaper,
      label: "新聞",
      path: "/news",
      category: "tools"
    },
    {
      icon: Mail,
      label: "站內信箱",
      path: "/inbox",
      category: "tools"
    },
    {
      icon: Gamepad2,
      label: "氣球遊戲",
      path: "/balloon-game",
      category: "games"
    },
    {
      icon: Gamepad2,
      label: "飛鏢遊戲",
      path: "/dart-game",
      category: "games"
    }
  ];

  const adminItems = [
    {
      icon: Shield,
      label: "管理員",
      path: "/admin",
      category: "admin"
    },
    {
      icon: Database,
      label: "後台管理",
      path: "/backend",
      category: "admin"
    }
  ];

  const allItems = user?.role === "admin" 
    ? [...navigationItems, ...adminItems]
    : navigationItems;

  const categories = {
    main: "主要功能",
    content: "內容系統",
    rewards: "獎勵系統", 
    tools: "實用工具",
    games: "遊戲娛樂",
    admin: "管理功能"
  };

  const groupedItems = allItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof allItems>);

  const shouldShowLabels = !collapsed || hovered;

  return (
    <nav className="space-y-2">
      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={category} className="space-y-1">
          {shouldShowLabels && (
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {categories[category as keyof typeof categories]}
            </h3>
          )}
          {items.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              collapsed={collapsed}
              hovered={hovered}
              isActive={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            />
          ))}
        </div>
      ))}
    </nav>
  );
};
