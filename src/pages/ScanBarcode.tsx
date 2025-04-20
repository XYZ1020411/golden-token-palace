
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useProduct } from "@/context/ProductContext";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { ScanBarcode as ScanBarcodeIcon, ArrowLeft } from "lucide-react";

const ScanBarcode = () => {
  const { user, isAuthenticated } = useAuth();
  const { scanBarcode, dailyUsageCode } = useProduct();
  const navigate = useNavigate();
  const [barcode, setBarcode] = useState("");
  const [scannedCoupon, setScannedCoupon] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated || user?.role !== "admin") {
    navigate("/login");
    return null;
  }

  const handleScanBarcode = async () => {
    if (!barcode.trim()) {
      toast({
        title: "錯誤",
        description: "請輸入條碼",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await scanBarcode(barcode);
      if (result) {
        setScannedCoupon(result);
        toast({
          title: "成功",
          description: "條碼掃描成功",
        });
      } else {
        toast({
          title: "錯誤",
          description: "無效條碼或條碼已被使用",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "錯誤",
        description: "掃描失敗，請重試",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setBarcode("");
    setScannedCoupon(null);
  };

  const handleReturn = () => {
    navigate("/admin");
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">條碼掃描</h1>
            <p className="text-muted-foreground">掃描客戶條碼並生成使用碼</p>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-1" 
            onClick={handleReturn}
          >
            <ArrowLeft className="h-4 w-4" />
            返回管理介面
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ScanBarcodeIcon className="mr-2 h-5 w-5" />
              條碼掃描
            </CardTitle>
            <CardDescription>掃描客戶購買商品後生成的條碼</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">輸入或掃描條碼</label>
                <div className="flex gap-2">
                  <Input
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="請輸入條碼編號"
                    className="flex-1"
                  />
                  <Button onClick={handleScanBarcode} disabled={loading}>
                    {loading ? "處理中..." : "掃描"}
                  </Button>
                  <Button variant="outline" onClick={handleClear}>
                    清除
                  </Button>
                </div>
              </div>

              {scannedCoupon && (
                <div className="border rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold text-lg">掃描結果</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">優惠券 ID:</div>
                    <div>{scannedCoupon.id}</div>
                    
                    <div className="text-muted-foreground">條碼:</div>
                    <div>{scannedCoupon.barcode}</div>
                    
                    <div className="text-muted-foreground">建立時間:</div>
                    <div>{new Date(scannedCoupon.createdAt).toLocaleString()}</div>
                    
                    <div className="text-muted-foreground">今日使用碼:</div>
                    <div className="font-bold text-primary">{dailyUsageCode}</div>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">
                      此使用碼每日會自動更新，請客戶出示此使用碼以驗證優惠券。
                    </p>
                  </div>
                </div>
              )}
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">使用說明</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>輸入客戶的商品條碼</li>
                  <li>點擊「掃描」按鈕處理條碼</li>
                  <li>系統將顯示今日的使用碼</li>
                  <li>請客戶輸入此使用碼以兌換商品</li>
                  <li>使用碼將於每日晚上7點自動更新</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ScanBarcode;
