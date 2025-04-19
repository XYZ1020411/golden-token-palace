
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useVip, RedeemableItem } from "@/context/VipContext";
import { useWallet } from "@/context/WalletContext";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarCheck, Gift, Trophy, CreditCard } from "lucide-react";

const VipRewards = () => {
  const { user, isAuthenticated } = useAuth();
  const { vipLevel, dailyRewardClaimed, claimDailyReward, redeemableItems, redeemItem, playVipGame, vipLevels } = useVip();
  const { balance } = useWallet();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedItem, setSelectedItem] = useState<RedeemableItem | null>(null);
  const [redeemDialogOpen, setRedeemDialogOpen] = useState(false);
  const [redemptionCode, setRedemptionCode] = useState<string | null>(null);
  const [gameDialogOpen, setGameDialogOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameResult, setGameResult] = useState<number | null>(null);
  const [showGameResult, setShowGameResult] = useState(false);

  if (!isAuthenticated || user?.role !== "vip") {
    navigate("/login");
    return null;
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("zh-TW").format(num);
  };

  const handleClaimDailyReward = async () => {
    const success = await claimDailyReward();
    if (success) {
      toast({
        title: "獎勵領取成功",
        description: `每日獎勵已成功領取，下次可在明天領取`,
      });
    } else {
      toast({
        title: "獎勵領取失敗",
        description: "您已經領取過今日獎勵，請明天再來",
        variant: "destructive",
      });
    }
  };

  const handleRedeemItem = async () => {
    if (!selectedItem) return;

    const code = await redeemItem(selectedItem.id);
    if (code) {
      setRedemptionCode(code);
    } else {
      toast({
        title: "兌換失敗",
        description: "點數不足或發生其他錯誤",
        variant: "destructive",
      });
    }
  };

  const handlePlayGame = async () => {
    setIsPlaying(true);
    setShowGameResult(false);
    
    try {
      // Simulate a delay to create suspense
      setTimeout(async () => {
        const result = await playVipGame();
        setGameResult(result);
        setIsPlaying(false);
        setShowGameResult(true);
      }, 2000);
    } catch (error) {
      setIsPlaying(false);
      toast({
        title: "遊戲失敗",
        description: "發生錯誤，請稍後再試",
        variant: "destructive",
      });
    }
  };

  // Get current VIP level info
  const currentVipLevel = vipLevels.find(level => level.level === vipLevel);
  const nextVipLevel = vipLevels.find(level => level.level === vipLevel + 1);

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">VIP專區</h1>
          <p className="text-muted-foreground">專屬VIP會員的特殊功能與獎勵</p>
        </div>

        {/* VIP status card */}
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200">
          <CardHeader>
            <CardTitle className="text-primary flex items-center">
              <Trophy className="mr-2 h-5 w-5" />
              VIP等級 {vipLevel}
            </CardTitle>
            <CardDescription>{currentVipLevel?.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-1">VIP特權:</div>
                <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  {currentVipLevel?.perks.map((perk, index) => (
                    <li key={index}>{perk}</li>
                  ))}
                </ul>
              </div>

              {nextVipLevel && (
                <div>
                  <div className="text-sm font-medium mb-1">下一級別:</div>
                  <div className="text-sm text-muted-foreground">
                    再積累 {formatNumber(nextVipLevel.threshold - balance)} 點升級至 {nextVipLevel.name}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Rewards sections */}
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">每日獎勵</TabsTrigger>
            <TabsTrigger value="redeem">商品兌換</TabsTrigger>
            <TabsTrigger value="game">VIP遊戲</TabsTrigger>
          </TabsList>
          
          {/* Daily reward tab */}
          <TabsContent value="daily" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarCheck className="mr-2 h-5 w-5" />
                  每日簽到獎勵
                </CardTitle>
                <CardDescription>每天登入可領取VIP專屬獎勵</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium">
                      {dailyRewardClaimed ? "今日已領取" : "可領取獎勵"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      基礎獎勵 10,000 點 × {vipLevel} 倍率 = {formatNumber(10000 * vipLevel)} 點
                    </p>
                  </div>
                  <Button
                    disabled={dailyRewardClaimed}
                    onClick={handleClaimDailyReward}
                  >
                    {dailyRewardClaimed ? "已領取" : "立即領取"}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="mr-2 h-5 w-5" />
                  VIP專屬禮物
                </CardTitle>
                <CardDescription>專屬VIP會員的特別獎勵</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-medium">VIP每日禮包</p>
                      <p className="text-sm text-muted-foreground">
                        每日可領取的VIP專屬獎勵
                      </p>
                    </div>
                    <Button variant="outline">即將推出</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-medium">高級用戶禮包</p>
                      <p className="text-sm text-muted-foreground">
                        高級VIP用戶專屬獎勵
                      </p>
                    </div>
                    <Button variant="outline">即將推出</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Redeem items tab */}
          <TabsContent value="redeem" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="mr-2 h-5 w-5" />
                  商品兌換
                </CardTitle>
                <CardDescription>
                  用您的點數兌換各種實用商品券
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {redeemableItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="bg-muted h-32 flex items-center justify-center">
                        <Gift className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1 mb-4">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-primary">
                            {formatNumber(item.pointsRequired)} 點
                          </span>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm"
                                onClick={() => setSelectedItem(item)}
                              >
                                兌換
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>確認兌換</DialogTitle>
                                <DialogDescription>
                                  您確定要兌換此商品嗎？兌換後將扣除相應點數。
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="py-4">
                                <div className="flex items-center justify-between mb-4">
                                  <span className="font-medium">{item.name}</span>
                                  <span className="font-bold text-primary">
                                    {formatNumber(item.pointsRequired)} 點
                                  </span>
                                </div>
                                
                                <div className="text-sm text-muted-foreground mb-4">
                                  {item.description}
                                </div>
                                
                                <div className="flex items-center justify-between text-sm">
                                  <span>當前點數:</span>
                                  <span className="font-medium">{formatNumber(balance)}</span>
                                </div>
                                
                                <div className="flex items-center justify-between text-sm">
                                  <span>兌換後餘額:</span>
                                  <span className="font-medium">
                                    {formatNumber(balance - item.pointsRequired)}
                                  </span>
                                </div>
                              </div>
                              
                              <DialogFooter>
                                <Button 
                                  disabled={balance < item.pointsRequired}
                                  onClick={handleRedeemItem}
                                >
                                  確認兌換
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* VIP game tab */}
          <TabsContent value="game" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="mr-2 h-5 w-5" />
                  VIP刮刮樂
                </CardTitle>
                <CardDescription>
                  試試您的運氣，贏取隨機點數獎勵！
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="mb-8 text-center">
                  <p className="text-lg font-medium mb-2">VIP專屬刮刮樂</p>
                  <p className="text-sm text-muted-foreground">
                    根據您的VIP等級，可獲得 {formatNumber(1000 * vipLevel)} 至 {formatNumber(20000 * vipLevel)} 點的隨機獎勵
                  </p>
                </div>
                
                <Dialog open={gameDialogOpen} onOpenChange={setGameDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="lg" 
                      className="px-8 bg-primary hover:bg-primary/90"
                    >
                      <Gift className="mr-2 h-5 w-5" />
                      開始遊戲
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>VIP刮刮樂</DialogTitle>
                      <DialogDescription>
                        測試您的好運氣！
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-8 flex flex-col items-center justify-center">
                      {isPlaying ? (
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                          <p className="text-lg font-medium">刮獎中...</p>
                        </div>
                      ) : showGameResult ? (
                        <div className="text-center">
                          <div className="text-5xl font-bold text-primary mb-2">
                            {formatNumber(gameResult || 0)}
                          </div>
                          <p className="text-xl">恭喜您獲得獎勵！</p>
                          <p className="text-sm text-muted-foreground mt-2">
                            獎勵已添加到您的帳戶
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-4">
                          <div className="bg-muted h-32 w-64 flex items-center justify-center rounded-md">
                            <Gift className="h-16 w-16 text-muted-foreground" />
                          </div>
                          <p className="text-center text-sm text-muted-foreground">
                            點擊下方按鈕開始刮獎
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <DialogFooter>
                      {showGameResult ? (
                        <Button onClick={() => setGameDialogOpen(false)}>
                          關閉
                        </Button>
                      ) : (
                        <Button 
                          onClick={handlePlayGame}
                          disabled={isPlaying}
                        >
                          {isPlaying ? "刮獎中..." : "開始刮獎"}
                        </Button>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default VipRewards;
