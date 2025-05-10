
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { CouponRedemption as CouponRedemptionComponent } from "@/components/product/CouponRedemption";

const CouponRedemption = () => {
  return (
    <MainLayout showBackButton>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">商品兌換中心</h1>
          <p className="text-muted-foreground">使用您的積分兌換各種實體商品</p>
        </div>
        
        <CouponRedemptionComponent />
      </div>
    </MainLayout>
  );
};

export default CouponRedemption;
