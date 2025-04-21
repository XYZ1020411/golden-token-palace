
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Ticket, Gift } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { useProduct } from "@/context/ProductContext";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const CouponRedemption = () => {
  const { toast } = useToast();
  const { balance, addTransaction } = useWallet();
  const { products, purchaseProduct } = useProduct();
  const [redeeming, setRedeeming] = useState<string | null>(null);

  const handleRedeem = async (productId: string, productName: string, productPrice: number) => {
    if (balance < productPrice) {
      toast({
        title: "點數不足",
        description: "您的點數餘額不足以兌換此商品券",
        variant: "destructive",
      });
      return;
    }

    setRedeeming(productId);
    try {
      const barcode = await purchaseProduct(productId);
      
      if (barcode) {
        await addTransaction({
          amount: -productPrice,
          type: "exchange",
          description: `兌換商品券: ${productName}`
        });

        toast({
          title: "兌換成功",
          description: `您已成功兌換 ${productName}，條碼已生成至您的收件箱`,
        });
      } else {
        throw new Error("兌換失敗");
      }
    } catch (error) {
      toast({
        title: "兌換失敗",
        description: "請稍後再試",
        variant: "destructive",
      });
    } finally {
      setRedeeming(null);
    }
  };

  return (
    <TooltipProvider>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.filter(p => p.available).map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{product.name}</CardTitle>
                <Ticket className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between gap-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-primary">
                  {product.price.toLocaleString()} 點
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm text-muted-foreground cursor-help">
                      查看優惠說明
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>兌換後，您可在個人收件箱找到條碼</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Button
                className="w-full flex items-center gap-2"
                onClick={() => handleRedeem(product.id, product.name, product.price)}
                disabled={redeeming === product.id || balance < product.price}
              >
                <Gift className="h-4 w-4" />
                {redeeming === product.id ? "兌換中..." : "立即兌換"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
};
