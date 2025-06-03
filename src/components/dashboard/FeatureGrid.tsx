
import React from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/context/WalletContext";
import { useAuth } from "@/context/AuthContext";
import { FeatureCard } from "./FeatureCard";
import {
  BookOpen,
  Gift,
  Mail,
  CalendarDays,
  CloudSun,
  PartyPopper,
  Globe,
  Gamepad2,
  CreditCard,
} from "lucide-react";

export const FeatureGrid = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { balance } = useWallet();
  const { user } = useAuth();
  
  const handleFeatureClick = (featureName: string, path: string) => {
    if (path) {
      navigate(path);
    } else {
      toast({
        title: "功能開發中",
        description: `${featureName} 功能即將推出，敬請期待！`,
      });
    }
  };
  
  const features = [
    {
      title: "每日小說",
      description: "來自Open Library的優質小說內容",
      icon: <BookOpen className="h-8 w-8" />,
      path: "/daily-novel",
      iconColor: "text-blue-500",
      iconHoverColor: "text-blue-600"
    },
    {
      title: "建立你自己的世界",
      description: "創造法律、建築、動植物、文化、科技等內容",
      icon: <Globe className="h-8 w-8" />,
      path: "/manga",
      iconColor: "text-purple-500",
      iconHoverColor: "text-purple-600"
    },
    {
      title: "禮包兌換",
      description: "兌換禮包碼獲取獎勵",
      icon: <Gift className="h-8 w-8" />,
      path: "/gift-code",
      iconColor: "text-red-500",
      iconHoverColor: "text-red-600"
    },
    {
      title: "站內信箱",
      description: "接收最新消息與通知",
      icon: <Mail className="h-8 w-8" />,
      path: "/inbox",
      iconColor: "text-purple-500",
      iconHoverColor: "text-purple-600"
    },
    {
      title: "新聞資訊",
      description: "查看最新公告與資訊",
      icon: <CalendarDays className="h-8 w-8" />,
      path: "/news",
      iconColor: "text-yellow-500",
      iconHoverColor: "text-yellow-600"
    },
    {
      title: "天氣預報",
      description: "查看本地天氣情況",
      icon: <CloudSun className="h-8 w-8" />,
      path: "/weather",
      iconColor: "text-sky-500",
      iconHoverColor: "text-sky-600"
    },
    {
      title: "會員福利",
      description: "專屬會員優惠與福利",
      icon: <PartyPopper className="h-8 w-8" />,
      path: "/vip-rewards",
      iconColor: "text-amber-500",
      iconHoverColor: "text-amber-600",
      showBadge: user?.vipLevel > 0,
      badgeText: "VIP"
    },
    {
      title: "許願池",
      description: "許下願望等待達成",
      icon: <Globe className="h-8 w-8" />,
      path: "/wish-pool",
      iconColor: "text-indigo-500",
      iconHoverColor: "text-indigo-600"
    },
    {
      title: "氣球遊戲",
      description: "趣味小遊戲，贏得獎勵",
      icon: <Gamepad2 className="h-8 w-8" />,
      path: "/balloon-game",
      iconColor: "text-green-500",
      iconHoverColor: "text-green-600"
    },
    {
      title: "飛鏢遊戲",
      description: "投擲飛鏢，贏取積分",
      icon: <Gamepad2 className="h-8 w-8" />,
      path: "/dart-game",
      iconColor: "text-orange-500",
      iconHoverColor: "text-orange-600"
    },
    {
      title: "錢包",
      description: `目前積分: ${balance.toLocaleString()}`,
      icon: <CreditCard className="h-8 w-8" />,
      path: "/wallet",
      iconColor: "text-emerald-500",
      iconHoverColor: "text-emerald-600"
    },
    {
      title: "商品兌換",
      description: "使用積分兌換各種實體商品",
      icon: <Gift className="h-8 w-8" />,
      path: "/coupon-redemption",
      iconColor: "text-pink-500",
      iconHoverColor: "text-pink-600"
    }
  ];
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </div>
  );
};
