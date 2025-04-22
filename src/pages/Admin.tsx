import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useAdmin } from "@/context/AdminContext";
import { useVip } from "@/context/VipContext";
import { useProduct, Product } from "@/context/ProductContext";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, Users, Bell, Database, ArrowLeft, UserPlus, FileText, Thermometer, Tag, ScanBarcode } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { getAiAssistantResponse } from "@/services/aiAssistant";

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const { 
    users, 
    announcements, 
    supportMessages,
    currentTemperature,
    addUser, 
    updateUser, 
    deleteUser,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    backupData,
    restoreData,
    respondToSupportMessage,
    markSupportMessageResolved
  } = useAdmin();
  
  const { vipLevels, updateVipLevel } = useVip();
  const { products, addProduct, updateProduct, deleteProduct, generateDailyUsageCode, dailyUsageCode, lastCodeUpdateTime } = useProduct();
  
  const navigate = useNavigate();
  
  // User management state
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "regular" });
  
  // Announcement state
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    importance: "medium",
    showToRoles: ["admin", "vip", "regular"]
  });
  
  // Backup/restore state
  const [fileContent, setFileContent] = useState("");
  
  // Customer Support state
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");
  
  // Product management state
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    price: 0,
    available: true
  });
  
  // VIP level editing state
  const [editingVipLevel, setEditingVipLevel] = useState<number | null>(null);
  const [editedVipLevel, setEditedVipLevel] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  const handleAddUser = async () => {
    const success = await addUser(newUser.username, newUser.password, newUser.role as "admin" | "vip" | "regular");
    if (success) {
      setNewUser({ username: "", password: "", role: "regular" });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    await deleteUser(userId);
  };

  const handleAddAnnouncement = () => {
    addAnnouncement({
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      importance: newAnnouncement.importance as "low" | "medium" | "high",
      showToRoles: newAnnouncement.showToRoles as ("admin" | "vip" | "regular")[]
    });
    
    setNewAnnouncement({
      title: "",
      content: "",
      importance: "medium",
      showToRoles: ["admin", "vip", "regular"]
    });
  };

  const handleDeleteAnnouncement = (id: string) => {
    deleteAnnouncement(id);
  };

  const handleBackup = () => {
    const data = backupData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRestore = () => {
    try {
      const success = restoreData(fileContent);
      if (success) {
        setFileContent("");
      }
    } catch (error) {
      toast({
        title: "錯誤",
        description: "還原數據失敗，請檢查文件格式",
        variant: "destructive"
      });
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.description || newProduct.price <= 0) {
      toast({
        title: "錯誤",
        description: "請填寫所有必要欄位",
        variant: "destructive"
      });
      return;
    }
    
    const success = await addProduct(newProduct);
    if (success) {
      toast({
        title: "成功",
        description: "商品已新增",
      });
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        available: true
      });
    } else {
      toast({
        title: "錯誤",
        description: "新增商品失敗",
        variant: "destructive"
      });
    }
  };

  const handleEditVipLevel = (level: number) => {
    const vipLevel = vipLevels.find(vl => vl.level === level);
    if (vipLevel) {
      setEditedVipLevel({...vipLevel});
      setEditingVipLevel(level);
    }
  };

  const handleSaveVipLevel = async () => {
    if (editedVipLevel) {
      const success = await updateVipLevel(editedVipLevel);
      if (success) {
        toast({
          title: "成功",
          description: "會員等級已更新",
        });
        setEditingVipLevel(null);
      } else {
        toast({
          title: "錯誤",
          description: "更新會員等級失敗",
          variant: "destructive"
        });
      }
    }
  };

  const handleRespondToMessage = (messageId: string) => {
    if (!responseText) {
      toast({
        title: "錯誤",
        description: "請輸入回覆內容",
        variant: "destructive"
      });
      return;
    }
    
    const success = respondToSupportMessage(messageId, responseText);
    if (success) {
      setResponseText("");
      setSelectedMessage(null);
    }
  };

  const handleGenerateNewUsageCode = () => {
    const newCode = generateDailyUsageCode();
    toast({
      title: "成功",
      description: `新的使用碼已生成: ${newCode}`,
    });
  };

  const handleReturn = () => {
    navigate("/dashboard");
  };

  const handleGoToScan = () => {
    navigate("/scan");
  };

  const handleAiAssist = async (messageId: string, customerMessage: string) => {
    const aiResponse = await getAiAssistantResponse(customerMessage);
    if (aiResponse.status === 'success') {
      setResponseText(aiResponse.content);
      setSelectedMessage(messageId);
      toast({
        title: "AI 助手已生成回覆",
        description: "請檢查並編輯回覆內容後發送。"
      });
    } else {
      toast({
        title: "錯誤",
        description: aiResponse.content,
        variant: "destructive"
      });
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">管理員控制台</h1>
            <p className="text-muted-foreground">管理系統用戶、公告與設置</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-full">
              <Thermometer className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">{currentTemperature}</span>
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-1" 
              onClick={handleReturn}
            >
              <ArrowLeft className="h-4 w-4" />
              返回儀表板
            </Button>
          </div>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="users">用戶管理</TabsTrigger>
            <TabsTrigger value="announcements">系統公告</TabsTrigger>
            <TabsTrigger value="points">點數管理</TabsTrigger>
            <TabsTrigger value="products">商品設定</TabsTrigger>
            <TabsTrigger value="vip">客戶等級</TabsTrigger>
            <TabsTrigger value="support">AI客服</TabsTrigger>
            <TabsTrigger value="settings">系統設置</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    用戶列表
                  </CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="h-4 w-4 mr-2" />
                        新增用戶
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>新增用戶</DialogTitle>
                        <DialogDescription>
                          創建新的系統用戶帳號
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>用戶名</Label>
                          <Input
                            value={newUser.username}
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>密碼</Label>
                          <Input
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>角色</Label>
                          <Select
                            value={newUser.role}
                            onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="regular">普通用戶</SelectItem>
                              <SelectItem value="vip">VIP用戶</SelectItem>
                              <SelectItem value="admin">管理員</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddUser}>創建用戶</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <CardDescription>系統中的所有用戶帳號</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-md">
                      <div>
                        <div className="font-medium">{user.username}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.role === "admin" 
                            ? "管理員" 
                            : user.role === "vip" 
                              ? "VIP會員" 
                              : "普通會員"}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          刪除
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="announcements" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5" />
                    系統公告
                  </CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <FileText className="h-4 w-4 mr-2" />
                        新增公告
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>新增公告</DialogTitle>
                        <DialogDescription>
                          發布新的系統公告
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>標題</Label>
                          <Input
                            value={newAnnouncement.title}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>內容</Label>
                          <Input
                            value={newAnnouncement.content}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>重要程度</Label>
                          <Select
                            value={newAnnouncement.importance}
                            onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, importance: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">低</SelectItem>
                              <SelectItem value="medium">中</SelectItem>
                              <SelectItem value="high">高</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddAnnouncement}>發布公告</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <CardDescription>管理系統公告</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="p-4 border rounded-md">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold">{announcement.title}</h3>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteAnnouncement(announcement.id)}
                        >
                          刪除
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{new Date(announcement.date).toLocaleString()}</span>
                        <span className="flex items-center gap-1">
                          重要程度：
                          <span className={
                            announcement.importance === "high" 
                              ? "text-red-500" 
                              : announcement.importance === "medium"
                                ? "text-yellow-500"
                                : "text-green-500"
                          }>
                            {announcement.importance === "high" ? "高" : announcement.importance === "medium" ? "中" : "低"}
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="points" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2 h-5 w-5" />
                  點數管理
                </CardTitle>
                <CardDescription>管理用戶點數</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-md">
                      <div>
                        <div className="font-medium">{user.username}</div>
                        <div className="text-sm text-muted-foreground">
                          當前點數: {user.points.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="輸入點數"
                          className="w-32"
                          defaultValue={user.points}
                          onChange={(e) => {
                            const points = parseInt(e.target.value) || 0;
                            e.currentTarget.dataset.points = points.toString();
                          }}
                        />
                        <Button size="sm" onClick={() => {
                          const pointsInput = document.querySelector(`[data-points]`) as HTMLInputElement;
                          const points = parseInt(pointsInput?.dataset.points || "0");
                          if (points > 0) {
                            updateUser(user.id, { points });
                          }
                        }}>
                          更新
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="products" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Tag className="mr-2 h-5 w-5" />
                    商品管理
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleGoToScan}>
                      <ScanBarcode className="h-4 w-4 mr-2" />
                      掃描條碼
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>新增商品</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>新增商品</DialogTitle>
                          <DialogDescription>
                            創建新的商品項目
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>商品名稱</Label>
                            <Input
                              value={newProduct.name}
                              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>商品描述</Label>
                            <Input
                              value={newProduct.description}
                              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>價格 (點數)</Label>
                            <Input
                              type="number"
                              value={newProduct.price}
                              onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) || 0 })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>狀態</Label>
                            <Select
                              value={newProduct.available ? "true" : "false"}
                              onValueChange={(value) => setNewProduct({ ...newProduct, available: value === "true" })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="true">可用</SelectItem>
                                <SelectItem value="false">停用</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddProduct}>新增商品</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <CardDescription>管理系統商品</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="p-4 border rounded-md">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateProduct(product.id, { available: !product.available })}
                          >
                            {product.available ? "停用" : "啟用"}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteProduct(product.id)}
                          >
                            刪除
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">價格: </span>
                        <span>{product.price.toLocaleString()} 點數</span>
                      </div>
                      <div className="text-sm mt-1">
                        <span className="font-medium">狀態: </span>
                        <span className={product.available ? "text-green-500" : "text-red-500"}>
                          {product.available ? "可用" : "停用"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ScanBarcode className="mr-2 h-5 w-5" />
                  使用碼管理
                </CardTitle>
                <CardDescription>管理商品兌換的使用碼</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h3 className="font-bold">當前使用碼</h3>
                        <p className="text-sm text-muted-foreground">用於驗證商品兌換</p>
                      </div>
                      <Button onClick={handleGenerateNewUsageCode}>
                        重新生成
                      </Button>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex flex-col gap-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-sm font-medium">使用碼:</div>
                          <div className="text-lg font-bold text-primary">{dailyUsageCode}</div>
                          
                          <div className="text-sm font-medium">最後更新時間:</div>
                          <div className="text-sm">{new Date(lastCodeUpdateTime).toLocaleString()}</div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          使用碼每天晚上7點會自動更新。管理員需要記住當前使用碼以驗證商品兌換。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="vip" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  客戶等級設定
                </CardTitle>
                <CardDescription>管理VIP等級與升級門檻</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vipLevels.map((level) => (
                    <div key={level.level} className="p-4 border rounded-md">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold">{level.name} (等級 {level.level})</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditVipLevel(level.level)}
                        >
                          編輯
                        </Button>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">升級所需點數: </span>
                          <span>{level.threshold.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="font-medium">等級特權: </span>
                          <ul className="list-disc list-inside ml-2 text-muted-foreground">
                            {level.perks.map((perk, index) => (
                              <li key={index}>{perk}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {editingVipLevel !== null && editedVipLevel && (
              <Dialog open={editingVipLevel !== null} onOpenChange={(open) => !open && setEditingVipLevel(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>編輯會員等級</DialogTitle>
                    <DialogDescription>
                      修改 {editedVipLevel.name} 等級的設定
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>等級名稱</Label>
                      <Input
                        value={editedVipLevel.name}
                        onChange={(e) => setEditedVipLevel({...editedVipLevel, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>升級所需點數</Label>
                      <Input
                        type="number"
                        value={editedVipLevel.threshold}
                        onChange={(e) => setEditedVipLevel({...editedVipLevel, threshold: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>特權 (請用逗號分隔)</Label>
                      <Input
                        value={editedVipLevel.perks.join(", ")}
                        onChange={(e) => setEditedVipLevel({
                          ...editedVipLevel, 
                          perks: e.target.value.split(",").map((p: string) => p.trim()).filter((p: string) => p)
                        })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditingVipLevel(null)}>取消</Button>
                    <Button onClick={handleSaveVipLevel}>保存</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </TabsContent>
          
          <TabsContent value="support" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  客戶支援訊息
                </CardTitle>
                <CardDescription>管理客戶支援訊息與 AI 客服設定</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supportMessages.map((message) => (
                    <div key={message.id} className="p-4 border rounded-md">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold">{message.username}</h3>
                          <p className="text-xs text-muted-foreground">
                            {new Date(message.date).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span className={`text-xs px-2 py-1 rounded-full ${message.resolved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {message.resolved ? "已解決" : "未解決"}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm mb-3 bg-muted p-3 rounded-md">
                        {message.message}
                      </div>
                      
                      {message.adminResponse && (
                        <div className="text-sm mb-3">
                          <div className="font-medium mb-1">回覆:</div>
                          <div className="bg-blue-50 p-3 rounded-md text-blue-700">
                            {message.adminResponse}
                          </div>
                        </div>
                      )}
                      
                      {!message.adminResponse && (
                        <div className="space-y-2">
                          {selectedMessage === message.id ? (
                            <>
                              <Input
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                                placeholder="輸入回覆內容..."
                              />
                              <div className="flex gap-2 justify-end">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleAiAssist(message.id, message.message)}
                                >
                                  使用 AI 助手
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => setSelectedMessage(null)}>
                                  取消
                                </Button>
                                <Button size="sm" onClick={() => handleRespondToMessage(message.id)}>
                                  發送回覆
                                </Button>
                              </div>
                            </>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => setSelectedMessage(message.id)}>
                              回覆
                            </Button>
                          )}
                        </div>
                      )}
                      
                      <div className="flex justify-end mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markSupportMessageResolved(message.id, !message.resolved)}
                        >
                          標記為{message.resolved ? "未解決" : "已解決"}
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {supportMessages.length === 0 && (
                    <div className="text-center p-6 text-muted-foreground">
                      目前沒有客戶支援訊息
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  系統設置
                </CardTitle>
                <CardDescription>管理系統設置與備份</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-md">
                    <div>
                      <h3 className="font-medium">資料備份</h3>
                      <p className="text-sm text-muted-foreground">創建系統數據的備份</p>
                    </div>
                    <Button onClick={handleBackup}>創建備份</Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 border rounded-md">
                    <div>
                      <h3 className="font-medium">資料恢復</h3>
                      <p className="text-sm text-muted-foreground">從備份恢復系統數據</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        value={fileContent}
                        onChange={(e) => setFileContent(e.target.value)}
                        placeholder="貼上備份的JSON數據"
                      />
                      <Button variant="outline" onClick={handleRestore}>恢復資料</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Admin;
