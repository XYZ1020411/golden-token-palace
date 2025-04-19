
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useWallet } from "./WalletContext";

export interface VipReward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  image?: string;
}

export interface RedeemableItem {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  image?: string;
  code?: string;
}

export interface VipLevel {
  level: number;
  name: string;
  threshold: number;
  perks: string[];
}

interface VipContextType {
  vipLevel: number;
  dailyRewardClaimed: boolean;
  vipLevels: VipLevel[];
  availableRewards: VipReward[];
  redeemableItems: RedeemableItem[];
  claimDailyReward: () => Promise<boolean>;
  redeemItem: (itemId: string) => Promise<string | null>;
  playVipGame: () => Promise<number>;
}

const vipLevelData: VipLevel[] = [
  {
    level: 1,
    name: "銅級會員",
    threshold: 0,
    perks: ["每日簽到獎勵", "基本客戶服務"]
  },
  {
    level: 2,
    name: "銀級會員",
    threshold: 1000000,
    perks: ["每日簽到獎勵加倍", "專屬優惠券", "專屬客服"]
  },
  {
    level: 3,
    name: "金級會員",
    threshold: 5000000,
    perks: ["每日簽到獎勵三倍", "專屬禮物", "高級客服", "特別活動邀請"]
  },
  {
    level: 4,
    name: "鑽石會員",
    threshold: 10000000,
    perks: ["每日簽到獎勵四倍", "專屬獎勵", "頂級客服", "特別活動優先參與", "生日禮物"]
  },
  {
    level: 5,
    name: "尊爵會員",
    threshold: 50000000,
    perks: ["每日簽到獎勵五倍", "定制禮品", "專屬經理", "所有活動VIP待遇", "專屬優惠"]
  }
];

const availableRewardsData: VipReward[] = [
  {
    id: "1",
    name: "VIP每日禮包",
    description: "每日可領取的VIP專屬獎勵",
    pointsRequired: 0
  },
  {
    id: "2",
    name: "高級用戶禮包",
    description: "高級VIP用戶專屬獎勵",
    pointsRequired: 0
  }
];

const redeemableItemsData: RedeemableItem[] = [
  {
    id: "1",
    name: "星巴克咖啡券",
    description: "可兌換一杯中杯星巴克咖啡",
    pointsRequired: 20000,
    code: ""
  },
  {
    id: "2",
    name: "電影票券",
    description: "全台電影院通用電影票一張",
    pointsRequired: 50000,
    code: ""
  },
  {
    id: "3",
    name: "高級餐廳禮券",
    description: "價值2000元的高級餐廳禮券",
    pointsRequired: 200000,
    code: ""
  }
];

const VipContext = createContext<VipContextType | undefined>(undefined);

export const VipProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { addTransaction } = useWallet();
  const [vipLevel, setVipLevel] = useState(0);
  const [dailyRewardClaimed, setDailyRewardClaimed] = useState(false);
  const [vipLevels, setVipLevels] = useState<VipLevel[]>(vipLevelData);
  const [availableRewards, setAvailableRewards] = useState<VipReward[]>(availableRewardsData);
  const [redeemableItems, setRedeemableItems] = useState<RedeemableItem[]>(redeemableItemsData);

  // Initialize VIP status based on user
  useEffect(() => {
    if (user && user.role === "vip") {
      // Determine VIP level based on points
      const level = determineVipLevel(user.points);
      setVipLevel(level);
      
      // Check if daily reward already claimed
      const today = new Date().toISOString().split('T')[0];
      setDailyRewardClaimed(user.lastCheckIn === today);
    } else {
      setVipLevel(0);
      setDailyRewardClaimed(false);
    }
  }, [user]);

  // Determine VIP level based on points
  const determineVipLevel = (points: number): number => {
    let level = 1;
    for (let i = vipLevels.length - 1; i >= 0; i--) {
      if (points >= vipLevels[i].threshold) {
        level = vipLevels[i].level;
        break;
      }
    }
    return level;
  };

  // Claim daily reward
  const claimDailyReward = async (): Promise<boolean> => {
    if (!user || user.role !== "vip" || dailyRewardClaimed) {
      return false;
    }
    
    // Calculate reward based on VIP level
    const baseReward = 10000;
    const reward = baseReward * vipLevel;
    
    // Add transaction
    addTransaction({
      amount: reward,
      type: "daily",
      description: `每日簽到獎勵 (VIP ${vipLevel}級)`
    });
    
    // Mark as claimed
    setDailyRewardClaimed(true);
    
    // Update lastCheckIn in local storage
    const today = new Date().toISOString().split('T')[0];
    const updatedUser = { ...user, lastCheckIn: today };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    return true;
  };

  // Redeem an item
  const redeemItem = async (itemId: string): Promise<string | null> => {
    if (!user || user.role !== "vip") {
      return null;
    }
    
    const item = redeemableItems.find(item => item.id === itemId);
    if (!item || user.points < item.pointsRequired) {
      return null;
    }
    
    // Generate a unique redemption code
    const code = generateRedemptionCode();
    
    // Add transaction
    addTransaction({
      amount: -item.pointsRequired,
      type: "exchange",
      description: `兌換: ${item.name}`
    });
    
    // Update item with code
    const updatedItems = redeemableItems.map(i => 
      i.id === itemId ? { ...i, code } : i
    );
    setRedeemableItems(updatedItems);
    
    return code;
  };

  // Play VIP scratchcard game
  const playVipGame = async (): Promise<number> => {
    if (!user || user.role !== "vip") {
      return 0;
    }
    
    // Random reward between 1000 and 100000 based on VIP level
    const minReward = 1000 * vipLevel;
    const maxReward = 20000 * vipLevel;
    const reward = Math.floor(Math.random() * (maxReward - minReward + 1)) + minReward;
    
    // Add transaction
    addTransaction({
      amount: reward,
      type: "vip",
      description: "VIP刮刮樂獎勵"
    });
    
    return reward;
  };

  // Generate a random redemption code
  const generateRedemptionCode = (): string => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    
    for (let i = 0; i < 12; i++) {
      if (i > 0 && i % 4 === 0) code += '-';
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return code;
  };

  return (
    <VipContext.Provider value={{
      vipLevel,
      dailyRewardClaimed,
      vipLevels,
      availableRewards,
      redeemableItems,
      claimDailyReward,
      redeemItem,
      playVipGame
    }}>
      {children}
    </VipContext.Provider>
  );
};

export const useVip = () => {
  const context = useContext(VipContext);
  if (context === undefined) {
    throw new Error("useVip must be used within a VipProvider");
  }
  return context;
};
