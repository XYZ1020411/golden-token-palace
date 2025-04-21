import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  available: boolean;
}

export interface Coupon {
  id: string;
  productId: string;
  userId: string;
  barcode: string;
  createdAt: string;
  redeemedAt?: string;
  usageCode?: string;
}

interface ProductContextType {
  products: Product[];
  coupons: Coupon[];
  dailyUsageCode: string;
  lastCodeUpdateTime: string;
  addProduct: (product: Omit<Product, "id">) => Promise<boolean>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  purchaseProduct: (productId: string) => Promise<string | null>;
  redeemCoupon: (barcode: string) => Promise<Coupon | null>;
  verifyCoupon: (couponId: string, usageCode: string) => Promise<boolean>;
  generateDailyUsageCode: () => string;
  scanBarcode: (barcode: string) => Promise<Coupon | null>;
}

// Mock data for products
let mockProducts: Product[] = [
  {
    id: "1",
    name: "星巴克咖啡券",
    description: "可兌換一杯中杯星巴克咖啡",
    price: 20000,
    available: true
  },
  {
    id: "2",
    name: "電影票券",
    description: "全台電影院通用電影票一張",
    price: 50000,
    available: true
  },
  {
    id: "3",
    name: "高級餐廳禮券",
    description: "價值2000元的高級餐廳禮券",
    price: 200000,
    available: true
  }
];

// Mock data for coupons
let mockCoupons: Coupon[] = [];

// Generate a random string of specified length
const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    if (i > 0 && i % 4 === 0) result += '-';
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

// Generate a barcode
const generateBarcode = (): string => {
  return `${Date.now().toString().slice(-12)}`;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [dailyUsageCode, setDailyUsageCode] = useState<string>(generateRandomString(8));
  const [lastCodeUpdateTime, setLastCodeUpdateTime] = useState<string>(new Date().toISOString());

  // Generate a new daily usage code
  const generateDailyUsageCode = (): string => {
    const newCode = generateRandomString(8);
    setDailyUsageCode(newCode);
    setLastCodeUpdateTime(new Date().toISOString());
    return newCode;
  };

  // Generate new usage code at 7 PM daily
  useEffect(() => {
    const checkAndUpdateCode = () => {
      const now = new Date();
      if (now.getHours() === 19 && now.getMinutes() === 0 && now.getSeconds() === 0) {
        generateDailyUsageCode();
        
        // Send notification to all users
        console.log("Sending notification to all users about new usage code");
      }
    };

    const intervalId = setInterval(checkAndUpdateCode, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Add a new product
  const addProduct = async (product: Omit<Product, "id">): Promise<boolean> => {
    if (!user || user.role !== "admin") {
      return false;
    }
    
    const newProduct: Product = {
      ...product,
      id: Date.now().toString()
    };
    
    mockProducts = [...mockProducts, newProduct];
    setProducts(mockProducts);
    
    return true;
  };

  // Update an existing product
  const updateProduct = async (id: string, updates: Partial<Product>): Promise<boolean> => {
    if (!user || user.role !== "admin") {
      return false;
    }
    
    mockProducts = mockProducts.map(p => 
      p.id === id ? { ...p, ...updates } : p
    );
    
    setProducts(mockProducts);
    
    return true;
  };

  // Delete a product
  const deleteProduct = async (id: string): Promise<boolean> => {
    if (!user || user.role !== "admin") {
      return false;
    }
    
    mockProducts = mockProducts.filter(p => p.id !== id);
    setProducts(mockProducts);
    
    return true;
  };

  // Purchase a product (generates a coupon with barcode)
  const purchaseProduct = async (productId: string): Promise<string | null> => {
    if (!user) {
      return null;
    }
    const product = products.find(p => p.id === productId);
    if (!product || !product.available) return null;

    // 產生條碼，並給用戶自動產生一張 coupon 存收件夾
    const barcode = generateBarcode();

    const newCoupon = {
      id: Date.now().toString(),
      productId,
      userId: user.id,
      barcode,
      createdAt: new Date().toISOString(),
    };
    mockCoupons = [...mockCoupons, newCoupon];
    setCoupons(mockCoupons);

    // now the user's inbox (coupon list)會自動出現
    return barcode;
  };

  // Admin scans barcode and generates a redemption coupon
  const scanBarcode = async (barcode: string): Promise<Coupon | null> => {
    if (!user || user.role !== "admin") {
      return null;
    }
    
    const coupon = mockCoupons.find(c => c.barcode === barcode && !c.usageCode);
    if (!coupon) {
      return null;
    }
    
    // Update the coupon with a usage code
    const updatedCoupon: Coupon = {
      ...coupon,
      usageCode: dailyUsageCode
    };
    
    mockCoupons = mockCoupons.map(c => 
      c.id === coupon.id ? updatedCoupon : c
    );
    
    setCoupons(mockCoupons);
    
    return updatedCoupon;
  };

  // Redeem a coupon using its barcode
  const redeemCoupon = async (barcode: string): Promise<Coupon | null> => {
    if (!user) {
      return null;
    }
    
    const coupon = mockCoupons.find(c => c.barcode === barcode && !c.redeemedAt);
    if (!coupon) {
      return null;
    }
    
    return coupon;
  };

  // Verify a coupon using its ID and the current usage code
  const verifyCoupon = async (couponId: string, usageCode: string): Promise<boolean> => {
    if (!user || user.role !== "admin") {
      return false;
    }
    
    const coupon = mockCoupons.find(c => c.id === couponId);
    if (!coupon || coupon.redeemedAt) {
      return false;
    }
    
    if (usageCode !== dailyUsageCode) {
      return false;
    }
    
    // Mark the coupon as redeemed
    const updatedCoupon: Coupon = {
      ...coupon,
      redeemedAt: new Date().toISOString()
    };
    
    mockCoupons = mockCoupons.map(c => 
      c.id === couponId ? updatedCoupon : c
    );
    
    setCoupons(mockCoupons);
    
    return true;
  };

  return (
    <ProductContext.Provider value={{
      products,
      coupons,
      dailyUsageCode,
      lastCodeUpdateTime,
      addProduct,
      updateProduct,
      deleteProduct,
      purchaseProduct,
      redeemCoupon,
      verifyCoupon,
      generateDailyUsageCode,
      scanBarcode
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};
