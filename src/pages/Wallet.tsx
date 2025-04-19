
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useWallet, Transaction } from "@/context/WalletContext";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, ArrowRight, Gift, ArrowLeft } from "lucide-react";

const Wallet = () => {
  const { user, isAuthenticated } = useAuth();
  const { balance, transactions, transfer, gift } = useWallet();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [transferType, setTransferType] = useState<"transfer" | "gift">("transfer");
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("zh-TW").format(num);
  };

  const handleTransferSubmit = async () => {
    if (!recipient || !amount || parseInt(amount) <= 0) {
      toast({
        title: "輸入錯誤",
        description: "請輸入有效的收款人和金額",
        variant: "destructive",
      });
      return;
    }

    if (parseInt(amount) > balance) {
      toast({
        title: "點數不足",
        description: "您的點數餘額不足以完成此交易",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    let success = false;

    try {
      if (transferType === "transfer") {
        success = await transfer(parseInt(amount), recipient);
      } else {
        success = await gift(parseInt(amount), recipient);
      }

      if (success) {
        toast({
          title: "交易成功",
          description: `已成功${
            transferType === "transfer" ? "轉帳" : "贈送"
          } ${formatNumber(parseInt(amount))} 點給 ${recipient}`,
        });
        setTransferDialogOpen(false);
        setRecipient("");
        setAmount("");
      } else {
        toast({
          title: "交易失敗",
          description: "無法完成交易，請檢查收款人資訊或稍後再試",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "交易失敗",
        description: "發生錯誤，請稍後再試",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (transaction: Transaction) => {
    switch (transaction.type) {
      case "transfer":
        return transaction.fromUser === user?.username ? (
          <ArrowRight className="h-4 w-4 text-destructive" />
        ) : (
          <ArrowLeft className="h-4 w-4 text-green-500" />
        );
      case "gift":
        return transaction.fromUser === user?.username ? (
          <Gift className="h-4 w-4 text-destructive" />
        ) : (
          <Gift className="h-4 w-4 text-green-500" />
        );
      case "daily":
        return <Gift className="h-4 w-4 text-green-500" />;
      case "vip":
        return <Gift className="h-4 w-4 text-primary" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getTransactionTitle = (transaction: Transaction) => {
    switch (transaction.type) {
      case "transfer":
        return transaction.fromUser === user?.username
          ? `轉帳至 ${transaction.toUser}`
          : `從 ${transaction.fromUser} 收到轉帳`;
      case "gift":
        return transaction.fromUser === user?.username
          ? `贈送給 ${transaction.toUser}`
          : `從 ${transaction.fromUser} 收到禮物`;
      case "daily":
        return "每日簽到獎勵";
      case "vip":
        return "VIP獎勵";
      case "exchange":
        return "商品兌換";
      case "admin":
        return "管理員操作";
      default:
        return "系統操作";
    }
  };

  const getAmountColor = (transaction: Transaction) => {
    if (transaction.amount > 0) {
      return "text-green-500";
    } else {
      return "text-destructive";
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">錢包系統</h1>
          <p className="text-muted-foreground">管理您的點數、交易與轉帳</p>
        </div>

        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle>當前點數餘額</CardTitle>
            <CardDescription>您可用於交易的點數</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold text-primary">
                {formatNumber(balance)}
              </div>
              <div className="flex gap-2">
                <Dialog
                  open={transferDialogOpen}
                  onOpenChange={setTransferDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>點數操作</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>點數操作</DialogTitle>
                      <DialogDescription>
                        選擇您要進行的點數操作類型
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Tabs defaultValue="transfer" className="w-full mt-4" onValueChange={(value) => setTransferType(value as "transfer" | "gift")}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="transfer">轉帳</TabsTrigger>
                        <TabsTrigger value="gift">贈送</TabsTrigger>
                      </TabsList>
                      <TabsContent value="transfer" className="mt-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="recipient">收款人用戶名</Label>
                            <Input
                              id="recipient"
                              placeholder="輸入收款人用戶名"
                              value={recipient}
                              onChange={(e) => setRecipient(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="amount">轉帳金額</Label>
                            <Input
                              id="amount"
                              placeholder="輸入轉帳金額"
                              type="number"
                              min="1"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                              可用點數: {formatNumber(balance)}
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="gift" className="mt-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="recipient">禮物接收人</Label>
                            <Input
                              id="recipient"
                              placeholder="輸入禮物接收人用戶名"
                              value={recipient}
                              onChange={(e) => setRecipient(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="amount">禮物金額</Label>
                            <Input
                              id="amount"
                              placeholder="輸入禮物金額"
                              type="number"
                              min="1"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                              可用點數: {formatNumber(balance)}
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    <DialogFooter className="mt-4">
                      <Button 
                        type="submit" 
                        disabled={loading}
                        onClick={handleTransferSubmit}
                      >
                        {loading ? "處理中..." : "確認交易"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>交易歷史</CardTitle>
            <CardDescription>您的點數流水與交易記錄</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                        {getTransactionIcon(transaction)}
                      </div>
                      <div>
                        <div className="font-medium">
                          {getTransactionTitle(transaction)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className={`font-bold ${getAmountColor(transaction)}`}>
                      {transaction.amount > 0 ? "+" : ""}
                      {formatNumber(transaction.amount)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  尚無交易記錄
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Wallet;
