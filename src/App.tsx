
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { SyncProvider } from "@/context/SyncContext";
import { WalletProvider } from "@/context/WalletContext";
import { VipProvider } from "@/context/VipContext";
import { AdminProvider } from "@/context/AdminContext";
import { ProductProvider } from "@/context/ProductContext";
import { InfoServicesProvider } from "@/context/InfoServicesContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AiCustomerService } from "@/components/customer-service/AiCustomerService";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Wallet from "./pages/Wallet";
import DailyNovel from "./pages/DailyNovel";
import MangaFox from "./pages/MangaFox";
import Admin from "./pages/Admin";
import BackendManagement from "./pages/BackendManagement";
import VipRewards from "./pages/VipRewards";
import WishPool from "./pages/WishPool";
import GiftCode from "./pages/GiftCode";
import CouponRedemption from "./pages/CouponRedemption";
import ScanBarcode from "./pages/ScanBarcode";
import Weather from "./pages/Weather";
import News from "./pages/News";
import Inbox from "./pages/Inbox";
import BalloonGame from "./pages/BalloonGame";
import DartGame from "./pages/DartGame";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient();

// 客服系統載入函數
const loadCustomerService = () => {
  // 檢查是否已經載入過
  if (document.querySelector('script[src*="salesmartly.com"]')) {
    return;
  }
  
  const script = document.createElement('script');
  script.src = 'https://plugin-code.salesmartly.com/js/project_316560_325192_1745729147.js';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
};

function App() {
  useEffect(() => {
    // 載入客服系統
    loadCustomerService();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AuthProvider>
            <SyncProvider>
              <WalletProvider>
                <VipProvider>
                  <AdminProvider>
                    <ProductProvider>
                      <InfoServicesProvider>
                        <BrowserRouter>
                          <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/wallet" element={<Wallet />} />
                            <Route path="/daily-novel" element={<DailyNovel />} />
                            <Route path="/manga" element={<MangaFox />} />
                            <Route path="/admin" element={<Admin />} />
                            <Route path="/backend" element={<BackendManagement />} />
                            <Route path="/vip-rewards" element={<VipRewards />} />
                            <Route path="/wish-pool" element={<WishPool />} />
                            <Route path="/gift-code" element={<GiftCode />} />
                            <Route path="/coupon-redemption" element={<CouponRedemption />} />
                            <Route path="/scan-barcode" element={<ScanBarcode />} />
                            <Route path="/weather" element={<Weather />} />
                            <Route path="/news" element={<News />} />
                            <Route path="/inbox" element={<Inbox />} />
                            <Route path="/balloon-game" element={<BalloonGame />} />
                            <Route path="/dart-game" element={<DartGame />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                          <AiCustomerService />
                          <Toaster />
                        </BrowserRouter>
                      </InfoServicesProvider>
                    </ProductProvider>
                  </AdminProvider>
                </VipProvider>
              </WalletProvider>
            </SyncProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
