
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useWallet } from "@/context/WalletContext";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, PartyPopper, ThumbsUp } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

const BalloonGame = () => {
  const { user, isAuthenticated } = useAuth();
  const { addTransaction } = useWallet();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [reward, setReward] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [balloons, setBalloons] = useState<{id: number, x: number, y: number, size: number, popped: boolean, value: number}[]>([]);
  const [score, setScore] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const balloonGeneratorRef = useRef<NodeJS.Timeout | null>(null);
  const [gameStats, setGameStats] = useState({
    totalPlays: 0,
    totalRewards: 0,
    averageReward: 0,
    highestReward: 0,
  });
  const [isInMaintenance, setIsInMaintenance] = useState(false);
  const [rewardSystemFixed, setRewardSystemFixed] = useState(true); // 獎勵系統修復狀態
  const isMobile = useIsMobile();

  useEffect(() => {
    // 這裡可以從後端加載遊戲統計數據
    setGameStats({
      totalPlays: 1245,
      totalRewards: 7356000,
      averageReward: 5908,
      highestReward: 10000,
    });
  }, []);

  // 檢查維護時間 - 更新為每天晚上6點到8點
  useEffect(() => {
    const checkMaintenanceSchedule = () => {
      const now = new Date();
      const hour = now.getHours();
      
      // 每天晚上6點到晚上8點進行維護
      const inMaintenance = hour >= 18 && hour < 20;
      setIsInMaintenance(inMaintenance);
    };
    
    checkMaintenanceSchedule();
    const interval = setInterval(checkMaintenanceSchedule, 60000);
    return () => clearInterval(interval);
  }, []);

  // Create balloons when game starts and continuously generate new ones
  useEffect(() => {
    if (isPlaying && gameAreaRef.current) {
      const width = gameAreaRef.current.offsetWidth;
      const height = gameAreaRef.current.offsetHeight;
      
      // Initial balloons
      const newBalloons = Array(5).fill(0).map((_, index) => createBalloon(index, width, height));
      setBalloons(newBalloons);
      
      // Continuously generate new balloons
      balloonGeneratorRef.current = setInterval(() => {
        if (gameAreaRef.current) {
          const currentWidth = gameAreaRef.current.offsetWidth;
          const currentHeight = gameAreaRef.current.offsetHeight;
          
          setBalloons(prev => {
            // Filter out popped balloons and keep only 12 active balloons max
            const activeBalloonsCount = prev.filter(b => !b.popped).length;
            if (activeBalloonsCount >= 12) return prev;
            
            // Create a new balloon with a unique ID
            const newId = prev.length > 0 ? Math.max(...prev.map(b => b.id)) + 1 : 0;
            const newBalloon = createBalloon(newId, currentWidth, currentHeight);
            return [...prev, newBalloon];
          });
        }
      }, 1000); // Add a new balloon every second
      
      // Timer countdown
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            if (balloonGeneratorRef.current) {
              clearInterval(balloonGeneratorRef.current);
              balloonGeneratorRef.current = null;
            }
            handleGameEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => {
        clearInterval(timer);
        if (balloonGeneratorRef.current) {
          clearInterval(balloonGeneratorRef.current);
          balloonGeneratorRef.current = null;
        }
      };
    }
  }, [isPlaying]);

  // Helper function to create a balloon
  const createBalloon = (id: number, width: number, height: number) => {
    const size = 40 + Math.random() * 30;
    const value = Math.floor(size / 10) * 20; // Smaller balloons are worth more points
    
    return {
      id,
      x: Math.random() * (width - size),
      y: Math.random() * (height - size),
      size,
      popped: false,
      value
    };
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleStartGame = () => {
    if (isInMaintenance) {
      toast({
        title: "系統維護中",
        description: "系統目前處於定期維護時間（每天晚上6點到晚上8點），期間此功能暫時無法使用。",
        variant: "destructive"
      });
      return;
    }
    
    setIsPlaying(true);
    setShowResults(false);
    setScore(0);
    setTimeLeft(15);
  };
  
  const handlePopBalloon = (id: number, value: number) => {
    if (!isPlaying) return;
    
    setBalloons(prev => 
      prev.map(balloon => 
        balloon.id === id 
          ? { ...balloon, popped: true } 
          : balloon
      )
    );
    
    setScore(prev => prev + value);
  };
  
  const handleGameEnd = () => {
    setIsPlaying(false);
    
    // Calculate reward based on score
    const userReward = Math.min(score * 10, 10000); // Maximum reward cap
    setReward(userReward);
    
    if (rewardSystemFixed) {
      // 增加交易記錄
      addTransaction({
        amount: userReward,
        type: "system",
        description: "射氣球遊戲獎勵",
      });
      
      // 更新遊戲統計
      setGameStats(prev => ({
        totalPlays: prev.totalPlays + 1,
        totalRewards: prev.totalRewards + userReward,
        averageReward: Math.floor((prev.totalRewards + userReward) / (prev.totalPlays + 1)),
        highestReward: Math.max(prev.highestReward, userReward),
      }));
      
      toast({
        title: "遊戲結束！",
        description: `您獲得了 ${userReward.toLocaleString()} 點獎勵！`,
      });
    } else {
      toast({
        title: "遊戲結束！",
        description: "很遺憾，獎勵系統目前出現問題，技術團隊正在修復中。",
        variant: "destructive"
      });
    }
    
    setShowResults(true);
  };

  if (!isAuthenticated) return null;

  return (
    <MainLayout showBackButton>
      {isInMaintenance ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">系統維護中</h1>
          <p className="text-lg text-muted-foreground mb-4">
            系統目前處於定期維護時間（每天晚上6點到晚上8點），期間氣球遊戲功能暫時無法使用。
          </p>
          <p className="text-muted-foreground">
            請於維護時間結束後再次訪問。感謝您的理解與支持。
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="mr-2" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">射氣球遊戲</h1>
            </div>
          </div>

          {!rewardSystemFixed && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
              <div className="flex items-center">
                <ThumbsUp className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <p className="text-green-800 dark:text-green-300">
                  氣球遊戲獎勵系統已修復，現在可以正常獲取獎勵！
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PartyPopper className="mr-2 h-5 w-5" />
                  射氣球遊戲
                </CardTitle>
                <CardDescription>
                  射擊氣球獲得獎勵，分數越高獎勵越多！
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {!isPlaying && !showResults ? (
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-center mb-6">
                      <PartyPopper className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-xl font-bold">準備好射氣球了嗎？</p>
                      <p className="text-sm text-muted-foreground mt-2">點擊氣球獲得分數！</p>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      size="lg" 
                      onClick={handleStartGame}
                    >
                      開始遊戲
                    </Button>
                  </div>
                ) : isPlaying ? (
                  <div className="flex flex-col">
                    <div className="flex justify-between mb-2">
                      <div className="text-lg font-bold">分數: {score}</div>
                      <div className="text-lg font-bold">時間: {timeLeft}秒</div>
                    </div>
                    <div 
                      ref={gameAreaRef} 
                      className={`aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg relative overflow-hidden ${isMobile ? "h-[40vh]" : "h-auto"}`}
                      style={{ touchAction: "none" }}
                    >
                      {balloons.map(balloon => (
                        !balloon.popped && (
                          <div
                            key={balloon.id}
                            className="absolute cursor-pointer transition-transform hover:scale-105"
                            style={{
                              left: `${balloon.x}px`,
                              top: `${balloon.y}px`,
                              width: `${balloon.size}px`,
                              height: `${balloon.size}px`,
                            }}
                            onClick={() => handlePopBalloon(balloon.id, balloon.value)}
                          >
                            <div className="w-full h-full rounded-full flex items-center justify-center animate-bounce"
                                style={{
                                  background: `radial-gradient(circle at 30% 30%, 
                                              rgb(255, ${50 + balloon.value}, ${50 + balloon.value}), 
                                              rgb(180, 0, 0))`,
                                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
                                }}>
                              <span className="text-white font-bold" style={{ fontSize: `${balloon.size / 3}px` }}>
                                {balloon.value}
                              </span>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <h3 className="text-2xl font-bold mb-2">遊戲結束！</h3>
                    <p className="text-lg mb-4">您的分數: <span className="font-bold">{score}</span></p>
                    {rewardSystemFixed ? (
                      <p className="text-3xl font-bold mb-6">獲得 {reward.toLocaleString()} 點</p>
                    ) : (
                      <p className="text-lg text-red-600 mb-6">獎勵系統已修復</p>
                    )}
                    
                    <Button 
                      className="w-full" 
                      size="lg" 
                      onClick={handleStartGame}
                    >
                      再玩一次
                    </Button>
                  </div>
                )}
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
                <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-4`}>
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
                <p>射氣球是一個簡單且有趣的小遊戲，您可以通過它獲得點數獎勵：</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>點擊「開始遊戲」按鈕開始遊戲</li>
                  <li>在15秒時間內點擊氣球使其爆炸</li>
                  <li>不同大小的氣球有不同分數值</li>
                  <li>小氣球比大氣球值更多分數</li>
                  <li>分數將轉換為獎勵點數，最高10,000點</li>
                  <li>氣球會不斷生成，越多越好！</li>
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
                      <li>基本獎勵：每100分換算為1000點獎勵</li>
                      <li>最高獎勵：8000分可獲得80000點獎勵</li>
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
      )}
    </MainLayout>
  );
};

export default BalloonGame;
