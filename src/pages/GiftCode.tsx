
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useWallet } from "@/context/WalletContext";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Gift, Ticket } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GiftCodeRecord {
  id: string;
  code: string;
  reward: number;
  type: string;
  redeemDate: string;
}

interface AvailableGiftCode {
  id: string;
  name: string;
  description: string;
  endDate: string;
  isLimited: boolean;
  isHoliday: boolean;
}

const mockGiftCodeHistory: GiftCodeRecord[] = [
  {
    id: "1",
    code: "NEWYEAR2025",
    reward: 50000,
    type: "節慶禮包",
    redeemDate: "2025-01-01"
  },
  {
    id: "2",
    code: "WELCOME100K",
    reward: 100000,
    type: "新用戶禮包",
    redeemDate: "2025-04-15"
  },
  {
    id: "3",
    code: "VIP888888",
    reward: 8888,
    type: "VIP專屬",
    redeemDate: "2025-04-28"
  }
];

const mockAvailableCodes: AvailableGiftCode[] = [
  {
    id: "1",
    name: "端午節慶禮包",
    description: "慶祝端午節特別禮包，可獲得88,888點獎勵",
    endDate: "2025-06-10",
    isLimited: true,
    isHoliday: true
  },
  {
    id: "2",
    name: "週年慶特別禮包",
    description: "慶祝平台週年慶，可獲得100,000點獎勵",
    endDate: "2025-07-15",
    isLimited: false,
    isHoliday: false
  },
  {
    id: "3",
    name: "母親節感恩禮包",
    description: "母親節特別活動禮包，可獲得66,666點獎勵",
    endDate: "2025-05-10",
    isLimited: true,
    isHoliday: true
  },
  {
    id: "4",
    name: "VIP專屬禮包",
    description: "僅限VIP用戶領取的特別獎勵",
    endDate: "2025-12-31",
    isLimited: false,
    isHoliday: false
  }
];

// Mock successful gift codes for testing
const successfulGiftCodes = [
  "DRAGON2025",  // Dragon Year celebration
  "SPRING888",   // Spring Festival
  "MAY520",      // May 20 (I love you day in Chinese culture)
  "SUMMER666",   // Summer gift
  "AUTUMN888",   // Autumn festival
  "WINTER2025",  // Winter celebration
];

const GiftCode = () => {
  const { user, isAuthenticated } = useAuth();
  const { addTransaction } = useWallet();
  const navigate = useNavigate();
  
  const [giftCode, setGiftCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redeemHistory, setRedeemHistory] = useState<GiftCodeRecord[]>(mockGiftCodeHistory);

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleRedeemCode = () => {
    if (!giftCode.trim()) {
      toast({
        title: "兌換失敗",
        description: "請輸入禮包碼",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Check if code is in our test successful codes list
      if (successfulGiftCodes.includes(giftCode)) {
        // Generate random reward between 10,000 and 100,000
        const reward = Math.floor(Math.random() * 90000) + 10000;
        
        // Add transaction
        addTransaction({
          amount: reward,
          type: "system",
          description: `禮包碼兌換: ${giftCode}`,
        });
        
        // Add to history
        const newRecord: GiftCodeRecord = {
          id: (redeemHistory.length + 1).toString(),
          code: giftCode,
          reward,
          type: "節慶禮包",
          redeemDate: new Date().toISOString().split('T')[0]
        };
        
        setRedeemHistory([newRecord, ...redeemHistory]);
        
        toast({
          title: "兌換成功！",
          description: `您已成功兌換禮包碼 ${giftCode}，獲得 ${reward.toLocaleString()} 點獎勵！`,
        });
        
        setGiftCode("");
      } else {
        toast({
          title: "兌換失敗",
          description: "無效的禮包碼或該禮包碼已使用",
          variant: "destructive"
        });
      }
      
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <MainLayout showBackButton>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">禮包碼兌換</h1>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gift className="mr-2 h-5 w-5" />
                兌換禮包碼
              </CardTitle>
              <CardDescription>
                輸入有效的禮包碼以獲得獎勵
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="請輸入禮包碼"
                  value={giftCode}
                  onChange={(e) => setGiftCode(e.target.value.toUpperCase())}
                  className="uppercase"
                />
                <Button 
                  onClick={handleRedeemCode} 
                  disabled={isSubmitting || !giftCode.trim()}
                >
                  {isSubmitting ? "兌換中..." : "兌換"}
                </Button>
              </div>
              
              <div className="text-sm">
                <p>提示：目前可用的測試禮包碼：</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge>DRAGON2025</Badge>
                  <Badge>SPRING888</Badge>
                  <Badge>MAY520</Badge>
                  <Badge>SUMMER666</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>禮包碼說明</CardTitle>
              <CardDescription>
                了解如何獲取和使用禮包碼
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">禮包碼類型</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>節慶禮包：特定節日或活動期間發放</li>
                    <li>新用戶禮包：僅限新註冊用戶使用</li>
                    <li>VIP專屬：根據會員等級獲得不同獎勵</li>
                    <li>活動禮包：參與特定活動獲得</li>
                    <li>社群禮包：在社交媒體或官方頻道獲得</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">使用說明</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>每個禮包碼只能兌換一次</li>
                    <li>某些禮包碼有使用期限，請在有效期內兌換</li>
                    <li>兌換成功後，獎勵將立即添加到您的帳戶中</li>
                    <li>如遇兌換問題，請聯繫客服團隊</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="history">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history">兌換紀錄</TabsTrigger>
            <TabsTrigger value="available">可領取禮包</TabsTrigger>
          </TabsList>
          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>兌換紀錄</CardTitle>
                <CardDescription>
                  您的禮包碼兌換歷史記錄
                </CardDescription>
              </CardHeader>
              <CardContent>
                {redeemHistory.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>禮包碼</TableHead>
                        <TableHead>獎勵</TableHead>
                        <TableHead>類型</TableHead>
                        <TableHead className="text-right">兌換日期</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {redeemHistory.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.code}</TableCell>
                          <TableCell>{record.reward.toLocaleString()}</TableCell>
                          <TableCell>{record.type}</TableCell>
                          <TableCell className="text-right">{record.redeemDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Ticket className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">您尚未兌換任何禮包碼</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="available" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>可領取禮包</CardTitle>
                <CardDescription>
                  當前可領取的禮包活動
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {mockAvailableCodes.map((code) => (
                    <Card key={code.id}>
                      <CardHeader className="py-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg flex items-center">
                            <Gift className="h-4 w-4 mr-2" />
                            {code.name}
                          </CardTitle>
                          <div className="flex gap-2">
                            {code.isHoliday && (
                              <Badge variant="outline" className="bg-red-500 text-white">節慶</Badge>
                            )}
                            {code.isLimited && (
                              <Badge variant="outline" className="bg-amber-500 text-white">限時</Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2">
                        <p className="text-sm mb-2">{code.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            有效期至: {code.endDate}
                          </span>
                          <Button size="sm">查看詳情</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default GiftCode;
