
import { useState } from "react";
import { useProduct } from "@/context/ProductContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { ScanBarcode, Clipboard, RefreshCw } from "lucide-react";

export const RedemptionCodeManagement = () => {
  const { 
    products, 
    coupons, 
    dailyUsageCode, 
    lastCodeUpdateTime, 
    generateDailyUsageCode 
  } = useProduct();
  
  const [barcode, setBarcode] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  
  const handleGenerateNewCode = () => {
    const newCode = generateDailyUsageCode();
    toast({
      title: "新兌換碼已產生",
      description: `新的每日兌換碼: ${newCode}`,
    });
  };
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(dailyUsageCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    toast({
      title: "已複製兌換碼",
      description: "兌換碼已複製到剪貼簿",
    });
  };
  
  const lastUpdatedTime = new Date(lastCodeUpdateTime).toLocaleString("zh-TW");
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>每日兌換碼</CardTitle>
          <CardDescription>
            管理每日兌換碼，用於商品兌換時驗證
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="current-code">當前兌換碼</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="current-code" 
                  value={dailyUsageCode} 
                  readOnly 
                  className="font-mono"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleCopyCode}
                >
                  <Clipboard className={`h-4 w-4 ${copiedCode ? "text-green-500" : ""}`} />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                最後更新時間: {lastUpdatedTime}
              </p>
            </div>
            
            <Button 
              onClick={handleGenerateNewCode}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              產生新兌換碼
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>掃描條碼</CardTitle>
          <CardDescription>
            掃描用戶條碼以驗證並兌換商品
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex items-end gap-2">
              <div className="flex-1 space-y-2">
                <Label htmlFor="barcode">輸入條碼</Label>
                <Input
                  id="barcode"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="輸入用戶條碼..."
                />
              </div>
              <Button 
                className="flex gap-2 items-center"
                onClick={() => {
                  if (!barcode) {
                    toast({
                      title: "無效條碼",
                      description: "請輸入有效條碼",
                      variant: "destructive"
                    });
                    return;
                  }
                  
                  toast({
                    title: "掃描成功",
                    description: "條碼已掃描，請使用每日兌換碼驗證",
                  });
                }}
              >
                <ScanBarcode className="h-4 w-4" />
                掃描條碼
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>兌換碼記錄</CardTitle>
          <CardDescription>
            查看已使用的兌換碼記錄
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">有效兌換碼</TabsTrigger>
              <TabsTrigger value="redeemed">已兌換</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="space-y-4 mt-4">
              {coupons.filter(c => !c.redeemedAt).length > 0 ? (
                <div className="space-y-4">
                  {coupons.filter(c => !c.redeemedAt).map(coupon => {
                    const product = products.find(p => p.id === coupon.productId);
                    return (
                      <div key={coupon.id} className="flex items-center justify-between p-4 bg-card border rounded-md">
                        <div>
                          <p className="font-medium">{product?.name}</p>
                          <p className="text-sm text-muted-foreground">條碼: {coupon.barcode}</p>
                          <p className="text-sm text-muted-foreground">
                            建立於: {new Date(coupon.createdAt).toLocaleString("zh-TW")}
                          </p>
                        </div>
                        <Badge>未兌換</Badge>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  目前沒有未兌換的條碼
                </div>
              )}
            </TabsContent>
            <TabsContent value="redeemed" className="space-y-4 mt-4">
              {coupons.filter(c => c.redeemedAt).length > 0 ? (
                <div className="space-y-4">
                  {coupons.filter(c => c.redeemedAt).map(coupon => {
                    const product = products.find(p => p.id === coupon.productId);
                    return (
                      <div key={coupon.id} className="flex items-center justify-between p-4 bg-card border rounded-md">
                        <div>
                          <p className="font-medium">{product?.name}</p>
                          <p className="text-sm text-muted-foreground">條碼: {coupon.barcode}</p>
                          <p className="text-sm text-muted-foreground">
                            兌換於: {new Date(coupon.redeemedAt || "").toLocaleString("zh-TW")}
                          </p>
                        </div>
                        <Badge variant="outline">已兌換</Badge>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  目前沒有已兌換的條碼
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
