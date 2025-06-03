
import { useState } from "react";
import { useProduct } from "@/context/ProductContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Gift, Calendar, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GiftCodeManagement = () => {
  const { giftCodes, addGiftCode, updateGiftCode, deleteGiftCode } = useProduct();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    reward: "",
    type: "",
    description: "",
    expiryDate: "",
    maxUses: "",
    isActive: true
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      code: "",
      reward: "",
      type: "",
      description: "",
      expiryDate: "",
      maxUses: "",
      isActive: true
    });
    setEditingCode(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.reward || !formData.type || !formData.expiryDate) {
      toast({
        title: "錯誤",
        description: "請填寫所有必填欄位",
        variant: "destructive"
      });
      return;
    }

    const giftCodeData = {
      code: formData.code.toUpperCase(),
      reward: parseInt(formData.reward),
      type: formData.type,
      description: formData.description,
      expiryDate: formData.expiryDate,
      maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
      isActive: formData.isActive
    };

    let success = false;
    
    if (editingCode) {
      success = await updateGiftCode(editingCode, giftCodeData);
    } else {
      success = await addGiftCode(giftCodeData);
    }

    if (success) {
      setShowAddDialog(false);
      resetForm();
    }
  };

  const handleEdit = (code: any) => {
    setFormData({
      code: code.code,
      reward: code.reward.toString(),
      type: code.type,
      description: code.description,
      expiryDate: code.expiryDate,
      maxUses: code.maxUses?.toString() || "",
      isActive: code.isActive
    });
    setEditingCode(code.id);
    setShowAddDialog(true);
  };

  const handleDelete = async (id: string) => {
    await deleteGiftCode(id);
  };

  const handleToggleStatus = async (code: any) => {
    await updateGiftCode(code.id, { isActive: !code.isActive });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">禮包碼管理</h2>
          <p className="text-muted-foreground">管理系統禮包碼的創建、編輯和狀態</p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              新增禮包碼
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCode ? "編輯禮包碼" : "新增禮包碼"}</DialogTitle>
              <DialogDescription>
                設定禮包碼的詳細資訊
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">禮包碼</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  placeholder="輸入禮包碼"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reward">獎勵點數</Label>
                <Input
                  id="reward"
                  type="number"
                  value={formData.reward}
                  onChange={(e) => setFormData({...formData, reward: e.target.value})}
                  placeholder="輸入獎勵點數"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">禮包類型</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="選擇禮包類型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="節慶禮包">節慶禮包</SelectItem>
                    <SelectItem value="新用戶禮包">新用戶禮包</SelectItem>
                    <SelectItem value="VIP禮包">VIP禮包</SelectItem>
                    <SelectItem value="活動禮包">活動禮包</SelectItem>
                    <SelectItem value="補償禮包">補償禮包</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">描述</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="禮包描述"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiryDate">到期日期</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxUses">最大使用次數 (留空為無限制)</Label>
                <Input
                  id="maxUses"
                  type="number"
                  value={formData.maxUses}
                  onChange={(e) => setFormData({...formData, maxUses: e.target.value})}
                  placeholder="最大使用次數"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit">
                  {editingCode ? "更新" : "創建"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                  取消
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {giftCodes.map((code) => (
          <Card key={code.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-4 w-4" />
                    {code.code}
                  </CardTitle>
                  <CardDescription>{code.description}</CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant={code.isActive ? "default" : "secondary"}>
                    {code.isActive ? "啟用" : "停用"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">獎勵:</span>
                    <div className="text-green-600 font-semibold">
                      {code.reward.toLocaleString()} 點
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">類型:</span>
                    <div>{code.type}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>到期: {code.expiryDate}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>
                    使用: {code.usedCount}
                    {code.maxUses ? ` / ${code.maxUses}` : " / 無限制"}
                  </span>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(code)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant={code.isActive ? "secondary" : "default"}
                    onClick={() => handleToggleStatus(code)}
                  >
                    {code.isActive ? "停用" : "啟用"}
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>確認刪除</AlertDialogTitle>
                        <AlertDialogDescription>
                          確定要刪除禮包碼 "{code.code}" 嗎？此操作無法復原。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(code.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          刪除
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {giftCodes.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">尚未創建任何禮包碼</p>
            <Button className="mt-4" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              創建第一個禮包碼
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>禮包碼統計</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{giftCodes.length}</div>
              <div className="text-sm text-muted-foreground">總禮包碼</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {giftCodes.filter(code => code.isActive).length}
              </div>
              <div className="text-sm text-muted-foreground">啟用中</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {giftCodes.reduce((sum, code) => sum + code.usedCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">總使用次數</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {giftCodes.reduce((sum, code) => sum + (code.reward * code.usedCount), 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">總發放點數</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GiftCodeManagement;
