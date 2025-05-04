
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Star, Trash, Edit, PlusCircle } from "lucide-react";

// Mock wish data - in a real app, this would come from context or API
const mockWishes = [
  { 
    id: "1", 
    userId: "user1", 
    username: "張三", 
    content: "希望能增加更多VIP等級福利", 
    status: "pending",
    createdAt: new Date().toISOString() 
  },
  { 
    id: "2", 
    userId: "user2", 
    username: "李四", 
    content: "希望能增加更多兌換商品", 
    status: "approved",
    createdAt: new Date(Date.now() - 86400000).toISOString() 
  },
  { 
    id: "3", 
    userId: "user3", 
    username: "王五", 
    content: "希望能增加更多遊戲", 
    status: "rejected",
    createdAt: new Date(Date.now() - 172800000).toISOString() 
  },
  {
    id: "4",
    userId: "admin",
    username: "管理員",
    content: "小說章節已更新至1000億集",
    status: "approved",
    createdAt: new Date().toISOString()
  }
];

export const WishPoolManagement = () => {
  const [wishes, setWishes] = useState(mockWishes);
  const [newWishContent, setNewWishContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const filteredWishes = wishes.filter(wish => {
    const matchesSearch = wish.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          wish.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || wish.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  // 检查是否在维护时间内
  const isInMaintenanceWindow = () => {
    const now = new Date();
    const day = now.getDay(); // 0 is Sunday
    const hour = now.getHours();
    
    // 檢查是否為週日(0)且時間在15:00-16:00之間
    return day === 0 && hour >= 15 && hour < 16;
  };
  
  const handleStatusChange = (wishId, newStatus) => {
    if (isInMaintenanceWindow()) {
      toast({
        title: "系統維護中",
        description: "系統目前處於定期維護時間（每週日下午3點至4點），期間許願池功能暫時無法使用。",
        variant: "destructive"
      });
      return;
    }
    
    setWishes(wishes.map(wish => 
      wish.id === wishId ? { ...wish, status: newStatus } : wish
    ));
    
    toast({
      title: "願望狀態已更新",
      description: `願望已${newStatus === 'approved' ? '批准' : newStatus === 'rejected' ? '拒絕' : '更新'}`,
    });
  };
  
  const handleDeleteWish = (wishId) => {
    if (isInMaintenanceWindow()) {
      toast({
        title: "系統維護中",
        description: "系統目前處於定期維護時間（每週日下午3點至4點），期間許願池功能暫時無法使用。",
        variant: "destructive"
      });
      return;
    }
    
    setWishes(wishes.filter(wish => wish.id !== wishId));
    
    toast({
      title: "願望已刪除",
      description: "該願望已從系統中移除",
    });
  };
  
  const handleAddWish = () => {
    if (isInMaintenanceWindow()) {
      toast({
        title: "系統維護中",
        description: "系統目前處於定期維護時間（每週日下午3點至4點），期間許願池功能暫時無法使用。",
        variant: "destructive"
      });
      return;
    }
    
    if (!newWishContent.trim()) {
      toast({
        title: "內容不能為空",
        description: "請輸入願望內容",
        variant: "destructive"
      });
      return;
    }
    
    const newWish = {
      id: `new-${Date.now()}`,
      userId: "admin",
      username: "管理員",
      content: newWishContent,
      status: "approved",
      createdAt: new Date().toISOString()
    };
    
    setWishes([newWish, ...wishes]);
    setNewWishContent("");
    
    toast({
      title: "願望已添加",
      description: "新願望已添加到系統"
    });
  };
  
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'approved':
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case 'rejected':
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>許願池管理</CardTitle>
          <CardDescription>
            管理用戶提交的願望和建議
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label>添加系統願望</Label>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Textarea
                    value={newWishContent}
                    onChange={(e) => setNewWishContent(e.target.value)}
                    placeholder="輸入新願望內容..."
                  />
                </div>
                <Button 
                  onClick={handleAddWish}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  添加
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  placeholder="搜索願望..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">全部狀態</option>
                <option value="pending">待處理</option>
                <option value="approved">已批准</option>
                <option value="rejected">已拒絕</option>
              </select>
            </div>
            
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>用戶</TableHead>
                    <TableHead>願望內容</TableHead>
                    <TableHead>提交時間</TableHead>
                    <TableHead>狀態</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWishes.length > 0 ? (
                    filteredWishes.map(wish => (
                      <TableRow key={wish.id}>
                        <TableCell>{wish.username}</TableCell>
                        <TableCell>{wish.content}</TableCell>
                        <TableCell>{new Date(wish.createdAt).toLocaleString("zh-TW")}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(wish.status)}`}>
                            {wish.status === 'approved' ? '已批准' : 
                             wish.status === 'rejected' ? '已拒絕' : '待處理'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>更新願望狀態</DialogTitle>
                                  <DialogDescription>
                                    選擇願望的新狀態
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  <p className="mb-2 font-medium">願望內容:</p>
                                  <p className="text-sm text-muted-foreground">{wish.content}</p>
                                </div>
                                <DialogFooter>
                                  <Button 
                                    variant="outline" 
                                    onClick={() => handleStatusChange(wish.id, "pending")}
                                  >
                                    標記為待處理
                                  </Button>
                                  <Button 
                                    variant="default"
                                    className="bg-green-600 hover:bg-green-700" 
                                    onClick={() => handleStatusChange(wish.id, "approved")}
                                  >
                                    批准
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    onClick={() => handleStatusChange(wish.id, "rejected")}
                                  >
                                    拒絕
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteWish(wish.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        無符合條件的願望
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
