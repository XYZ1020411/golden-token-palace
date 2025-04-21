
import { useProduct } from "@/context/ProductContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Inbox, Gift, Package2 } from "lucide-react";

const InboxPage = () => {
  const { coupons, products } = useProduct();
  const { user } = useAuth();

  // 顯示目前用戶的券
  const myCoupons = coupons.filter(c => c.userId === user?.id);

  return (
    <div className="max-w-2xl mx-auto py-8 px-2">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <Inbox /> 我的收件夾
      </h1>
      {myCoupons.length === 0 && (
        <div className="text-muted-foreground text-center py-24">
          尚無已兌換或購買的商品券／商品條碼
        </div>
      )}
      <div className="space-y-5">
        {myCoupons.map(coupon => {
          const product = products.find(p => p.id === coupon.productId);
          return (
            <Card key={coupon.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {product ? (
                    <>
                      {product.name}{" "}
                      <span>
                        {product.name.includes("券") ? (
                          <Gift className="inline w-4 h-4 text-primary" />
                        ) : (
                          <Package2 className="inline w-4 h-4 text-primary" />
                        )}
                      </span>
                    </>
                  ) : "未知商品"}
                </CardTitle>
                <CardDescription>
                  {product?.description ?? ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-3 rounded bg-muted font-mono text-lg tracking-wider select-all">
                  發行條碼：{coupon.barcode}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  產生於：{new Date(coupon.createdAt).toLocaleString()}
                </div>
                {coupon.usageCode && (
                  <div className="mt-2 text-xs text-primary">
                    已核銷 | 利用碼: {coupon.usageCode}
                  </div>
                )}
                {coupon.redeemedAt && (
                  <div className="mt-2 text-xs text-green-700">
                    已使用 | {new Date(coupon.redeemedAt).toLocaleString()}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default InboxPage;
