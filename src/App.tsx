
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProductProvider } from "@/context/ProductContext";
import { VipProvider } from "@/context/VipContext";
import { WalletProvider } from "@/context/WalletContext";
import { InfoServicesProvider } from "@/context/InfoServicesContext";
import { AdminProvider } from "@/context/AdminContext";

// Pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import Admin from "@/pages/Admin";
import BackendManagement from "@/pages/BackendManagement";
import Wallet from "@/pages/Wallet";
import News from "@/pages/News";
import Inbox from "@/pages/Inbox";
import VipRewards from "@/pages/VipRewards";
import MangaFox from "@/pages/MangaFox";
import DailyNovel from "@/pages/DailyNovel";
import WishPool from "@/pages/WishPool";
import Weather from "@/pages/Weather";
import BalloonGame from "@/pages/BalloonGame";
import DartGame from "@/pages/DartGame";
import GiftCode from "@/pages/GiftCode";
import ScanBarcode from "@/pages/ScanBarcode";

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AuthProvider>
          <ProductProvider>
            <VipProvider>
              <WalletProvider>
                <InfoServicesProvider>
                  <AdminProvider>
                    <Toaster />
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="/admin/backend" element={<BackendManagement />} />
                      <Route path="/wallet" element={<Wallet />} />
                      <Route path="/news" element={<News />} />
                      <Route path="/inbox" element={<Inbox />} />
                      <Route path="/vip-rewards" element={<VipRewards />} />
                      <Route path="/manga-fox" element={<MangaFox />} />
                      <Route path="/daily-novel" element={<DailyNovel />} />
                      <Route path="/wish-pool" element={<WishPool />} />
                      <Route path="/weather" element={<Weather />} />
                      <Route path="/games/balloon" element={<BalloonGame />} />
                      <Route path="/games/dart" element={<DartGame />} />
                      <Route path="/gift-code" element={<GiftCode />} />
                      <Route path="/scan" element={<ScanBarcode />} />
                      <Route path="/novel-system" element={<Navigate to="/manga-fox" replace />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AdminProvider>
                </InfoServicesProvider>
              </WalletProvider>
            </VipProvider>
          </ProductProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
