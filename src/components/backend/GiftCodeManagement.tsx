
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Gift, Plus, Trash2, Edit, RefreshCw, Search } from "lucide-react";

// Mock data types
interface GiftCode {
  id: string;
  code: string;
  reward: number;
  type: string;
  description: string;
  expiryDate: string;
  isActive: boolean;
  createdAt: string;
  usedCount: number;
  maxUses: number | null;
}

export const GiftCodeManagement = () => {
  // Mock gift codes
  const [giftCodes, setGiftCodes] = useState<GiftCode[]>([
    {
      id: "1",
      code: "NEWYEAR2025",
      reward: 50000,
      type: "節慶禮包",
      description: "2025年新年慶祝禮包",
      expiryDate: "2026-01-31",
      isActive: true,
      createdAt: "2025-01-01",
      usedCount: 243,
      maxUses: 500
    },
    {
      id: "2",
      code: "SPRING888",
      reward: 88800,
      type: "節慶禮包",
      description: "春節特別禮包",
      expiryDate: "2025-03-31",
      isActive: true,
      createdAt: "2025-02-15",
      usedCount: 156,
      maxUses: 1000
    },
    {
      id: "3",
      code: "WELCOME100K",
      reward: 100000,
      type: "新用戶禮包",
      description: "新用戶歡迎禮包",
      expiryDate: "2025-12-31",
      isActive: true,
      createdAt: "2025-01-15",
      usedCount: 1850,
      maxUses: null
    },
    {
      id: "4",
      code: "DRAGON2025",
      reward: 52500,
      type: "節慶禮包",
      description: "龍年慶祝活動",
      expiryDate: "2025-02-28",
      isActive: false,
      createdAt: "2025-01-20",
      usedCount: 2368,
      maxUses: 5000
    },
    {
      id: "5",
      code: "SUMMER666",
      reward: 66600,
      type: "季節禮包",
      description: "夏日特別活動",
      expiryDate: "2025-09-30",
      isActive: true,
      createdAt: "2025-06-01",
      usedCount: 412,
      maxUses: 2000
    }
  ]);

  // State for managing the form
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCode, setSelectedCode] = useState<GiftCode | null>(null);
  const [formData, setFormData] = useState<Partial<GiftCode>>({
    code: "",
    reward: 10000,
    type: "節慶禮包",
    description: "",
    expiryDate: "",
    isActive: true,
    maxUses: null
  });
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("");
  
  // Filtered gift codes
  const filteredGiftCodes = giftCodes.filter(code => {
    const matchesSearch = 
      code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType ? code.type === filterType : true;
    
    return matchesSearch && matchesType;
  });
  
  // Get unique types for filter
  const uniqueTypes = Array.from(new Set(giftCodes.map(code => code.type)));
  
  const handleCreateOrEdit = () => {
    if (!formData.code || !formData.description || !formData.expiryDate) {
      toast({
        title: "錯誤",
        description: "請填寫所有必填欄位",
        variant: "destructive"
      });
      return;
    }
    
    // Validate reward
    if (formData.reward && (formData.reward <= 0 || formData.reward > 1000000)) {
      toast({
        title: "獎勵點數無效",
        description: "獎勵點數必須在 1 至 1,000,000 之間",
        variant: "destructive"
      });
      return;
    }
    
    if (isEditMode && selectedCode) {
      // Edit existing code
      const updatedCodes = giftCodes.map(code => 
        code.id === selectedCode.id 
          ? { ...code, ...formData, id: code.id }
          : code
      );
      setGiftCodes(updatedCodes);
      toast({
        title: "禮包碼已更新",
        description: `已成功更新禮包碼 ${formData.code}`,
      });
    } else {
      // Check for duplicate code
      if (giftCodes.some(code => code.code === formData.code)) {
        toast({
          title: "禮包碼已存在",
          description: "請使用不同的禮包碼",
          variant: "destructive"
        });
        return;
      }
      
      // Create new code
      const newCode: GiftCode = {
        id: Date.now().toString(),
        code: formData.code || "",
        reward: formData.reward || 10000,
        type: formData.type || "節慶禮包",
        description: formData.description || "",
        expiryDate: formData.expiryDate || "",
        isActive: formData.isActive !== undefined ? formData.isActive : true,
        createdAt: new Date().toISOString().split('T')[0],
        usedCount: 0,
        maxUses: formData.maxUses
      };
      
      setGiftCodes([...giftCodes, newCode]);
      toast({
        title: "禮包碼已創建",
        description: `已成功創建新禮包碼 ${formData.code}`,
      });
    }
    
    // Reset form and close dialog
    resetForm();
    setIsDialogOpen(false);
  };
  
  const handleDelete = (id: string) => {
    if (confirm("確定要刪除此禮包碼嗎？此操作無法撤銷。")) {
      const codeToDelete = giftCodes.find(code => code.id === id);
      const updatedCodes = giftCodes.filter(code => code.id !== id);
      setGiftCodes(updatedCodes);
      toast({
        title: "禮包碼已刪除",
        description: `已刪除禮包碼 ${codeToDelete?.code}`,
      });
    }
  };
  
  const handleEdit = (code: GiftCode) => {
    setIsEditMode(true);
    setSelectedCode(code);
    setFormData({
      code: code.code,
      reward: code.reward,
      type: code.type,
      description: code.description,
      expiryDate: code.expiryDate,
      isActive: code.isActive,
      maxUses: code.maxUses
    });
    setIsDialogOpen(true);
  };
  
  const resetForm = () => {
    setIsEditMode(false);
    setSelectedCode(null);
    setFormData({
      code: "",
      reward: 10000,
      type: "節慶禮包",
      description: "",
      expiryDate: "",
      isActive: true,
      maxUses: null
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>禮包碼管理</CardTitle>
            <CardDescription>
              創建和管理禮包碼，可用於系統內兌換獎勵
            </CardDescription>
          </div>
          <Button 
            onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            新增禮包碼
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="搜尋禮包碼或描述"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select 
              value={filterType} 
              onValueChange={setFilterType}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="所有類型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">所有類型</SelectItem>
                {uniqueTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>禮包碼</TableHead>
                  <TableHead>類型</TableHead>
                  <TableHead>獎勵點數</TableHead>
                  <TableHead>狀態</TableHead>
                  <TableHead>到期日期</TableHead>
                  <TableHead>兌換統計</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGiftCodes.length > 0 ? (
                  filteredGiftCodes.map((code) => (
                    <TableRow key={code.id}>
                      <TableCell>
                        <div className="font-medium">{code.code}</div>
                        <div className="text-sm text-muted-foreground">{code.description}</div>
                      </TableCell>
                      <TableCell>{code.type}</TableCell>
                      <TableCell>{code.reward.toLocaleString()}</TableCell>
                      <TableCell>
                        {code.isActive ? (
                          <Badge>有效</Badge>
                        ) : (
                          <Badge variant="secondary">已失效</Badge>
                        )}
                      </TableCell>
                      <TableCell>{code.expiryDate}</TableCell>
                      <TableCell>
                        {code.usedCount} / {code.maxUses || "無限"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(code)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(code.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      沒有找到符合條件的禮包碼
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            共 {filteredGiftCodes.length} 個禮包碼
          </div>
          <div className="text-sm text-muted-foreground">
            有效禮包碼: {filteredGiftCodes.filter(c => c.isActive).length} | 
            已過期: {filteredGiftCodes.filter(c => !c.isActive).length}
          </div>
        </CardFooter>
      </Card>
      
      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "編輯禮包碼" : "新增禮包碼"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? "修改禮包碼內容，點擊保存完成編輯" 
                : "填寫以下資料創建新的禮包碼"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="code">禮包碼 *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  className="uppercase"
                  disabled={isEditMode}
                  placeholder="NEWYEAR2025"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">類型 *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({...formData, type: value})}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="節慶禮包">節慶禮包</SelectItem>
                    <SelectItem value="活動禮包">活動禮包</SelectItem>
                    <SelectItem value="新用戶禮包">新用戶禮包</SelectItem>
                    <SelectItem value="季節禮包">季節禮包</SelectItem>
                    <SelectItem value="VIP專屬">VIP專屬</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">描述 *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="禮包內容描述"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="reward">獎勵點數 *</Label>
                <Input
                  id="reward"
                  type="number"
                  value={formData.reward}
                  onChange={(e) => setFormData({...formData, reward: Number(e.target.value)})}
                  placeholder="10000"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expiryDate">到期日期 *</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="maxUses">最大兌換次數 (可選)</Label>
                <Input
                  id="maxUses"
                  type="number"
                  value={formData.maxUses !== null ? formData.maxUses : ""}
                  onChange={(e) => {
                    const val = e.target.value === "" ? null : Number(e.target.value);
                    setFormData({...formData, maxUses: val});
                  }}
                  placeholder="無限制"
                />
              </div>
              <div className="flex items-center gap-2 mt-7">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <Label htmlFor="isActive" className="cursor-pointer">啟用禮包碼</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleCreateOrEdit}>
              {isEditMode ? "保存更改" : "創建禮包碼"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Card>
        <CardHeader>
          <CardTitle>禮包碼使用統計</CardTitle>
          <CardDescription>
            查看禮包碼兌換情況和點數發放統計
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary">
            <TabsList className="mb-4">
              <TabsTrigger value="summary">總覽</TabsTrigger>
              <TabsTrigger value="recent">最近兌換</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-md">總禮包碼數量</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{giftCodes.length}</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      有效: {giftCodes.filter(c => c.isActive).length} | 
                      無效: {giftCodes.filter(c => !c.isActive).length}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-md">總兌換次數</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {giftCodes.reduce((sum, code) => sum + code.usedCount, 0).toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      通過 {giftCodes.length} 種禮包碼
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-md">總發放點數</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {giftCodes.reduce((sum, code) => sum + (code.reward * code.usedCount), 0).toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      平均每次: {Math.round(giftCodes.reduce((sum, code) => sum + (code.reward * code.usedCount), 0) / 
                        Math.max(1, giftCodes.reduce((sum, code) => sum + code.usedCount, 0))).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="recent">
              <div className="text-center py-8 text-muted-foreground">
                <Gift className="h-12 w-12 mx-auto mb-2" />
                <p>暫無兌換記錄數據</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
