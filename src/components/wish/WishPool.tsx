
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Star } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// 模擬願望數據 - 在真實應用中，這會來自API或上下文
const initialWishes = [
  { 
    id: "1", 
    username: "張三", 
    content: "希望能增加更多VIP等級福利", 
    status: "approved",
    votes: 42,
    createdAt: new Date().toISOString() 
  },
  { 
    id: "2", 
    username: "李四", 
    content: "希望能增加更多兌換商品", 
    status: "approved",
    votes: 38,
    createdAt: new Date(Date.now() - 86400000).toISOString() 
  },
  { 
    id: "3", 
    username: "王五", 
    content: "希望能增加更多遊戲", 
    status: "approved",
    votes: 27,
    createdAt: new Date(Date.now() - 172800000).toISOString() 
  },
  {
    id: "4",
    username: "系統管理員",
    content: "小說章節已更新至1億集",
    status: "approved",
    votes: 999,
    createdAt: new Date().toISOString()
  }
];

export const WishPool = () => {
  const [wishes, setWishes] = useState(initialWishes);
  const [newWish, setNewWish] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // 检查是否在维护时间内
  const isInMaintenanceWindow = () => {
    const now = new Date();
    const hour = now.getHours();
    
    // 每天晚上6點到晚上8點進行維護
    return hour >= 18 && hour < 20;
  };

  const handleSubmitWish = () => {
    if (isInMaintenanceWindow()) {
      toast({
        title: "系統維護中",
        description: "系統目前處於定期維護時間（每天晚上6點到晚上8點），期間許願池功能暫時無法使用。",
        variant: "destructive"
      });
      return;
    }
    
    if (!newWish.trim()) {
      toast({
        title: "願望不能為空",
        description: "請輸入您的願望內容",
        variant: "destructive"
      });
      return;
    }
    
    // 模擬添加願望
    const wish = {
      id: `user-${Date.now()}`,
      username: "用戶",
      content: newWish,
      status: "pending",
      votes: 1,
      createdAt: new Date().toISOString()
    };
    
    setWishes([wish, ...wishes]);
    setNewWish("");
    setIsDialogOpen(false);
    
    toast({
      title: "願望已提交",
      description: "您的願望已成功提交，感謝您的建議！",
    });
  };
  
  const handleVote = (id: string) => {
    if (isInMaintenanceWindow()) {
      toast({
        title: "系統維護中",
        description: "系統目前處於定期維護時間（每天晚上6點到晚上8點），期間許願池功能暫時無法使用。",
        variant: "destructive"
      });
      return;
    }
    
    setWishes(wishes.map(wish => 
      wish.id === id ? { ...wish, votes: wish.votes + 1 } : wish
    ));
    
    toast({
      title: "投票成功",
      description: "感謝您的參與！",
    });
  };
  
  // 按点赞数排序
  const sortedWishes = [...wishes].sort((a, b) => b.votes - a.votes);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className={`${isMobile ? "text-xl" : "text-2xl"} font-bold`}>許願池</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Star className="mr-2 h-4 w-4" />
              許下願望
            </Button>
          </DialogTrigger>
          <DialogContent className={isMobile ? "w-[90%] max-w-md" : ""}>
            <DialogHeader>
              <DialogTitle>許下您的願望</DialogTitle>
              <DialogDescription>
                分享您希望系統增加或改進的功能，最受歡迎的願望有機會被實現！
              </DialogDescription>
            </DialogHeader>
            <Textarea
              value={newWish}
              onChange={(e) => setNewWish(e.target.value)}
              placeholder="請輸入您的願望..."
              className="min-h-[100px]"
            />
            <DialogFooter className={isMobile ? "flex-col gap-2" : ""}>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleSubmitWish}>提交願望</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "md:grid-cols-2"}`}>
        {sortedWishes.map((wish) => (
          <Card key={wish.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{wish.content}</CardTitle>
              <CardDescription className="text-xs">
                由 {wish.username} 於 {new Date(wish.createdAt).toLocaleDateString()} 提出
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleVote(wish.id)}
                  >
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>{wish.votes}</span>
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  {wish.status === 'approved' 
                    ? '已批准' 
                    : wish.status === 'rejected' 
                      ? '已拒絕' 
                      : '審核中'}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
