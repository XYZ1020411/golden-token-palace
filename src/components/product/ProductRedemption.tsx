
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Package2, Gift } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

interface Product {
  id: string;
  name: string;
  description: string;
  points: number;
  stock: number;
}

const products: Product[] = [
  {
    id: "1",
    name: "精美手機殼",
    description: "適用於多款機型的高質量手機保護殼",
    points: 50000,
    stock: 100
  },
  {
    id: "2",
    name: "無線藍牙耳機",
    description: "高音質立體聲藍牙耳機",
    points: 150000,
    stock: 50
  },
  {
    id: "3",
    name: "限量版T恤",
    description: "獨特設計的限量版T恤",
    points: 80000,
    stock: 30
  }
];

export const ProductRedemption = () => {
  const { toast } = useToast();
  const { balance, addTransaction } = useWallet();
  const [redeeming, setRedeeming] = useState<string | null>(null);

  const handleRedeem = async (product: Product) => {
    if (balance < product.points) {
      toast({
        title: "點數不足",
        description: "您的點數餘額不足以兌換此商品",
        variant: "destructive",
      });
      return;
    }

    setRedeeming(product.id);
    try {
      await addTransaction({
        amount: -product.points,
        type: "exchange",
        description: `兌換商品: ${product.name}`
      });

      toast({
        title: "兌換成功",
        description: `您已成功兌換 ${product.name}`,
      });
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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Card key={product.id} className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{product.name}</CardTitle>
              <Package2 className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>{product.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between gap-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-primary">
                {product.points.toLocaleString()} 點
              </span>
              <span className="text-sm text-muted-foreground">
                庫存: {product.stock}
              </span>
            </div>
            <Button
              className="w-full flex items-center gap-2"
              onClick={() => handleRedeem(product)}
              disabled={redeeming === product.id || balance < product.points}
            >
              <Gift className="h-4 w-4" />
              {redeeming === product.id ? "兌換中..." : "立即兌換"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
