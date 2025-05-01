import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useWallet } from "@/context/WalletContext";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, PartyPopper } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const BalloonGame = () => {
  const { user, isAuthenticated } = useAuth();
  const { addTransaction } = useWallet();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [reward, setReward] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [gameStats, setGameStats] = useState({
    totalPlays: 0,
    totalRewards: 0,
    averageReward: 0,
    highestReward: 0,
  });

  useEffect(() => {
    // 這裡可以從後端加載遊戲統計數據
    setGameStats({
      totalPlays: 1245,
      totalRewards: 7356000,
      averageReward: 5908,
      highestReward: 10000,
    });
  }, []);

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleStartGame = () => {
    setIsPlaying(true);
    setShowResults(false);
    
    // 模擬遊戲進行
    setTimeout(() => {
      const baseReward = Math.floor(Math.random() * 9000) + 1000; // 1000 到 10000 之間的隨機數
      const userReward = baseReward;
      setReward(userReward);
      
      // 增加交易記錄
      addTransaction({
        amount: userReward,
        type: "system", // Changed from "game" to "system"
        description: "射氣球遊戲獎勵",
      });
      
      // 更新遊戲統計
      setGameStats(prev => ({
        totalPlays: prev.totalPlays + 1,
        totalRewards: prev.totalRewards + userReward,
        averageReward: Math.floor((prev.totalRewards + userReward) / (prev.totalPlays + 1)),
        highestReward: Math.max(prev.highestReward, userReward),
      }));
      
      setIsPlaying(false);
      setShowResults(true);
      
      toast({
        title: "恭喜！",
        description: `您獲得了 ${userReward.toLocaleString()} 點獎勵！`,
      });
    }, 2000);
  };

  return (
    <MainLayout showBackButton>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">射氣球遊戲</h1>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PartyPopper className="mr-2 h-5 w-5" />
                射氣球遊戲
              </CardTitle>
              <CardDescription>
                射擊氣球獲得隨機獎勵，最高可得 10,000 點！
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="aspect-video rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                {isPlaying ? (
                  <div className="text-center text-white">
                    <div className="animate-bounce mb-2">
                      <PartyPopper className="h-12 w-12 mx-auto" />
                    </div>
                    <p className="text-xl font-bold">射擊中...</p>
                  </div>
                ) : showResults ? (
                  <div className="text-center text-white">
                    <h3 className="text-2xl font-bold mb-2">恭喜！</h3>
                    <p className="text-3xl font-bold">獲得 {reward.toLocaleString()} 點</p>
                  </div>
                ) : (
                  <div className="text-center text-white">
                    <PartyPopper className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-xl font-bold">準備開始!</p>
                  </div>
                )}
              </div>
              
              <Button 
                className="w-full" 
                size="lg" 
                disabled={isPlaying}
                onClick={handleStartGame}
              >
                {isPlaying ? "遊戲進行中..." : "開始射擊"}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>遊戲統計</CardTitle>
              <CardDescription>
                您的遊戲數據與獎勵統計
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-md">
                  <p className="text-sm text-muted-foreground">總遊玩次數</p>
                  <p className="text-2xl font-bold">{gameStats.totalPlays.toLocaleString()}</p>
                </div>
                <div className="p-4 border rounded-md">
                  <p className="text-sm text-muted-foreground">總發出獎勵</p>
                  <p className="text-2xl font-bold">{gameStats.totalRewards.toLocaleString()}</p>
                </div>
                <div className="p-4 border rounded-md">
                  <p className="text-sm text-muted-foreground">平均獎勵</p>
                  <p className="text-2xl font-bold">{gameStats.averageReward.toLocaleString()}</p>
                </div>
                <div className="p-4 border rounded-md">
                  <p className="text-sm text-muted-foreground">最高獎勵</p>
                  <p className="text-2xl font-bold">{gameStats.highestReward.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>遊戲規則</CardTitle>
            <CardDescription>如何玩射氣球遊戲</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>射氣球是一個簡單且有趣的小遊戲，您可以通過它獲得隨機點數獎勵：</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>點擊「開始射擊」按鈕開始遊戲</li>
                <li>系統將隨機決定您的射擊結果</li>
                <li>每次射擊可獲得 1,000 到 10,000 不等的點數獎勵</li>
                <li>獎勵點數將自動添加到您的帳戶中</li>
              </ol>
            </div>
          </CardContent>
          <CardFooter>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline">獎勵機制詳情</Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>獎勵機制詳情</DrawerTitle>
                  <DrawerDescription>瞭解射氣球遊戲的獎勵計算方式</DrawerDescription>
                </DrawerHeader>
                <div className="p-4 space-y-4">
                  <p>射氣球遊戲的獎勵基於以下機制：</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>基本獎勵範圍：1,000 - 10,000 點</li>
                    <li>VIP會員可享受獎勵加成：
                      <ul className="list-inside pl-4 space-y-1">
                        <li>VIP 1級：基本獎勵</li>
                        <li>VIP 2級：基本獎勵 × 1.2</li>
                        <li>VIP 3級：基本獎勵 × 1.5</li>
                        <li>VIP 4級及以上：基本獎勵 × 2</li>
                      </ul>
                    </li>
                    <li>特別活動期間可能提供額外獎勵加成</li>
                    <li>每日首次遊玩可獲得額外 10% 獎勵</li>
                  </ul>
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button>確定</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default BalloonGame;
